import { useState } from "react";
import { validateFields } from "../utils/validation.js";

export function useValidatedForm(initialValues, getFields){
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate(nextValues = values){
    const nextErrors = validateFields(getFields(nextValues));
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function updateField(name, value){
    const nextValues = {
      ...values,
      [name]: value
    };

    setValues(nextValues);

    if(submitted){
      const nextErrors = validateFields(getFields(nextValues));
      setErrors(nextErrors);
    }
  }

  function submit(){
    setSubmitted(true);
    return validate(values);
  }

  return {
    values,
    errors,
    updateField,
    submit
  };
}
