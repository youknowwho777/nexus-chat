export const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    username: /^[A-Za-z0-9_]+$/
};

export function showError(input, message){
    const errorText = document.getElementById(`${input.id}-error`);
    input.classList.toggle("error", Boolean(message));
    errorText.textContent = message;
}

export function validateFields(fields){
    let isValid = true;

    Object.values(fields).forEach(function(field){
        const value = field.getValue();
        const failedRule = field.rules.find(function(rule){
            return !rule.test(value);
        });

        if(failedRule){
            showError(field.input, failedRule.message);
            isValid = false;
        }
        else{
            showError(field.input, "");
        }
    });

    return isValid;
}

export function fakeServerRequest(successMessage){
    return new Promise(function(resolve){
        setTimeout(function(){
            resolve({
                success: true,
                message: successMessage
            });
        }, 500);
    });
}
