import React, { useState } from "react";
import { Button, Card, Form, Input, Select, Space, Typography } from "antd";
const { Paragraph } = Typography;
import { useTranslation } from "react-i18next";
import {
  CloseOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import FormError from "../FormikForm/FormError";
const { Option } = Select;

const ContactForm = ({ onChange, fields, onFinish, editing, error, setError }) => {
  const { t } = useTranslation();

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 20,
      },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 20,
        offset: 4,
      },
    },
  };

  const options = [
    "Galvanized Wire",
    "Wire Mesh",
    "Special Wire Mesh",
    "Steel Stirrup",
    "Steel Tie Spacer",
    "Rod Galvanized",
  ];
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    setError(errorInfo)
  };
  const [form] = Form.useForm();
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-bold text-2xl my-4 ">
        {editing ? "Müşteri Düzenle" : "Firma Ekle"}
      </h1>
      {error && <FormError error={error} variant={"danger"} />}
      <Form
    name="dynamic_form_nest_item"
     autoComplete="off"
        className="mt-4"
        //   layout="inline"
        {...formItemLayoutWithOutLabel}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{
          maxWidth: 500,
        }}

        fields={fields}     
        //  initialValues={fields}
        // onFieldsChange={(_, allFields) => {
        //   onChange(allFields);
        // }}
        // onValuesChange={(_, allFields) => {
        //   onChange(allFields);
        // }}
      >
        <Form.Item
          name="companyname"
          label="Şirket İsmi"
          rules={[
            {
              required: true,
              message: "Company Name is required!",
            },
          ]}
        >
            <Select
    showSearch
    style={{
      width: 200,
    }}
    placeholder="Search to Select"
    optionFilterProp="children"
    filterOption={(input, option) => (option?.label ?? '').includes(input)}
    filterSort={(optionA, optionB) =>
      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
    }
    options={[
      {
        value: '1',
        label: 'Not Identified',
      },
      {
        value: '2',
        label: 'Closed',
      },
      {
        value: '3',
        label: 'Communicated',
      },
      {
        value: '4',
        label: 'Identified',
      },
      {
        value: '5',
        label: 'Resolved',
      },
      {
        value: '6',
        label: 'Cancelled',
      },
    ]}
  />
        </Form.Item>

        <Form.Item name="phone" label={t("phone")} >
          <Input />
        </Form.Item>

        <Form.Item name="email" label={t("email")}>
          <Input />
        </Form.Item>

        <Form.Item name="address" label={t("address")}>
          <Input />
        </Form.Item>

        <Form.Item name="website" label={t("website")}>
          <Input />
        </Form.Item>

        <Form.Item
          name="products"
          label="Ürün Grupları Seçiniz"
          rules={[
            {
              type: "array",
            },
          ]}
        >
          
          <Select mode="multiple" placeholder="Ürün grubu seçin">
            {options.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
    
        <Form.List name="contacts">
          {(fields, { add, remove }, { errors }) => (
            <div
              style={{ display: "flex", rowGap: 16, flexDirection: "column" }}
            >
              {fields.map((field,index) => {
                console.log("field of contact", field);
                console.log("errors", errors);
                return (
                  <Card
                    size="small"
                    title={`Kişi ${field.name + 1}`}
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => remove(index)}
                      />
                    }
                  >
                    <Form.Item
                      isListField={true}
                      label="Kişi Adı"
                      name={[field.name, "name"]}
                      key={[field.key, "name"]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      isListField={true}
                      label="Kişi Email"
                      name={[field.name, "email"]}
                      key={[field.key, "email"]}

                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      isListField={true}
                      label="Kişi Telefon"
                      name={[field.name, "phone"]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      isListField={true}
                      label="Kişi Rolü"
                      name={[field.name, "role"]}
                    >
                      <Input />
                    </Form.Item>
                  </Card>
                );
              })}

              <Button type="dashed" onClick={() => add()} block>
                + Kişi Ekle
              </Button>
            </div>
          )}
        </Form.List>

        {/* <Form.List name="contacts">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
                 <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
              <Space
                key={key}
                style={{
                  display: "flex",
                  marginBottom: 8,
                }}
                align="baseline"
              >
            
                <Form.Item
                  {...restField}
                  label="Kişi Adı"
                  name={[name, "name"]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Kişi Email"
                  name={[name, "email"]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Kişi Telefon"
                  name={[name, "phone"]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Kişi Rolü"
                  name={[name, "role"]}
                >
                  <Input />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space></div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List> */}

        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
          style={{
            marginTop: 18,
          }}
        >
          <Button type="primary" htmlType="submit" className="mx-[18%]">
            {editing ? "Müşteri Düzenle" : "Firma Ekle"}
          </Button>
          {/* <Button htmlType="reset">reset</Button> */}
        </Form.Item>
      </Form>
    </div>
  );
};
export default ContactForm;
