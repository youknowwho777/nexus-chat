import AuthCard from "../components/auth/AuthCard.jsx";
import FormInput from "../components/auth/FormInput.jsx";
import PrimaryButton from "../components/auth/PrimaryButton.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import loginBackground from "../assets/images/auth/login-background.png";
import { useValidatedForm } from "../hooks/useValidatedForm.js";
import { fakeServerRequest, patterns } from "../utils/validation.js";
import { useState } from "react";

const initialValues = {
  email: "",
  password: ""
};

function getLoginFields(values){
  return [
    {
      name: "email",
      value: values.email.trim(),
      rules: [
        {
          test: Boolean,
          message: "Email is required."
        },
        {
          test: function(value){
            return patterns.email.test(value);
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

export default function LoginPage({ onCreateAccountClick, onLoginSuccess }){
  const form = useValidatedForm(initialValues, getLoginFields);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event){
    event.preventDefault();

    if(!form.submit()){
      return;
    }

    setIsSubmitting(true);
    const response = await fakeServerRequest("Login successful.");

    if(response.success){
      onLoginSuccess();
    }
  }

  function handleCreateAccountClick(event){
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
