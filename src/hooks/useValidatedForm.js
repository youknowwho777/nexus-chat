import { useState } from "react";
import { validateFields } from "../utils/validation.js";

export function useValidatedForm(initialValues, getFields){
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate(nextValues = values){ //validate() ===> becomes validate(values)
    const nextErrors = validateFields(getFields(nextValues)); 
    //validates from the helper function stores all errors 
    setErrors(nextErrors);  
    return Object.keys(nextErrors).length === 0;  // if no errors then "true" 
  }

  function updateField(name, value){ 
    //this is for keep on updating values when input changes in form
    // this function is called in login /create account pages when input changes
    const nextValues = {
      ...values, //only the changed object is modified rest is copied directly
      [name]: value
    };

    setValues(nextValues);

    if(submitted){ // this is for user experience 
      //after first error till next submit() the page shows error 
      // so with this when input is valid error msg stops on screen even without submit()
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
