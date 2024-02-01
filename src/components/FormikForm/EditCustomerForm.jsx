import { FieldArray, Formik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import FormError from "./FormError";
import { useMemo } from "react";
import FormElements from "./FormElements";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

const EditCustomerForm = ({
  title,
  initialValues,
  validate,
  onSubmit,
  error,
  children,
  disabled = false,
  text = "submit",
  variant = "normal",
  contacts,
}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  useEffect(() => {
    setMessage(error);
    console.log("error", error);
    error?.variant === "success" && setTimeout(() => setMessage(""), 5e3);
  }, [error]);

  const _initialValues = useMemo(() => {
    const newValues = {};
    Object.entries(initialValues).forEach(([key, value]) => {
      newValues[key] = value.value;
    });
    return newValues;
  }, [initialValues]);

  return (
    <Formik
      initialValues={_initialValues}
    //   validate={validate}
      enableReinitialize={true}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        isSubmitting,
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
      }) => (
        <div className="flex flex-col gap-4 items-center justify-center min-w-[500px] overflow-x-scroll">
          {title && (
            <h2 className="text-center w-full text-2xl font-semibold uppercase">
              {title}
            </h2>
          )}

          <FormError
            error={message?.message ?? message}
            variant={message?.variant ?? "danger"}
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="flex flex-col items-center justify-center"
          >
            <div
              className={`${"grid grid-cols-2"}  px-4 justify-center items-center`}
            >
              {Object.entries(initialValues).map(([key, value], index) => {
                const Element = FormElements[value?.tag];
                const elementValue = values[key] ?? value.value;

                return (
                  <div
                    key={index}
                    className={`flex`}
                  >
                    {/* <label className="mt-3 -mb-2">{value?.label} </label> */}

                    {key === "contacts" ? (
                      <div className="flex flex-col mt-12 justify-center items-center ml-7">
                        <h1 className="font-bold text-xl my-8">
                          Müşteri Sorumlusu Ekle
                        </h1>
                        <FieldArray
                            name="contacts"
                            render={(arrayHelpers) => (
                              <div>
                                {initialValues?.contacts?.map(
                                  (contact, contactIndex) => {
                                   
                                    return (
                                      <div className="flex gap-x-4" key={contactIndex}>
                                         <div className="flex items-end justify-center mb-2">
                                      {" "}
                                      {contactIndex + 1}.{" "}
                                    </div>
                                        {Object.keys(contact)?.map(
                                          (name, fieldIndex) => {
                                            const valueg = contact[name];
                                            const Element =
                                              FormElements[valueg?.tag];

                                               console.log("valueg,", valueg)
                                                console.log("name,",name)
                                                 console.log("values,", values)
                                                  console.log("valeu of it ,", (values && values?.contacts && values?.contacts[
                                                    contactIndex
                                                  ] && values?.contacts[
                                                    contactIndex
                                                  ]?.[name]?.value)
                                                      ? values.contacts[
                                                          contactIndex
                                                        ][name].value
                                                 
                                                      :  initialValues
                                                          ?.contacts[
                                                          contactIndex
                                                        ][name].value)
                                            return (
                                              <div
                                                key={fieldIndex}
                                                className="flex flex-row"
                                              >
                                             

                                                <Element
                                                  className={"my-2"}
                                                  name={`contacts[${contactIndex}].${name}.value`}
                                                  key={`contacts[${contactIndex}].${name}.value_${contactIndex}`}
                                                  type={valueg?.type}
                                                  placeholder={
                                                    valueg?.placeholder
                                                  }
                                                  onChange={handleChange}
                                                //   onBlur={handleBlur}
                                                  errors={errors}
                                                //   touched={touched}
                                                  value={
                                                   (values && values?.contacts && values?.contacts[
                                                    contactIndex
                                                  ] && values?.contacts[
                                                    contactIndex
                                                  ]?.[name]?.value)
                                                      ? values.contacts[
                                                          contactIndex
                                                        ][name].value
                                                 
                                                      :  initialValues
                                                          ?.contacts[
                                                          contactIndex
                                                        ][name].value ?? valueg.value ??
                                                        values[key].value

                                                  }
                                                //   value={
                                                //     values?.contacts
                                                //       ? values?.contacts[
                                                //           contactIndex
                                                //         ]?.[name]?.value
                                                //       : initialValues
                                                //           ?.contacts[
                                                //           contactIndex
                                                //         ]?.value ??
                                                //         valueg.value ??
                                                //         values[key].value
                                                //   }
                                                  _label={
                                                    contactIndex === 0
                                                      ? valueg?.label
                                                      : ""
                                                  }
                                                  options={valueg?.options}
                                                  readOnly={
                                                    valueg?.readOnly ?? false
                                                  }
                                                  disabled={disabled}
                                                  min={valueg?.min}
                                                //   product_id={
                                                //     values?.contacts &&
                                                //     values?.contacts[
                                                //       contactIndex
                                                //     ] &&
                                                //     values?.contacts[
                                                //         contactIndex
                                                //     ]["product_id"]
                                                //       ? values?.productions[
                                                //           productionIndex
                                                //         ]["product_id"]?.value
                                                //       : -1
                                                //   }
                                               
                                                //   products={
                                                //     valueg?.products ?? []
                                                //   }
                                                //   attributes={
                                                //     values?.productions &&
                                                //     values?.productions[
                                                //       productionIndex
                                                //     ] && // Check if productions[productionIndex] exists
                                                //     values?.productions[
                                                //       productionIndex
                                                //     ]["attributes"]?.value
                                                //       ? values?.productions[
                                                //           productionIndex
                                                //         ]["attributes"]?.value
                                                //       : []
                                                //   }
                                                //   orders={valueg?.orders}
                                                />
                                              
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}
                          />
                          </div>
                    
                    ) : (
                      <div
                        key={index}
                        className={`flex flex-col mt-2 items-start justify-start  mx-auto`}
                      >
                        <label className="font-semibold">
                        {value?.label}
                        </label>
                        <Element
                          classname={"max-w-[250px] min-w-[250px]"}
                          key={key}
                          type={value?.type}
                          placeholder={value?.placeholder}
                          name={key}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                          value={elementValue}
                          options={value?.options}
                          readOnly={value?.readOnly ?? false}
                          disabled={disabled}
                          min={value?.min}
                          max={value?.max}
                          product_id={values?.product_id ?? -1}
                          products={value?.products ?? []}
                          attributes={values?.attributes ?? []}
                          orders={value?.orders}
                          isMulti={value?.isMulti}
                  
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              {children}
            </div>
            <button
              type="submit"
              disabled={disabled || isSubmitting}
              className={classNames(
                "mt-4 flex justify-center items-center rounded p-2 px-4 text-white transition-colors text-base font-semibold disabled:bg-disabled-light disabled:dark:bg-disabled-dark",
                {
                  "bg-link-fg-light hover:bg-link-hover-light":
                    variant === "normal",
                  "bg-alert-danger-fg-dark hover:bg-alert-danger-fg-light":
                    variant === "danger",
                }
              )}
            >
              {t(text)}
            </button>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default EditCustomerForm;
