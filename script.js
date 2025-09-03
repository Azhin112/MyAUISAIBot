const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");

// Replace with your deployed backend URL
const BACKEND_URL = "https://myauisaibot.onrender.com";

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  userInput.value = "";

  // Show loading
  const loading = appendMessage("Typing...", "bot");

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    chatbox.removeChild(loading);
    appendMessage(data.answer, "bot");
  } catch (error) {
    chatbox.removeChild(loading);
    appendMessage("Sorry, something went wrong.", "bot");
    console.error(error);
  }
}

// Append message
function appendMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.textContent = text;
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
  return msgDiv;
}

// Button click handler
function buttonClick(text) {
  userInput.value = text;
  sendMessage();
}
