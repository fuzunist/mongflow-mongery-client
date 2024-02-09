import { useState, useEffect, useMemo } from "react";
import { PlusIcon } from "lucide-react";
import { MinusIcon } from "lucide-react";

import { groupAttributesByName } from "@/utils/helpers";

import FormikForm from "@/components/FormikForm";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { setProduct } from "@/store/actions/apps";
import SelectProductFromListForm from "@/components/AntForm/SelectProductFromListForm";

const SelectProductFromList = ({
  selectedProduct,
  selectedCustomer,
  onContinueOrder,
}) => {
  const productId = selectedProduct?.product_id;
  const customerId = selectedCustomer?.customerid;
  const [quantity, setQuantity] = useState(1);
  const [productType, setProductType] = useState("ton");
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields]=useState(null)
  const { t } = useTranslation();

  useEffect(() => {
    if (productId && customerId) {
      setIsOpen(false);
      setTimeout(() => setIsOpen(true), 100);
    } else setIsOpen(false);
  }, [productId, customerId]);

  const groupedAttributes = useMemo(() => {
    if (selectedProduct)
      return groupAttributesByName(selectedProduct.attributes);
    return {};
  }, [selectedProduct]);
 console.log("groupedAttributes",groupedAttributes)


  const initialValues = useMemo(() => {
    if (!selectedProduct) return {};

    return Object.entries(groupedAttributes).reduce(
      (acc, [attrName, attrValues]) => {
        if (attrValues.values.length > 1) {
          // Multiple values, create a dropdown
          acc[attrName] = {
            tag: "select",
            label: attrName,
            packaging: attrValues?.packaging,
            name: attrName,
            value: attrValues?.values[0].value, // default to the first value
            options: attrValues?.values.map((val) => ({
              key: val.value,
              // value: `${val.value} (${val.extra_price} ${selectedProduct.currency_code})`
              value: val.value,
            })),
          };
        } else {
          // Single value, display as plain text
          const singleAttr = attrValues[0];
          acc[attrName] = {
            tag: "input",
            readOnly: true,
            label: attrName,
            name: attrName,
            packaging: attrValues.packaging,
            // value: `${singleAttr.value} (${singleAttr.extra_price} ${selectedProduct.currency_code})`
            value: singleAttr.value,
          };
        }
        return acc;
      },
      {}
    );
  }, [selectedProduct, groupedAttributes]);


  useEffect(()=>{

    const field=Object.entries(initialValues).map((([key, value])=>(
      {
        name:key,
        value: value.value
      }
    )))
    
    setFields(field)
  },[initialValues])

   console.log("initial values of group xxx", initialValues)
  useEffect(() => {
    setQuantity(1);
    setIsOpen(false);
    setProductType("ton");
    return () => {
      setQuantity(1);
      setIsOpen(false);
      setProductType("ton");
    };
  }, []);

  if (!productId || !customerId || !isOpen) return null;

  return (
    <Modal directRender={true} closeModal={() => setProduct(null)}>
      {({ close }) => (
       <SelectProductFromListForm initialValues={initialValues} fields={fields} onFinish={(values)=>{
        onContinueOrder(
          values,
          quantity,
          productType,
          close,
          setQuantity,
          setProductType
        )
       }} />
      )}
    </Modal>
  );
};

export default SelectProductFromList;
