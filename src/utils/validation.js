export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, //patterns.email.test() 
  username: /^[A-Za-z0-9_]+$/  //user name pattern
};

//these are our validation rules which we gave for the authentication
//these are used by custom hook to validate 

export function validateFields(fields){
   //fields is from that validation (values+rules array of objects)
  
   return fields.reduce(function(errors, field){ 
    // reduce() goes through one by one object
    const failedRule = field.rules.find(function(rule){
      return !rule.test(field.value);
    });

    if(failedRule){
      return { //errors is object if you know this syntax 
        //evrytime a validation fails add the error to the other errors in the object
        ...errors,
        [field.name]: failedRule.message 
      };
    }

    return errors; // finally return the all errors {name:messgae} format 
  }, {});  //intially {} empty object we build all the errors in this 
}
//syntax issues : learn it 
/*  fields.reduce(function(temp,index){
    },{});      
     
    means the temp is initially empty object and index is each value of fiel  ds 
*/

export function fakeServerRequest(successMessage){
  return new Promise(function(resolve){ //(resolve,reject)
    setTimeout(function(){
      resolve({ //if success then show this message
        success: true, //we do if (response.success) in login page 
        message: successMessage
      });
    }, 500);
  });
}
