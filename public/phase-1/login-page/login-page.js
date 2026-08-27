import { fakeServerRequest, patterns, validateFields } from "../shared/form-validation.js";

const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-btn");
const email = document.getElementById("email");
const password = document.getElementById("password");

let loginSubmitted = false;

// Keep rules together so validateFields can check them the same way.
const loginFields = {
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
                    return Boolean(value);
                },
                message: "Password is required."
            }
        ]
    }
};

function validateLogin(){
    return validateFields(loginFields);
}

async function handleLogin(event){
    event.preventDefault(); // Stop browser reload on submit.
    loginSubmitted = true;

    if(!validateLogin()){
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    const response = await fakeServerRequest("Login successful.");

    if(response.success){
        // Open chat page after validation and fake server success.
        window.location.href = "../chat-page/chat-page.html";
    }
}

loginForm.addEventListener("submit", handleLogin);

Object.values(loginFields).forEach(function(field){
    field.input.addEventListener("input", function(){
        if(loginSubmitted){
            // After first submit, validate while the user fixes input.
            validateLogin();
        }
    });
});
