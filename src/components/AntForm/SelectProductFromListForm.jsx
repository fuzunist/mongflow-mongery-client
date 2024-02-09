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

const SelectProductFromListForm = ({
  onChange,
  initialValues,
  fields,
  onFinish,
  error,
  setError,
}) => {
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
    labelCol: { span: 12 },
    wrapperCol: { span: 18 },
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
    console.log("Failed:", errorInfo);
    setError(errorInfo);
  };
  const [form] = Form.useForm();
  console.log("fields", fields);
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-bold text-2xl my-4 ">{"Ürün Özellik Ekle"}</h1>
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
      >
        {Object.entries(initialValues)?.map(([key, value], index) => (
          <Form.Item key={index} name={key} label={key}>
            <Select showSearch>
              {Object.entries(value?.options).map(
                ([optionkey, optionvalue], index) => (
                  <Option key={index} value={optionvalue?.value}>
                    {optionvalue.value}
                  </Option>
                )
              )}
            </Select>
          </Form.Item>
        ))}

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
            {"Ürün Ekle"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default SelectProductFromListForm;