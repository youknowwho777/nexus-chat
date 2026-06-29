export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[A-Za-z0-9_]+$/
};

export function validateFields(fields){
  return fields.reduce(function(errors, field){
    const failedRule = field.rules.find(function(rule){
      return !rule.test(field.value);
    });

    if(failedRule){
      return {
        ...errors,
        [field.name]: failedRule.message
      };
    }

    return errors;
  }, {});
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
