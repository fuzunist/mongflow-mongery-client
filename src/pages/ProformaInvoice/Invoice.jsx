import Card from "@/components/Card";
import Modal from "@/components/Modal";
import {
  addOrderToDB,
  createOrderNumberInDB,
  delOrderNumberFromDB,
  updateOrderInDB,
} from "@/services/order";
import store from "@/store";
import {
  addOrder,
  clearSelectProducts,
  delSelectProduct,
  delSelectSet,
  editOrder,
  editSelectProduct,
  editSelectProductDelivery,
  editSelectProductWeight,
  editSelectSet,
  setCustomer,
  setOrderNumber,
} from "@/store/actions/apps";
import {
  useExchangeRates,
  useOrderNumber,
  useOrders,
  useSelectedProducts,
  useSelectedSets,
  useExpenses,
  useProducts,
} from "@/store/hooks/apps";
import { useUser } from "@/store/hooks/user";
import { calculateAverageType } from "@/utils/apps";
import invoiceToPDF from "@/utils/invoiceToPDF";
import invoiceToPDF_Eng from "@/utils/invoiceToPDF_Eng";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { formatFloat, formatDigits } from "@/utils/helpers";
import { HiOutlinePrinter } from "react-icons/hi";
import { BlobProvider } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF/InvoicePDF";
import { DatePicker, Input, Select, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/tr_TR";
import "dayjs/locale/tr";

const Option=Select.Option;

const Invoice = ({ selectedCustomer, editingOrder }) => {
  const user = useUser();
  const products = useProducts();
  const orders = useOrders();
  const orderNumber = useOrderNumber();
  const selectedProducts = useSelectedProducts();
  const selectedSets = useSelectedSets();
  const exchangeRates = useExchangeRates();
  const expenses = useExpenses();
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [orderDetails, setOrderDetails] = useState({});

  const onChangeDetail = (value, name) => {
     console.log(value, name)
    setOrderDetails({ ...orderDetails, [name]: value });
  };
  // console.log("orderDetails, ", orderDetails);
  // console.log("333 selectedProducts", selectedProducts);

  const totalProductQuantity = useMemo(() => {
    if (!editingOrder || !editingOrder.products) return 0;

    return editingOrder.products.reduce((total, product) => {
      return total + (product.quantity || 0);
    }, 0);
  }, [editingOrder]);

  const TLtoUSD = parseFloat(
    exchangeRates?.find((exchangeRate) => exchangeRate.currency_code === "USD")
      ?.banknote_selling
  );

  const hourlyExpenseCost = expenses[0]?.hourly_cost / TLtoUSD;

  const [initialValues, setInitialValues] = useState({
    beginningOrderStatus: editingOrder?.order_status ?? "İş Alındı",
    formattedDate:
      editingOrder?.order_date?.split("T")[0] ??
      `${new Date().getDate().toString().padStart(2, "0")}/${(
        new Date().getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${new Date().getFullYear()}`,
    currencyCode: editingOrder?.currency_code ?? "USD",
    exchange_rate: editingOrder?.exchange_rate ?? 0.0,
    taxRate: 0.2,
  });

  const totalPrice = useMemo(() => {
    const _selectedProducts = selectedProducts.map(
      (product) => Number(product.totalPrice)
    );
    const _selectedSets = selectedSets.map((set) => set.totalPrice);
    _selectedProducts.push(..._selectedSets);
    return _selectedProducts.reduce((a, b) => a + b, 0);
  }, [selectedProducts, selectedSets]);

   console.log("order det 101",orderDetails )
  const onSubmit = async () => {
    const data = {
      customer_id: selectedCustomer.customerid,
      currency_code: initialValues.currencyCode,
      order_status: initialValues.beginningOrderStatus,
      order_date: new Date().toISOString(),
      order_number: orderNumber,
      products: selectedProducts,
      sets: selectedSets,
      subtotal: totalPrice,
      tax_rate: initialValues.taxRate,
      total_with_tax: totalPrice * (1 + initialValues.taxRate),
      exchange_rate: initialValues.exchange_rate,
      valid_date: orderDetails.valid_date,
      delivery_terms: orderDetails.delivery_terms,
      delivery_point: orderDetails.delivery_point,
      payment_type: orderDetails.payment_type,
      maturity: orderDetails.maturity,
      notes: orderDetails.notes,
      vat_declaration: orderDetails.vat_declaration,
      vat_witholding_rate: orderDetails.vat_witholding_rate,
      vat_witholding: orderDetails.vat_witholding,
    };

    const response = await addOrderToDB(user.tokens.access_token, data);

    if (response.order_id) {
      setSuccessMessage(t("order_added_successfully"));
      addOrder({
        ...response,
        username: user.username,
        currency_code: initialValues.currencyCode,
        customer: { ...selectedCustomer },
      });
      setTimeout(() => {
        setCustomer(null);
        clearSelectProducts();
        setSuccessMessage("");
        setInitialValues((val) => ({
          ...val,
          exchange_rate: 0.0,
          currencyCode: "TL",
          taxRate: 0.2,
        }));
        setOrderNumber("");
      }, 1000);
    } else {
      console.error("Operation unsuccessful. Response from server:", response);
    }
  };

  const onEdit = async () => {
    const orderStatusNumber = calculateAverageType({
      products: selectedProducts,
      sets: selectedSets,
    });
    const orderStatus =
      orderStatusNumber === 0
        ? "İş Alındı"
        : orderStatusNumber === 3
        ? "İş Tamamen Bitti"
        : "Hazırlıklar Başladı";

    const response = await updateOrderInDB(
      user.tokens.access_token,
      editingOrder.order_id,
      selectedCustomer.customerid,
      initialValues.currencyCode,
      selectedProducts,
      selectedSets,
      totalPrice,
      totalPrice * (1 + initialValues.taxRate),
      orderStatus
    );

    if (response.order_id) {
      console.log(
        "Order updated successfully with OrderID:",
        response.order_id
      );
      setSuccessMessage(t("order_updated_successfully"));
      editOrder({
        ...response,
        username: user.username,
        currency_code: initialValues.currencyCode,
        customer: { ...selectedCustomer },
      });
      setTimeout(() => {
        setCustomer(null);
        clearSelectProducts();
        setSuccessMessage("");
        navigate("/apps/orders");
      }, 1000);
    } else {
      console.error(
        "Operation unsuccessful. Response from server:",
        response?.error
      );
    }
  };

  const newAttr =
    selectedProducts.length !== 0 &&
    selectedProducts?.map((product, index) => {
      //  console.log("product s117 ", product)
      const attributes = products.find(
        (item) => item.product_id === product.product_id
      ).attributes;
      //  console.log(attributes," attributea s117")

      return Object.fromEntries(
        Object.entries(product.attributes).map(([key, value]) => {
          //  console.log("s117 key val", key,value)
          const packaging = attributes.find(
            (attr) => attr.attribute_name === key
          )?.packaging;
          //  console.log("packaging s117", packaging)
          return [key, { value: value, packaging: packaging }];
        })
      );
    });
  // console.log("new attr 333", newAttr);

  const prodx = selectedProducts?.map((product, index) => {
    // Check if newAttributes[index] exists and is an array
    const newAttributesObject =
      Array.isArray(newAttr) && newAttr.length !== 0 ? newAttr[index] : [];

    // console.log("333 newAttributesObject", newAttributesObject);

    return {
      name: product.product_name,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
      totalPrice: product.totalPrice,
      delivery_date: product.delivery_date,
      //   techSpecs: Object.entries(newAttributesObject)
      // .filter(([key, value]) => !value.packaging)
      // .map(([key, value]) => ({ [key]: value })),
      techSpecs: Object.entries(newAttributesObject)
        .filter(([key, value]) => !value.packaging)
        .reduce((acc, [key, value]) => {
          return { ...acc, [key]: value, weight: product.weight };
        }, {}),
      packagingSpecs: Object.entries(newAttributesObject)
        .filter(([key, value]) => value.packaging)
        .map(([key, value]) => ({ [key]: value })),
    };
  });

  // console.log("333 prodx", prodx);

  const totalProductsQuantity = useMemo(() => {
    if (!selectedProducts || selectedProducts.length === 0) return 0;

    return selectedProducts.reduce((total, product) => {
      return total + (product.quantity || 0);
    }, 0);
  }, [selectedProducts]);
  const pdfData = {
    initialValues: initialValues,
    selectedProducts: selectedProducts,
    user: user,
    selectedCustomer: selectedCustomer,
    totalPrice: totalPrice,
    totalWithTax: totalPrice + orderDetails.vat_declaration,
    totalTax: initialValues.taxRate*totalPrice,
    taxRate: initialValues.taxRate * 100,
    currencyCode: initialValues.currencyCode,
    orderNumber: orderNumber,
    maturity: orderDetails?.maturity,
    valid_date: orderDetails?.valid_date,
    delivery_terms: orderDetails?.delivery_terms,
    delivery_point: orderDetails?.delivery_point,
    payment_type: orderDetails?.payment_type,
    notes: orderDetails?.notes,
    order_responsible: user.username,
    newAttributes: newAttr,
    totalQuantity: totalProductsQuantity,
    vatDeclaration: orderDetails?.vat_declaration,
    vatWitholding: orderDetails?.vat_witholding

  };
  console.log("pdf Data,", pdfData);
  const onClick = () => {
    if (i18n.language.includes("tr"))
      return invoiceToPDF(
        initialValues,
        selectedProducts,
        selectedSets,
        user,
        selectedCustomer,
        totalPrice,
        1 + initialValues.taxRate,
        orderNumber
      );
    if (i18n.language.includes("en"))
      return invoiceToPDF_Eng(
        initialValues,
        selectedProducts,
        selectedSets,
        user,
        selectedCustomer,
        totalPrice,
        1 + initialValues.taxRate,
        orderNumber
      );
  };

  useEffect(() => {
    if (selectedCustomer && !editingOrder && !orderNumber) {
      createOrderNumberInDB(user.tokens.access_token)
        .then((response) => {
          console.log("createOrderNumberFromDB response: ", response);
          setOrderNumber(response.order_number);
        })
        .catch((e) => console.log("createOrderNumberFromDB error: ", e));
    }
  }, [selectedCustomer, editingOrder]);

  useEffect(() => {
    return () => {
      if (
        !editingOrder &&
        store.getState().apps.orderNumber &&
        !orders.find(
          (order) => order.order_number === store.getState().apps.orderNumber
        )
      ) {
        delOrderNumberFromDB(
          user.tokens.access_token,
          store.getState().apps.orderNumber
        );
        setOrderNumber("");
      }
    };
  }, []);
  const excludedCosts = [
    "domestic_market_marketing",
    "foreign_market_marketing",
    "production_manager",
  ];

  if (!selectedCustomer) return null;
  return (
    <Card>
      <Card.Body>
        {successMessage && (
          <p className="text-green-500 mb-4">{successMessage}</p>
        )}
        <div
          className="flex flex-col text-lg gap-4 mb-4 overflow-x-scroll"
          id="invoice"
        >
          <div className="flex justify-between items-start">
            <div className=" flex flex-1 flex-col gap-2">
              <span>
                <span className="font-semibold">{t("companyname")}:</span>{" "}
                {selectedCustomer.companyname}
              </span>
              <span>
                <span className="font-semibold">{t("taxid")}:</span>{" "}
                {selectedCustomer.taxid}
              </span>
              <span>
                <span className="font-semibold">{t("taxoffice")}:</span>{" "}
                {selectedCustomer.taxoffice}
              </span>
              <span>
                <span className="font-semibold">{t("phone")}:</span>{" "}
                {selectedCustomer.phone}
              </span>
              <span>
                <span className="font-semibold">{t("email")}:</span>{" "}
                {selectedCustomer.email}
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-2 items-end">
              <span>
                <span className="font-semibold">
                  {t("order_creation_date")}:
                </span>{" "}
                {initialValues.formattedDate}
              </span>
              <span>
                <span className="font-semibold">{t("order_status")}:</span>{" "}
                {t(initialValues.beginningOrderStatus)}
              </span>
              <span>
                <span className="font-semibold">{t("order_number")}:</span>{" "}
                {editingOrder?.order_number ?? orderNumber}
              </span>
              <span>
                <span className="font-semibold">{t("order_responsible")}:</span>{" "}
                {user.username}
              </span>
            </div>
          </div>
          <hr className="w-full border-border-light dark:border-border-dark" />
          <div className="flex flex-col gap-2 justify-center border border-border-light dark:border-border-dark relative p-4 mt-4 mb-2">
            <div className="flex flex-wrap text-center font-medium">
              <span
                className={`${
                  excludedCosts.includes(user.usertype)
                    ? "basis-[calc(15%_-_0.5rem)] "
                    : editingOrder
                    ? "basis-[calc(10%_-_0.5rem)] "
                    : "basis-[calc(15%_-_0.5rem)] "
                } mx-1`}
              >
                {t("product")}
              </span>
              <span className="basis-[calc(25%_-_0.5rem)] mx-1 ">
                {t("attributes")}
              </span>
              <span className="basis-[calc(10%_-_0.5rem)] mx-1 ">
                {t("quantity")}
              </span>
              <span className="basis-[calc(10%_-_0.5rem)] mx-1 ">
                {t("weight")}
              </span>
              <span className="basis-[calc(10%_-_0.5rem)] mx-1 ">
                {t("deliveryDate")}
              </span>
              {editingOrder && !excludedCosts.includes(user.usertype) && (
                <span className="basis-[calc(15%_-_0.5rem)] mx-1 ">
                  {t("recipeCost")}
                </span>
              )}
              <span className="basis-[calc(10%_-_0.5rem)] mx-1">
                {t("unitPrice")}
              </span>
              {editingOrder && !excludedCosts.includes(user.usertype) && (
                <span className="basis-[calc(15%_-_0.5rem)] mx-1 ">
                  {t("totalRecipeCost")}
                </span>
              )}
              <span
                className={`${
                  editingOrder
                    ? "basis-[calc(15%_-_0.5rem)] "
                    : "basis-[calc(20%_-_0.5rem)] "
                } mx-1`}
              >
                {t("total")}
              </span>
            </div>
          </div>
          <hr className="w-full border-border-light dark:border-border-dark" />

          <div className="flex flex-col gap-y-2 justify-center ml-3">
            {selectedProducts.map((product, index) => (
              <div className="flex text-center ml-1" key={index}>
                <span
                  className={`${
                    excludedCosts.includes(user.usertype)
                      ? "basis-[calc(15%_-_0.5rem)] "
                      : editingOrder
                      ? "basis-[calc(10%_-_0.5rem)] "
                      : "basis-[calc(15%_-_0.5rem)] "
                  } mx-1  hover:line-through hover:text-red-500 cursor-pointer `}
                  onClick={() => delSelectProduct(index)}
                >
                  {product.product_name}
                </span>
                <span className="basis-[calc(25%_-_0.5rem)] flex flex-col text-sm">
                  {Object.entries(product.attributes).map(
                    ([attrName, attrValue], index) => (
                      <span key={index}>
                        {attrName}: {attrValue}
                      </span>
                    )
                  )}
                </span>
                <span className="basis-[calc(10%_-_0.5rem)] mx-1">
                  {product.quantity} {t(product.productType)}
                </span>
                <span className="basis-[calc(10%_-_0.5rem)] mx-1">
                  <Modal
                    text={product?.weight ?? 0}
                    className=" mx-1 cursor-pointer select-none"
                  >
                    <input
                      type="number"
                      placeholder="Ağırlık Girin (kg)"
                      value={product?.weight}
                      onChange={(e) =>
                        editSelectProductWeight(index, e.target.value)
                      }
                      className="w-full py-2 transition-all outline-none bg-input-bg-light dark:bg-input-bg-dark border rounded border-input-border-light dark:border-input-border-dark"
                    />
                  </Modal>
                </span>
                <span className="basis-[calc(10%_-_0.5rem)] mx-1">
                  <Modal
                    text={product?.delivery_date ?? " Tarih Seçiniz"}
                    className=" mx-1 cursor-pointer select-none"
                  >
                    <DatePicker
                      locale={locale}
                      format={"DD/MM/YYYY"}
                      placeholder="Tarih Girin"
                      onChange={(e) => {
                        return editSelectProductDelivery(
                          index,
                          dayjs(e).format("DD/MM/YYYY")
                        );
                      }}
                      className="w-full py-2 transition-all outline-none bg-input-bg-light dark:bg-input-bg-dark border rounded border-input-border-light dark:border-input-border-dark"
                    />
                  </Modal>
                </span>
                {editingOrder && !excludedCosts.includes(user.usertype) && (
                  <span className="basis-[calc(15%_-_0.5rem)] mx-1 ">
                    {formatDigits(product.unitCost)}
                  </span>
                )}
                <span className="basis-[calc(10%_-_0.5rem)] mx-1">
                  <Modal
                    text={product.unitPrice}
                    className=" mx-1 cursor-pointer select-none"
                  >
                    <input
                      type="number"
                      value={product.unitPrice}
                      onChange={(e) =>
                        editSelectProduct(index, e.target.valueAsNumber)
                      }
                      className="w-full py-2 transition-all outline-none bg-input-bg-light dark:bg-input-bg-dark border rounded border-input-border-light dark:border-input-border-dark"
                    />
                  </Modal>
                </span>
                {editingOrder && !excludedCosts.includes(user.usertype) && (
                  <span className="basis-[calc(15%_-_0.5rem)] mx-1">
                    {/* //ton cinsinden maliyet -- bunker to ton */}
                    {formatDigits(product.totalCost * 0.4444)}{" "}
                  </span>
                )}

                <span
                  className={`mx-1 ${
                    editingOrder
                      ? "basis-[calc(15%_-_0.5rem)]"
                      : "basis-[calc(20%_-_0.5rem)]"
                  }`}
                >
                  {formatDigits(product.totalPrice)}
                </span>
              </div>
            ))}

            {selectedSets.map((set, index) => (
              <div
                className="flex flex-wrap text-center items-center"
                key={set.set_id}
              >
                <span
                  className="basis-[calc(24%_-_0.5rem)] mx-1  hover:line-through hover:text-red-500 cursor-pointer"
                  onClick={() => delSelectSet(index)}
                >
                  {set.set_name}
                </span>
                <span className="basis-[calc(30%_-_0.5rem)] mx-1  flex flex-col text-sm">
                  <div className="flex flex-col gap-2">
                    {set.products.map((product, indx) => (
                      <div className="flex flex-col gap-1" key={indx}>
                        <span className="font-bold">
                          {product.product_name} x{product.quantity} (
                          {product.productType})
                        </span>
                        <div className="flex flex-col">
                          {Object.entries(product.attributes).map(
                            ([attrName, attrValue], index) => (
                              <span key={index}>
                                {attrName}: {attrValue}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </span>
                <span className="basis-[calc(10%_-_0.5rem)] mx-1 ">
                  {set.quantity} {t(set.productType)}
                </span>
                <Modal
                  className="basis-[calc(12%_-_0.5rem)] mx-1 cursor-pointer select-none"
                  text={set.unitPrice.toFixed(2)}
                >
                  <input
                    type="number"
                    value={set.unitPrice}
                    onChange={(e) =>
                      editSelectSet(index, e.target.valueAsNumber)
                    }
                    className="w-full py-2  transition-all outline-none bg-input-bg-light dark:bg-input-bg-dark border rounded border-input-border-light dark:border-input-border-dark"
                  />
                </Modal>
                <span className="basis-[calc(24%_-_0.5rem)] mx-1 ">
                  {set.totalPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex  justify-end ">
              <div className="flex mx-1 ">
                <span>
                  <span className="font-semibold">{t("nettotal")}:</span>{" "}
                  {formatDigits(totalPrice)}
                </span>
              </div>
            </div>
            <div className="flex justify-end ">
              <div className="flex mx-1 ">
                <span className="font-semibold">{t("vat")}:</span>
                <Select
                  value={initialValues.taxRate}
                  onChange={(e) =>
                    setInitialValues((initialValues) => ({
                      ...initialValues,
                      taxRate: parseFloat(e),
                    }))
                  }
                >
                  <Option value={0}>%0</Option>
                  <Option value={0.1}>%10</Option>
                  <Option value={0.18}>%18</Option>
                  <Option value={0.2}>%20</Option>
                </Select>
              </div>
            </div>

            <div className="flex  justify-end ">
              <div className=" mx-1 flex items-center">
              <span className="font-semibold">{t("Tevkifat Oranı")}:</span>
                  <Select 
                   className="w-48" 
                   onChange={async (e) => {
                    // onChangeDetail(e, "vat_witholding_rate")
                    setOrderDetails((prev)=>({...prev, vat_witholding_rate:e }))
                    setOrderDetails((prev)=>({...prev, vat_witholding:initialValues?.taxRate*totalPrice*e }))
                    setOrderDetails((prev)=>({...prev, vat_declaration:initialValues?.taxRate*totalPrice*(1-e) }))
                    setOrderDetails((prev)=>({...prev, taxTotal:totalPrice+ initialValues?.taxRate*totalPrice*(1-e) }))

                  //  await onChangeDetail(formatDigits(initialValues?.taxRate*totalPrice*e), "vat_witholding")
                  //  await onChangeDetail(formatDigits(initialValues?.taxRate*totalPrice*(1-e)), "vat_declaration")

                  
                  }}
                   value={orderDetails.vat_witholding_rate}
                  >
                   {
                    [0,0.1,0.2,0.3,0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((item)=>(
                      <Option key={item} value={item}
                      name="vat_witholding_rate"
                     >
                        {item===0 ? "Tevkifat Yok" : item===1 ? "Tamamına Tevkifat Uygula" : item*10+"/10"}
                      </Option>
                    ))
                   }
                  </Select>
              </div>
            </div>

            <div className="flex  justify-end ">
              <div className="flex mx-1 ">
                <span>
                  <span className="font-semibold">{t("KDV")}{"( %"}{initialValues.taxRate*100}{" )"}:</span>{" "}
                  {formatDigits(initialValues?.taxRate*totalPrice)}
                </span>
              </div>
            </div>

            <div className="flex  justify-end ">
              <div className="flex mx-1 ">
                <span>
                  <span className="font-semibold">{t("KDV Tevkifat")}:</span>{" "}
                  { orderDetails?.vat_witholding_rate ? orderDetails.vat_witholding : 0}
                </span>
              </div>
            </div>

            <div className="flex  justify-end ">
              <div className="flex mx-1 ">
                <span>
                  <span className="font-semibold">{t("KDV Beyan")}:</span>{" "}
                  {orderDetails?.vat_witholding_rate ? orderDetails.vat_declaration : 0}
                </span>
              </div>
            </div>

          </div>
          

          <hr className="w-full border-border-light dark:border-border-dark" />
          <div className="flex flex-wrap justify-end text-end">
            <div className="basis-[calc(34%_-_0.5rem)] mx-1 ">
              {editingOrder && !excludedCosts.includes(user.usertype) && (
                <div className="flex flex-col justify-end">
                  <span className=" ">
                    {t("totalRecipeCost")}:{" "}
                    {formatDigits(parseFloat(editingOrder.total_cost))}{" "}
                    {editingOrder.currency_code}
                  </span>
                  <span className=" ">
                    {t("totalCost")}:
                    {/* 0.6 sabit 1 ton ürün için harcanan süre, order.totalCost top reçete maliyeti */}
                    {(
                      (Number(editingOrder.total_cost) !== 0
                        ? hourlyExpenseCost *
                          0.6 *
                          (totalProductQuantity / 1000) // totalProductQuantity kg -> ton cinsine çevirdim
                        : 0) + Number(editingOrder.total_cost)
                    ).toFixed(2)}{" "}
                    {editingOrder.currency_code}
                  </span>
                </div>
              )}

              <span className="flex font-semibold text-lg gap-2 justify-end mt-4">
                <Modal
                  text={
                    <span className="flex flex-col justify-center items-center">
                      {initialValues.currencyCode}{" "}
                      {initialValues.currencyCode !== "USD" && (
                        <span className="text-sm">
                          ({initialValues.exchange_rate}
                          {` `}USD)
                        </span>
                      )}
                    </span>
                  }
                >
                  <select
                    value={initialValues.currencyCode}
                    onChange={(e) =>
                      setInitialValues((val) =>
                        e.target.value === "TL"
                          ? {
                              ...val,
                              currencyCode: e.target.value,
                              exchange_rate: (
                                1 /
                                parseFloat(
                                  exchangeRates?.find(
                                    (exchangeRate) =>
                                      exchangeRate.currency_code === "USD"
                                  )?.banknote_selling
                                )
                              ).toFixed(4),
                            }
                          : {
                              ...val,
                              currencyCode: e.target.value,
                              exchange_rate: parseFloat(
                                exchangeRates?.find(
                                  (exchangeRate) =>
                                    exchangeRate.currency_code ===
                                    (e.target.value === "EURO"
                                      ? "EUR"
                                      : e.target.value)
                                )?.banknote_selling
                              ),
                            }
                      )
                    }
                    className="w-full py-2 px-3 transition-all outline-none bg-input-bg-light dark:bg-input-bg-dark border rounded border-input-border-light dark:border-input-border-dark"
                  >
                    {["USD", "EURO", "TL"].map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {initialValues.currencyCode !== "USD" && (
                    <input
                      type="number"
                      value={initialValues.exchange_rate}
                      onChange={(e) =>
                        setInitialValues((val) => ({
                          ...val,
                          exchange_rate: e.target.valueAsNumber,
                        }))
                      }
                      className="mt-4 w-full py-2 px-3 transition-all outline-none bg-input-bg-light dark:bg-input-bg-dark border rounded border-input-border-light dark:border-input-border-dark"
                    />
                  )}
                </Modal>{" "}
                <span>{t("taxed_total")}:</span>{" "}
                {orderDetails?.vat_witholding_rate ? orderDetails.taxTotal  : 0}
              </span>
            </div>
          </div>
          <hr className="w-full border-border-light dark:border-border-dark" />
        </div>
        <div className="grid grid-cols-3 w-full justify-center text-center gap-3 gap-x-8 px-4 my-6">
          <div className="flex flex-row -space-x-4">
            <Input
              className="w-44 text-black disabled:text-black disabled:cursor-default"
              disabled
              variant="filled"
              value={"Geçerlilik Opsiyonu"}
              placeholder="Geçerlilik Opsiyonu"
            />
            <DatePicker
              showTime
              name="valid_date"
              format="DD-MM-YYYY HH:mm"
              locale={locale}
              prevIcon="Geçerlilik Opsiyonu"
              onChange={(e) => onChangeDetail(e, "valid_date")}
              className="rounded-l-none flex-1"
            />
          </div>
          <div>
            <Input
              addonBefore="Teslimat Şartları"
              name="delivery_terms"
              onChange={(e) => onChangeDetail(e.target.value, e.target.name)}
            />
          </div>
          <div>
            <Input
              addonBefore="Teslimat Noktası"
              name="delivery_point"
              onChange={(e) => onChangeDetail(e.target.value, e.target.name)}
            />
          </div>
          <div>
            <Input
              addonBefore="Ödeme Şekli"
              name="payment_type"
              onChange={(e) => onChangeDetail(e.target.value, e.target.name)}
            />
          </div>
          <div>
            <Input
              addonBefore="Vade"
              name="maturity"
              onChange={(e) => onChangeDetail(e.target.value, e.target.name)}
            />
          </div>
          <div>
            <Input
              className="resize-y"
              addonBefore="Notlar"
              name="notes"
              onChange={(e) => onChangeDetail(e.target.value, e.target.name)}
            />
          </div>
        </div>
        <hr className="w-full border-border-light dark:border-border-dark" />

        <div className="flex flex-wrap justify-center text-center gap-2 px-4">
          <BlobProvider document={<InvoicePDF data={pdfData} />}>
            {({ url, blob }) => (
              <a
                href={url}
                target="_blank"
                style={{
                  padding: "0.5rem 1rem", // py-2 px-4
                  borderRadius: "0.375rem", // rounded
                  backgroundColor: "#5b69bc", // bg-purple
                  color: "#fff", // text-white
                  fontWeight: "600", // font-semibold
                  cursor: "pointer",
                }}
              >
                {/* <HiOutlinePrinter size={14} /> */}
                <span>PDF Kaydet </span>
              </a>
            )}
          </BlobProvider>
          <button
            onClick={editingOrder ? onEdit : onSubmit}
            className="py-2 px-4 rounded bg-purple hover:bg-purple-hover text-white font-semibold"
          >
            {editingOrder ? t("update") : t("create")}
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Invoice;
