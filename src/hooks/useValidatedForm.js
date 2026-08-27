import { useState } from "react";
import { validateFields } from "../utils/validation.js";

export function useValidatedForm(initialValues, getFields){
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate(nextValues = values){ // Use current values unless new ones are passed in.
    const nextErrors = validateFields(getFields(nextValues)); 
    // Store all validation errors from the helper.
    setErrors(nextErrors);  
    return Object.keys(nextErrors).length === 0; // true means the form is valid.
  }

  function updateField(name, value){ 
    // Update form state whenever an input changes.
    const nextValues = {
      ...values, // Keep other fields the same.
      [name]: value
    };

    setValues(nextValues);

    if(submitted){ // After first submit, validate while the user fixes fields.
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
