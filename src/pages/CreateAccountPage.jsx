import { useState } from "react";
import AuthCard from "../components/auth/AuthCard.jsx";
import FormInput from "../components/auth/FormInput.jsx";
import PrimaryButton from "../components/auth/PrimaryButton.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import createAccountBackground from "../assets/images/auth/create-account-background.png";
import { useValidatedForm } from "../hooks/useValidatedForm.js";
import { fakeServerRequest, patterns } from "../utils/validation.js";

const initialValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
};

function getCreateAccountFields(values){
  return [
    {
      name: "username",
      value: values.username.trim(),
      rules: [
        {
          test: function(value){
            return value.length >= 3;
          },
          message: "Username must be at least 3 characters."
        },
        {
          test: function(value){
            return patterns.username.test(value);
          },
          message: "Use only letters, numbers, and underscores."
        }
      ]
    },
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
          test: function(value){
            return value.length >= 8;
          },
          message: "Password must be at least 8 characters."
        },
        {
          test: function(value){
            return /[A-Za-z]/.test(value) && /[0-9]/.test(value);
          },
          message: "Password must include letters and numbers."
        }
      ]
    },
    {
      name: "confirmPassword",
      value: values.confirmPassword,
      rules: [
        {
          test: Boolean,
          message: "Confirm your password."
        },
        {
          test: function(value){
            return value === values.password;
          },
          message: "Passwords do not match."
        }
      ]
    }
  ];
}

export default function CreateAccountPage({ onAccountCreated, onLoginClick }){
  const form = useValidatedForm(initialValues, getCreateAccountFields);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event){
    event.preventDefault();

    if(!form.submit()){
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fakeServerRequest("Account created successfully!");

      if(response.success){
        onAccountCreated({
          username: form.values.username.trim(),
          email: form.values.email.trim()
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLoginClick(event){
    event.preventDefault();
    onLoginClick();
  }

  return (
    <AuthLayout backgroundImage={createAccountBackground} overlayClassName="bg-[rgba(255,255,255,0.1)]">
      <AuthCard>
        <h1 className="mb-[clamp(24px,4vw,35px)] text-center text-[clamp(1.8rem,4vw,2.3rem)] text-white">
          Welcome
        </h1>
        <p className="-mt-5 mb-[30px] text-center text-[rgba(27,179,254,0.872)]">
          Create your Nexus Chat account
        </p>

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormInput
            id="username"
            type="text"
            value={form.values.username}
            error={form.errors.username}
            placeholder="Username"
            autoComplete="username"
            onChange={function(event){
              form.updateField("username", event.target.value);
            }}
          />

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
            autoComplete="new-password"
            onChange={function(event){
              form.updateField("password", event.target.value);
            }}
          />

          <FormInput
            id="confirm-password"
            type="password"
            value={form.values.confirmPassword}
            error={form.errors.confirmPassword}
            placeholder="Confirm Password"
            autoComplete="new-password"
            onChange={function(event){
              form.updateField("confirmPassword", event.target.value);
            }}
          />

          <PrimaryButton disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </PrimaryButton>

          <p className="mt-[18px] text-center text-gray-300 max-[600px]:leading-6">
            Already have an account?{" "}
            <a
              href="/"
              onClick={handleLoginClick}
              className="font-semibold text-blue-400 no-underline hover:underline"
            >
              Login
            </a>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
