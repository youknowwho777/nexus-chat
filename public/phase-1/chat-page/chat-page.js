import { chatStore, sendMessageAsync } from "./chat-data.js";

const chatContent = document.querySelector(".chat-content");
const chatSearch = document.getElementById("chat-search");
const chatCards = document.querySelectorAll(".chat-card");
const welcomeBox = document.getElementById("welcome-box");
const conversation = document.getElementById("conversation");
const chatName = document.getElementById("chat-name");
const chatStatus = document.getElementById("chat-status");
const messageList = document.getElementById("message-list");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const backToList = document.getElementById("back-to-list");

function createMessageBox(message){
    const messageBox = document.createElement("div");
    messageBox.className = `message ${message.type}`;
    messageBox.textContent = message.text;
    return messageBox;
}

function scrollToLatestMessage(){
    messageList.scrollTop = messageList.scrollHeight;
}

function renderMessages(name){
    messageList.innerHTML = ""; // clean old messages before opening another chat

    chatStore.getMessages(name).forEach(function(message){
        messageList.appendChild(createMessageBox(message));
    });

    scrollToLatestMessage();
}

function openChat(card){
    const selectedChat = card.dataset.name;
    chatStore.setActiveChat(selectedChat);

    // Update top chat header with selected friend's details.
    const activeChatData = chatStore.getActiveChat();
    chatName.textContent = selectedChat;
    chatStatus.textContent = activeChatData.status;

    // Highlight only the chat card that is currently open.
    chatCards.forEach(function(chatCard){
        chatCard.classList.toggle("active", chatCard === card);
    });

    welcomeBox.style.display = "none";
    // These classes switch the page from welcome/list view into chat view.
    conversation.classList.add("active");
    chatContent.classList.add("chat-open");
    renderMessages(selectedChat);
}

function filterChats(){
    const matchingNames = chatStore.searchChats(chatSearch.value);

    chatCards.forEach(function(card){
        const isMatch = matchingNames.includes(card.dataset.name);
        // Hide cards that do not match the search text.
        card.classList.toggle("hidden", !isMatch);
    });
}

async function handleMessageSubmit(event){
    event.preventDefault();

    const messageText = messageInput.value.trim();

    const targetChat = chatStore.activeChat;

    if(!messageText || !targetChat){
        // Prevent empty messages and sending before any chat is selected.
        return;
    }

    messageInput.value = ""; // clear input after send starts
    const sentMessage = await sendMessageAsync(messageText);
    chatStore.addMessage(targetChat, sentMessage);

    if(chatStore.activeChat === targetChat){
        messageList.appendChild(createMessageBox(sentMessage));
        scrollToLatestMessage(); // auto scroll to the new message
    }
}

chatCards.forEach(function(card){
    card.addEventListener("click", function(){
        openChat(card);
    });
});

chatSearch.addEventListener("input", filterChats);
messageForm.addEventListener("submit", handleMessageSubmit);

backToList.addEventListener("click", function(){
    chatContent.classList.remove("chat-open");
});
