import AuthCard from "../components/auth/AuthCard.jsx";
import FormInput from "../components/auth/FormInput.jsx";
import PrimaryButton from "../components/auth/PrimaryButton.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import loginBackground from "../assets/images/auth/login-background.png";
import { useValidatedForm } from "../hooks/useValidatedForm.js";
import { patterns } from "../utils/validation.js";
import { loginUser } from "../services/authApi.js";
import { useState } from "react";

const initialValues = { // Starting form values.
  email: "",
  password: ""
};

function getLoginFields(values){ // values contains the current form inputs.
  return [ // Each object describes one field and its rules.
    {
      name: "email",
      value: values.email.trim(),
      rules: [ // Run these rules in order.
        {
          test: Boolean,
          message: "Email is required."
        },
        {
          test: function(value){
            return patterns.email.test(value); // Check email with regex.
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
// getLoginFields() does not validate by itself.
// It only describes the fields and their validation rules.

export default function LoginPage({ onCreateAccountClick, onLoginSuccess }){
  
  
  const form = useValidatedForm(initialValues, getLoginFields); // Form state and validation helpers.
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks if login is running.
  const [serverError, setServerError] = useState("");

  async function handleSubmit(event){
    // Stop the browser from refreshing on form submit.
    event.preventDefault();

    if(!form.submit()){
      return; // Stop if validation failed.
    }

    setIsSubmitting(true); // Disable button while login runs.
    setServerError("");
    try {
      const response = await loginUser({
        email: form.values.email.trim(),
        password: form.values.password
      });
      // Send login data to Express.
      // For now, the backend checks temporary users.

      if(response.success){
        onLoginSuccess({ // Tell App that login worked.
          username: response.data.user.username,
          email: response.data.user.email
        });
      }
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false); // Enable button again.
    }
  }

  function handleCreateAccountClick(event){ // Navigate without a full page reload.
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
          {serverError && (
            <p className="rounded bg-red-500/20 px-3 py-2 text-sm text-red-100">
              {serverError}
            </p>
          )}

          <FormInput
            id="email"
            type="email"
            value={form.values.email}
            error={form.errors.email}
            placeholder="Email"
            autoComplete="email"
            // Keep form state in sync with typing.
            onChange={function(event){
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
