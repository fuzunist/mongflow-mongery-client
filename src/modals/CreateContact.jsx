import FormikForm from "@/components/FormikForm";
// import EditCustomerForm from "@/components/FormikForm/EditCustomerForm";
import EditCustomerForm from "@/components/AntForm/EditCustomerForm";
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
import ContactForm from "@/components/AntForm/ContactForm";
const { Paragraph } = Typography;

const CreateContact = ({ closeModal, selectedCustomer,companyNames }) => {
  const user = useUser();
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const selectedContacts = useMemo(() => {
    return selectedCustomer?.contacts?.map((jsonString) =>
      JSON.parse(jsonString)
    );
  }, [selectedCustomer]);
 
  

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
      <ContactForm
        error={error}
        setError={setError}
        editing={true}
        fields={fields}
        onFinish={onFinish}
        companyNames={companyNames}
        onChange={(newFields) => {
          setFields(newFields);
        }}
      />
    </>
  );
};

export default CreateContact;
