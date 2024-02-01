import EditCustomerForm from "@/components/AntForm.jsx/EditCustomerForm";
import FormikForm from "@/components/FormikForm";
import {
  addCustomerToDB,
  delCustomerFromDB,
  editCustomerToDB,
} from "@/services/customer";
import { addCustomer, delCustomer, editCustomer } from "@/store/actions/apps";
import { useUser } from "@/store/hooks/user";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CreateCustomer = ({ closeModal, selectedCustomer }) => {
  const user = useUser();
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const initialValues = {
    companyname: {
      tag: "input",
      type: "text",
      placeholder: t("companyname"),
      label: t("companyname"),
      value: selectedCustomer?.companyname ?? "",
    },
    email: {
      tag: "input",
      type: "email",
      placeholder: t("emailAddress"),
      label: t("emailAddress"),
      value: selectedCustomer?.email ?? "",
    },
    phone: {
      tag: "input",
      type: "phone",
      placeholder: t("phone"),
      label: t("phone"),
      value: selectedCustomer?.phone ?? "",
    },
    address: {
      tag: "input",
      type: "text",
      placeholder: t("address"),
      label: t("address"),
      value: selectedCustomer?.address ?? "",
    },
    website: {
      tag: "input",
      type: "text",
      placeholder: "Website",
      label: "Website",
      value: selectedCustomer?.website ?? "",
    },
    products: {
      tag: "multipleselect",
      name: "products",
      placeholder: "Ürün Grubu",
      label: "Ürün Grubu",
      isMulti: true,
      value: "",
      options: [
        { label: "Galvanized Wire", value: "Galvanized Wire" },
        { label: "Wire Mesh", value: "Wire Mesh" },
        { label: "Special Wire Mesh", value: "Special Wire Mesh" },
        { label: "Steel Stirrup", value: "Steel Stirrup" },
        { label: "Steel Tie Spacer", value: "Steel Tie Spacer" },
        { label: "Rod Galvanized", value: "Rod Galvanized" },
      ],
    },
  };

  const validate = (values) => {
    const errors = {};
    if (!values.companyname) errors.companyname = "Required";
    if (!values.email) errors.email = "Required";
    if (!values.phone) errors.phone = "Required";
    if (!values.address) errors.address = "Required";
    if (!values.website) errors.website = "Required";

    return errors;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    setError("");
    const data = {
      companyname: values.companyname,
      email: values.email,
      phone: values.phone,
      address: values.address,
      website: values.website,
      products: values.products,
    };
    const response = await addCustomerToDB(user.tokens.access_token, data);
    if (response?.error) return setError(response.error);
    addCustomer(response);
    setSubmitting(false);
    closeModal();
  };

  // const onEdit = async (values, { setSubmitting }) => {
  //   setError("");
  //   const response = await editCustomerToDB(
  //     user.tokens.access_token,
  //     selectedCustomer.customerid,
  //     values.customername,
  //     values.companyname,
  //     values.email,
  //     values.phone,
  //     values.address
  //   );
  //   if (response?.error) return setError(response.error);
  //   editCustomer(response);
  //   setSubmitting(false);
  //   closeModal();

  const onDelete = async () => {
    setError("");
    const response = await delCustomerFromDB(
      user.tokens.access_token,
      selectedCustomer.customerid
    );
    if (response?.error) return setError(response.error);
    delCustomer(selectedCustomer.customerid);
    closeModal();
  };

  let editing = false;

  const [fields, setFields] = useState([
    {
      name: ["companyname"],
      value: editing ? selectedCustomer?.companyname : "",
    },
    {
      name: ["email"],
      value: editing ? selectedCustomer?.email : "",
    },
    {
      name: ["phone"],
      value: editing ? selectedCustomer?.phone : "",
    },
    {
      name: ["address"],
      value: editing ? selectedCustomer?.address : "",
    },
    {
      name: ["website"],
      value: editing ? selectedCustomer?.website : "",
    },
    {
      name: ["products"],
      value: editing ? selectedCustomer.products : [],
    },
    {
      name: ["contacts"],
      value: editing ? selectedContacts : [],
    },
  ]);

  console.log("initialValues of editCustomer: ", initialValues);

  const onFinish = async (values) => {
    console.log("finish values", values);
    setError("");

    const data = {
      companyname: values.companyname,
      email: values.email,
      phone: values.phone,
      address: values.address,
      website: values.website,
      products: values.products,
      contacts: values.contacts,
    };
    const response = await addCustomerToDB(user.tokens.access_token, data);
    console.log("response", response);
    if (response?.error) return setError(response.error);
    addCustomer(response);
    closeModal();
  };
  return (
    <>
      <EditCustomerForm
        error={error}
        setError={setError}
        editing={false}
        fields={fields}
        onFinish={onFinish}
        onChange={(newFields) => {
          setFields(newFields);
        }}
      />
    </>
  );
  return (
    <>
      <FormikForm
        initialValues={initialValues}
        // validate={validate}
        onSubmit={selectedCustomer ? onEdit : onSubmit}
        error={error}
        title={t(selectedCustomer ? "editCustomer" : "addCustomer")}
      />
      {selectedCustomer && (
        <button
          className="py-2 px-3 bg-danger hover:bg-alert-danger-fg-light transition-colors text-white w-full mt-4 rounded"
          onClick={onDelete}
        >
          {t("delete")}
        </button>
      )}
    </>
  );
};

export default CreateCustomer;
