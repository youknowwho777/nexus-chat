export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email format check.
  username: /^[A-Za-z0-9_]+$/ // Username can use letters, numbers, and underscores.
};

// Shared validation helper for auth forms.

export function validateFields(fields){
   // fields contains each input value and its rules.
  
   return fields.reduce(function(errors, field){ 
    // Check each field and keep the first failed rule.
    const failedRule = field.rules.find(function(rule){
      return !rule.test(field.value);
    });

    if(failedRule){
      return {
        // Add this field error without losing earlier errors.
        ...errors,
        [field.name]: failedRule.message 
      };
    }

    return errors; // Return errors as { fieldName: message }.
  }, {}); // Start with no errors.
}

// reduce() starts with {} and builds the final errors object.
/*  fields.reduce(function(errors, field){
    return errors;
  }, {});
*/

export function fakeServerRequest(successMessage){
  return new Promise(function(resolve){
    setTimeout(function(){
      resolve({
        success: true, // Login page checks this with response.success.
        message: successMessage
      });
    }, 500);
  });
}
