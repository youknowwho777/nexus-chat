import AuthCard from "../components/auth/AuthCard.jsx";
import FormInput from "../components/auth/FormInput.jsx";
import PrimaryButton from "../components/auth/PrimaryButton.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import loginBackground from "../assets/images/auth/login-background.png";
import { useValidatedForm } from "../hooks/useValidatedForm.js";
import { fakeServerRequest, patterns } from "../utils/validation.js";
import { useState } from "react";

const initialValues = { // s  tore initial form values
  email: "",
  password: ""
};

function getLoginFields(values){ //values is an object of email and password from the input fields
  return [ //returns an array of objects (EmailObject , PassObject)
    {
      name: "email",
      value: values.email.trim(),
      rules: [ // array stores validation rules 2 objects with 2 messages 
        {
          test: Boolean,
          message: "Email is required."
        },
        {
          test: function(value){
            return patterns.email.test(value); //regex pattern buil-in function 
          },
          message: "Enter a valid email address." 
        }
      ]
    },
    {
      name: "password",
      value: values.password,
      rules: [
        {
          test: Boolean,
          message: "Password is required."
        }
      ]
    }
  ];
}
//LoginFields() does not validate the form.
// It only describes the fields and their validation rules.

export default function LoginPage({ onCreateAccountClick, onLoginSuccess }){
  
  
  const form = useValidatedForm(initialValues, getLoginFields); //returns an object see this in other file 
  const [isSubmitting, setIsSubmitting] = useState(false); //stores login requests running or not

  async function handleSubmit(event){
     // browser refreshes the form and sends data when submitted 
     //so stop that action
    event.preventDefault();

    if(!form.submit()){
      return;  // validation failed so dont run below code  
    }

    setIsSubmitting(true); // disable button means valid so logging starts
    try {
      const response = await fakeServerRequest("Login successful.");
      //pretends to send data to server and it returns response
      //cause we didn't connect backend yet

      if(response.success){
        onLoginSuccess({  //sends that login is succss and email to parent
          email: form.values.email.trim()
        });
      }
    } finally { //back to normal make issubmitted false
      setIsSubmitting(false); //enable button
    }
  }

  function handleCreateAccountClick(event){ //handle clickicking createaccount 
    event.preventDefault();
    onCreateAccountClick();
  }

  return (
    <AuthLayout backgroundImage={loginBackground} overlayClassName="bg-[rgba(255,255,255,0.4)] max-[600px]:bg-[rgba(255,255,255,0.28)]">
      <AuthCard>
        <h1 className="mb-[clamp(24px,4vw,35px)] text-center text-[clamp(1.8rem,4vw,2.3rem)] text-white">
          Login
        </h1>

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormInput
            id="email"
            type="email"
            value={form.values.email}
            error={form.errors.email}
            placeholder="Email"
            autoComplete="email"
            //for every change we update form values too 
            onChange={function(event){ //data bindiing 
              form.updateField("email", event.target.value);
            }}
          />

          <FormInput
            id="password"
            type="password"
            value={form.values.password}
            error={form.errors.password}
            placeholder="Password"
            autoComplete="current-password"
            onChange={function(event){
              form.updateField("password", event.target.value);
            }}
          />

          <PrimaryButton disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"} 
          </PrimaryButton>

          <p className="mt-[18px] text-center text-gray-300 max-[600px]:leading-6">
            Don&apos;t have an account?{" "}
            <a
              href="/create-account"
              onClick={handleCreateAccountClick}
              className="font-semibold text-blue-400 no-underline hover:underline"
            >
              Create Account
            </a>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
