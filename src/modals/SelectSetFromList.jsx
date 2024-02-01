import { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { MinusIcon } from "lucide-react";
import FormikForm from "@/components/FormikForm";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { setSet } from "@/store/actions/apps";

const SelectSetFromList = ({
  selectedSet,
  selectedCustomer,
  onContinueOrder,
}) => {
  const setId = selectedSet?.set_id;
  const customerId = selectedCustomer?.customerid;
  const [quantity, setQuantity] = useState(1);
  const [productType, setProductType] = useState("kg");
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (setId && customerId) {
      setIsOpen(false);
      setTimeout(() => setIsOpen(true), 100);
    } else setIsOpen(false);
  }, [setId, customerId]);

  const initialValues = {};

  useEffect(() => {
    setQuantity(1);
    setIsOpen(false);
    setProductType("kg");
    return () => {
      setQuantity(1);
      setIsOpen(false);
      setProductType("kg");
    };
  }, []);

  if (!setId || !customerId || !isOpen) return null;

  return (
    <Modal directRender={true} closeModal={() => setSet(null)}>
      {({ close }) => (
        <FormikForm
          title={t("set_detail_selection")}
          initialValues={initialValues}
          onSubmit={(values) =>
            onContinueOrder(
              values,
              quantity,
              productType,
              close,
              setQuantity,
              setProductType
            )
          }
        >
          {/* Quantity ("Adet") section */}
          <div
            className="quantity-section"
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setQuantity((quantity) => Math.max(1, quantity - 1))
              }
              style={{ marginRight: "10px" }}
              className="flex justify-center items-center"
            >
              <MinusIcon size={18} strokeWidth={2.5} />
            </button>
            <input
              type="number"
              id="quantity_input"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value)))
              }
              className="mx-2 text-center w-16 py-1.5 px-3 transition-all outline-none bg-input-bg-light dark:bg-input-bg-dark border rounded border-input-border-light dark:border-input-border-dark"
              style={{
                MozAppearance: "textfield",
              }}
            />
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="py-2 px-3 transition-all outline-none bg-input-bg-light dark:bg-input-bg-dark border rounded border-input-border-light dark:border-input-border-dark"
            >
              <option value="pcs">{t("pcs")}</option>
              <option value="sqm">{t("sqm")}</option>
              <option value="roll">{t("roll")}</option>
              <option value="ton">ton</option>
            </select>
            <button
              type="button"
              onClick={() => setQuantity((quantity) => quantity + 1)}
              style={{ marginLeft: "10px" }}
              className="flex justify-center items-center"
            >
              <PlusIcon size={18} strokeWidth={2.5} />
            </button>
          </div>
        </FormikForm>
      )}
    </Modal>
  );
};

export default SelectSetFromList;
