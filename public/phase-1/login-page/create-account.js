import { fakeServerRequest, patterns, validateFields } from "../shared/form-validation.js";

const createAccountForm = document.getElementById("create-account-form");
const createButton = document.getElementById("create-btn");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

let createAccountSubmitted = false;

// Keep signup inputs and validation rules together.
const createAccountFields = {
    username: {
        input: username,
        getValue: function(){
            return username.value.trim();
        },
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
    email: {
        input: email,
        getValue: function(){
            return email.value.trim();
        },
        rules: [
            {
                test: function(value){
                    return Boolean(value);
                },
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
    password: {
        input: password,
        getValue: function(){
            return password.value;
        },
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
    confirmPassword: {
        input: confirmPassword,
        getValue: function(){
            return confirmPassword.value;
        },
        rules: [
            {
                test: function(value){
                    return Boolean(value);
                },
                message: "Confirm your password."
            },
            {
                test: function(value){
                    return value === password.value;
                },
                message: "Passwords do not match."
            }
        ]
    }
};

function validateCreateAccount(){
    return validateFields(createAccountFields);
}

async function handleCreateAccount(event){
    event.preventDefault(); // Stop browser reload on submit.
    createAccountSubmitted = true;

    if(!validateCreateAccount()){
        return;
    }

    createButton.disabled = true;
    createButton.textContent = "Creating...";

    // Fake server delay until backend signup is connected.
    const response = await fakeServerRequest("Account created successfully!");

    if(response.success){
        alert(response.message);
        // Return to login after account creation.
        window.location.href = "login-page.html";
    }
}

createAccountForm.addEventListener("submit", handleCreateAccount);

Object.values(createAccountFields).forEach(function(field){
    field.input.addEventListener("input", function(){
        if(createAccountSubmitted){
            // After first submit, validate while the user fixes input.
            validateCreateAccount();
        }
    });
});
