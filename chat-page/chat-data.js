export const chatStore = {
    activeChat: "",
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
        this.chats[name].messages.push(message);
    },
    searchChats: function(searchValue){
        const searchText = searchValue.trim().toLowerCase();
        const chats = this.chats;

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
            resolve({
                text: text,
                type: "sent"
            });
        }, 250);
    });
}
