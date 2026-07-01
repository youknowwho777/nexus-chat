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

export function sendMessageAsync(text){
  return new Promise(function(resolve){
    setTimeout(function(){
      resolve({
        text: text,
        type: "sent"
      });
    }, 250);
  });
}
