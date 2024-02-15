import ProductStockForm from "@/components/AntForm/ProductStockForm";
import { addProductStockLogToDB } from "@/services/lastproductstocks";
import {
  addLastProductStock,
  addLastProductStockLog,
  addLastProductStockWarehouse,
  addRawMaterialStock,
  addRawMaterialStockLog,
  addRecipeMaterialStock,
  addRecipeMaterialStockLog,
  editLastProductStockWarehouse,
} from "@/store/actions/apps";
import {
  useCustomers,
  useExchangeRates,
  useProduct,
  useProducts,
  useLastProductStockWarehouse
} from "@/store/hooks/apps";
import { useUser } from "@/store/hooks/user";
import {
  transformToFloat,
} from "@/utils/helpers";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCityOptions } from "@/utils/getCityOptions";
import dayjs from "dayjs";
import { addRawStockLogToDB } from "@/services/rawmaterialstocks";
import { addRecipeStockLogToDB } from "@/services/recipematerialstocks";
import { _addLastProductStockWarehouse } from "@/store/reducers/apps";

const CreateStock = ({ closeModal, editing = false, selected, page }) => {
  const [fields, setFields] = useState(null);
  const exchangeRates = useExchangeRates();
  const user = useUser();
  const customers = useCustomers();
  const products = useProducts();
  const selectedProduct = useProduct();
  const warehouseStocks= useLastProductStockWarehouse()
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState("TL");
  const [pageForm, setPageForm] = useState({});
  const { t } = useTranslation();

   console.log("warehouseStocks", warehouseStocks)
  useEffect(() => {
    console.log("page form", pageForm);
    console.log("page", page);
    switch (page) {
      case "lastProductStocks":
        setPageForm({
          addToDB: addProductStockLogToDB,
          addStock: addLastProductStock,
          addLog: addLastProductStockLog,
          addWarehouseStock :addLastProductStockWarehouse,
          editWarehouseStock: editLastProductStockWarehouse,
          products: products.filter((prod) => prod.product_type === 0),
        });
        break;

      case "recipeMaterialStocks":
        setPageForm({
          addToDB: addRecipeStockLogToDB,
          addStock: addRecipeMaterialStock,
          addLog: addRecipeMaterialStockLog,
          products: products.filter((prod) => prod.product_type === 1),
        });
        break;
      case "rawMaterialStocks":
        setPageForm({
          addToDB: addRawStockLogToDB,
          addStock: addRawMaterialStock,
          addLog: addRawMaterialStockLog,
          products: products.filter((prod) => prod.product_type === 2),
        });
        break;

      default:
        break;
    }
  }, [page, products]);

  const cityOptions = getCityOptions();
  const currencyRate = useMemo(() => {
    return parseFloat(
      exchangeRates?.find(
        (exchangeRate) => exchangeRate.currency_code === currency
      )?.banknote_selling ?? 1
    );
  }, [currency]);

  const initialValues = useMemo(() => {
    return {
      product_id: { value: "", options: pageForm.products, label: "Ürün" },
      attributes: { value: {}, options: [], label: "Özellikler" },
      price: { value: 0, label: "Birim Fiyat" },
      quantity: { value: 0, label: "Miktar (ton)" },
      waybill: { value: "", label: "İrsaliye No" },
      date: { value: "", label: "İrsaliye Tarihi" },
      customer_id: {
        value: "",
        options: customers.filter((cus) => cus.customer_type.includes(2)),
        label: "Tedarikçi",
      },
      address: { value: "", label: "Adres", options: cityOptions },
      payment_type: {
        value: "",
        label: "Ödeme Şekli",
        options: ["Kredi Kartı", "Nakit", "Çek"],
      },
      payment_date: { value: "", label: "Ödeme Tarihi" },
      currency: {
        value: currency,
        label: "Döviz",
        options: ["TL", "USD", "EUR"],
      },
      exchange_rate: { value: currencyRate, label: "Döviz Kuru" },
      details: { value: "", label: "Alım Detayı" },
    };
  }, [customers, products, pageForm]);

  useEffect(() => {
    const field = Object.entries(initialValues).map(([key, value]) => ({
      name: key,
      value: value?.value,
    }));

    setFields(field);
  }, [initialValues]);

  const onSubmit = async (values) => {
    setError("");
    const data = {
      ...values,
      customer_city: values.address[0],
      customer_county: values.address[1],
      date: dayjs(values.date, {
        locale: "tr-TR",
        format: "DD/MM/YYYY",
      }).toISOString(),
      payment_date: dayjs(values.payment_date, {
        locale: "tr-TR",
        format: "DD/MM/YYYY",
      }).toISOString(),
      userid: user.userid,
      price: transformToFloat(values.price * values.exchange_rate),
    };
    delete data["address"];

    const response = await pageForm.addToDB(user.tokens.access_token, data);
    console.log("response", response);

    if (response?.error) return setError(response.error);
    pageForm.addStock(response.stocks);
    pageForm.addLog(response.logs);
    if(response.insertedWarehouseStock){
        pageForm.addWarehouseStock(response.insertedWarehouseStock)
    }
    if(response.updatedWarehouseStock){
        pageForm.editWarehouseStock(response.updatedWarehouseStock)
    }
    closeModal();
  };

  const onEdit = async (values, { setSubmitting }) => {
    // setError('')
    // const response = await updateStockToDB(user.tokens.access_token, selected.stock_id, values.stock)
    // if (response?.error) return setError(response.error)
    // editStock({ ...response, last_edited_by_username: user.username })
    // setSubmitting(false)
    closeModal();
  };

  return (
    <ProductStockForm
      initialValues={initialValues}
      fields={fields}
      setCurrency={setCurrency}
      onFinish={onSubmit}
      rate={currencyRate}
      currency={currency}
    />
  );
};

export default CreateStock;
