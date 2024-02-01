import FormikForm from "@/components/FormikForm";
// import EditCustomerForm from "@/components/FormikForm/EditCustomerForm";
import EditCustomerForm from "@/components/AntForm.jsx/EditCustomerForm";
import {
  addCustomerToDB,
  delCustomerFromDB,
  editCustomerToDB,
} from "@/services/customer";
import { addCustomer, delCustomer, editCustomer } from "@/store/actions/apps";
import { useUser } from "@/store/hooks/user";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, Typography } from "antd";
const { Paragraph } = Typography;

const EditCustomer = ({ closeModal, selectedCustomer }) => {
  const user = useUser();
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const selectedContacts = useMemo(() => {
    return selectedCustomer?.contacts?.map((jsonString) =>
      JSON.parse(jsonString)
    );
  }, [selectedCustomer]);
  console.log("selectedContacts", selectedContacts);
  const contacts = Array.from({ length: 4 }).map((_, index) => {
    return {
      [`name`]: {
        id: index,
        tag: "input",
        type: "text",
        name: "name",

        placeholder: "İsim",
        label: "İsim",
        value:
          selectedContacts &&
          selectedContacts[index] &&
          selectedContacts[index]?.name &&
          selectedContacts[index]?.name?.value
            ? selectedContacts[index].name.value
            : "",
      },
      [`email`]: {
        id: index,
        tag: "input",
        type: "email",
        name: "email",

        placeholder: t("emailAddress"),
        label: t("emailAddress"),
        value:
          selectedContacts &&
          selectedContacts[index] &&
          selectedContacts[index]?.email &&
          selectedContacts[index]?.email?.value
            ? selectedContacts[index]?.email?.value
            : "",
      },
      [`phone`]: {
        id: index,
        tag: "input",
        type: "phone",
        name: "phone",

        placeholder: t("phone"),
        label: t("phone"),
        value:
          selectedContacts &&
          selectedContacts[index] &&
          selectedContacts[index]?.phone &&
          selectedContacts[index]?.phone?.value
            ? selectedContacts[index]?.phone?.value
            : "",
      },
      [`role`]: {
        id: index,
        tag: "input",
        type: "text",
        name: "role",

        placeholder: "Rol",
        label: "Rol",
        value:
          selectedContacts &&
          selectedContacts[index] &&
          selectedContacts[index]?.role &&
          selectedContacts[index]?.role?.value
            ? selectedContacts[index]?.role?.value
            : "",
      },
    };
  });
  const initialValues = useMemo(() => {
    return {
      companyname: {
        tag: "input",
        type: "text",
        name: "companyname",

        placeholder: t("companyname"),
        label: t("companyname"),
        value: selectedCustomer?.companyname ?? "",
      },
      email: {
        tag: "input",
        type: "email",
        name: "email",

        placeholder: t("emailAddress"),
        label: t("emailAddress"),
        value: selectedCustomer?.email ?? "",
      },
      phone: {
        tag: "input",
        type: "phone",
        name: "phone",
        placeholder: t("phone"),
        label: t("phone"),
        value: selectedCustomer?.phone ?? "",
      },
      address: {
        tag: "input",
        type: "text",
        name: "address",
        placeholder: t("address"),
        label: t("address"),
        value: selectedCustomer?.address ?? "",
      },
      website: {
        tag: "input",
        name: "website",
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
        value: selectedCustomer?.products ?? "",
        options: [
          { label: "Galvanized Wire", value: "Galvanized Wire" },
          { label: "Wire Mesh", value: "Wire Mesh" },
          { label: "Special Wire Mesh", value: "Special Wire Mesh" },
          { label: "Steel Stirrup", value: "Steel Stirrup" },
          { label: "Steel Tie Spacer", value: "Steel Tie Spacer" },
          { label: "Rod Galvanized", value: "Rod Galvanized" },
        ],
      },
      contacts: contacts,
    };
  }, [selectedCustomer, contacts]);
  const validate = (values) => {
    const errors = {};
    if (!values.companyname) errors.companyname = "Required";
    if (!values.email) errors.email = "Required";
    if (!values.phone) errors.phone = "Required";
    if (!values.address) errors.address = "Required";
    if (!values.website) errors.website = "Required";

    return errors;
  };

  console.log("initialValues,", initialValues);
  console.log("selectedCustomer", selectedCustomer);
  const onEdits = async (values, { setSubmitting }) => {
    setError("");
    console.log("vaues of customer edit,", values);
    // const data = {
    //   companyname: values.companyname,
    //   email: values.email,
    //   phone: values.phone,
    //   address: values.address,
    //   website: values.website,
    //   products: values.products,
    // };
    // const response = await addCustomerToDB(user.tokens.access_token, data);
    // if (response?.error) return setError(response.error);
    // addCustomer(response);
    // setSubmitting(false);
    // closeModal();
  };

  const onEdit = async (values, { setSubmitting }) => {
    setError("");
    console.log("values in edit", values);
    const data = {
      companyname: values.companyname,
      email: values.email,
      phone: values.phone,
      address: values.address,
      website: values.website,
      products: values.products,
      contacts: values.contacts,
    };
    const response = await editCustomerToDB(
      user.tokens.access_token,
      selectedCustomer.customerid,
      data
    );
    console.log("response", response);
    if (response?.error) return setError(response.error);
    editCustomer(response);
    setSubmitting(false);
    closeModal();
  };
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

  const [fields, setFields] = useState([
    {
      name: ["companyname"],
      value: selectedCustomer?.companyname,
    },
    {
      name: ["email"],
      value: selectedCustomer?.email,
    },
    {
      name: ["phone"],
      value: selectedCustomer?.phone,
    },
    {
      name: ["address"],
      value: selectedCustomer?.address,
    },
    {
      name: ["website"],
      value: selectedCustomer?.website,
    },
    {
      name: ["products"],
      value: selectedCustomer.products,
    },
    {
      name: ["contacts"],
      value: selectedContacts,
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
    const response = await editCustomerToDB(
      user.tokens.access_token,
      selectedCustomer.customerid,
      data
    );
    console.log("response", response);
    if (response?.error) return setError(response.error);
    editCustomer(response);
    closeModal();
  };
  return (
    <>
      <EditCustomerForm
        error={error}
        setError={setError}
        editing={true}
        fields={fields}
        onFinish={onFinish}
        onChange={(newFields) => {
          setFields(newFields);
        }}
      />
    </>
  );
};

export default EditCustomer;
