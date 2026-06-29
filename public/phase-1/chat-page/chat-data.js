export const chatStore = {
    activeChat: "",
    // Each chat keeps its status, sidebar preview, and full message list together.
    chats: {
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
    },
    setActiveChat: function(name){
        this.activeChat = name;
    },
    getActiveChat: function(){
        return this.chats[this.activeChat];
    },
    getMessages: function(name){
        return this.chats[name].messages;
    },
    addMessage: function(name, message){
        // const object can still update nested arrays like this messages list.
        this.chats[name].messages.push(message);
    },
    searchChats: function(searchValue){
        const searchText = searchValue.trim().toLowerCase();
        const chats = this.chats;

        // Search checks both the friend's name and the small preview text.
        return Object.keys(chats).filter(function(name){
            const chat = chats[name];
            return name.toLowerCase().includes(searchText)
                || chat.preview.toLowerCase().includes(searchText);
        });
    }
};

export function sendMessageAsync(text){
    return new Promise(function(resolve){
        setTimeout(function(){
            // Small fake delay so later this can be replaced with a real server call.
            resolve({
                text: text,
                type: "sent"
            });
        }, 250);
    });
}
