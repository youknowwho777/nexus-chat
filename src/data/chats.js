//Initial chats database type : 
//stores as obejcts easier to acesss than arrays
//each message : name, preview, text, type 
export const initialChats = {
  Max: {
    status: "Online",
    preview: "Hello Bro...",
    messages: [
      {
        text: "Hello Bro...",
        type: "received"
      }
    ]
  },
  Rishi: {
    status: "Online",
    preview: "How are you?",
    messages: [
      {
        text: "How are you?",
        type: "received"
      }
    ]
  },
  Adharana: {
    status: "Online",
    preview: "PDF Sent",
    messages: [
      {
        text: "PDF Sent",
        type: "received"
      }
    ]
  },
  Siddu: {
    status: "Online",
    preview: "Welcome to Nexus Chat!",
    messages: [
      {
        text: "Welcome to Nexus Chat!",
        type: "received"
      }
    ]
  }
};

 //for sending messages makes clear when we have a backend
export function sendMessageAsync(text){ 
  return new Promise(function(resolve){ //takes text and returns a promise
    setTimeout(function(){  //just a fake delay to make it realistic
      resolve({
        id: window.crypto?.randomUUID?.() || String(Date.now()),
        //the above syntax is Optimal Chaining lets study later
        text: text,
        type: "sent",
        createdAt: new Date().toISOString()
      });
    }, 250);
  });
}

export function createInitialChats(){ 
   //this send copy of initial chats to app.js not to chatpage  
  //that way editing it  will not effect 
  return structuredClone(initialChats);
}
