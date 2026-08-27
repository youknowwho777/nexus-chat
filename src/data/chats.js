// Temporary chat data before backend messages are connected.
// Object keys make each chat easy to find by name.
// Each chat stores status, preview, and messages.
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

// Fake message sender until the backend handles chat messages.
export function sendMessageAsync(text){ 
  return new Promise(function(resolve){ // Takes text and returns a Promise.
    setTimeout(function(){ // Small delay to feel like a real request.
      resolve({
        id: window.crypto?.randomUUID?.() || String(Date.now()),
        // Optional chaining safely checks if randomUUID exists.
        text: text,
        type: "sent",
        createdAt: new Date().toISOString()
      });
    }, 250);
  });
}

export function createInitialChats(){ 
  // Send App a fresh copy so edits do not change initialChats.
  return structuredClone(initialChats);
}
