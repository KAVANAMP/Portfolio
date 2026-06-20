// Init AOS
AOS.init({
  duration: 700,
  once: true
});

// Typing Effect
const phrases = [
  "Web & Android Developer",
  "React JS • Kotlin • Firebase",
  "Aspiring Software Engineer"
];
const target = document.querySelector(".type-target");
let pIndex = 0;
let charIndex = 0;
let forward = true;

function tick() {
  if (!target) return;
  const txt = phrases[pIndex];
  if (forward) {
    charIndex++;
    if (charIndex > txt.length) {
      forward = false;
      setTimeout(tick, 1200);
      return;
    }
  } else {
    charIndex--;
    if (charIndex === 0) {
      forward = true;
      pIndex = (pIndex + 1) % phrases.length;
    }
  }
  target.textContent = txt.slice(0, charIndex);
  setTimeout(tick, forward ? 60 : 30);
}
tick();

// Mobile Nav
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
navToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});
navLinks?.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("show");
  }
});

// Footer Year
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// Project Modal Elements
const modal = document.getElementById("project-modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

document.querySelectorAll("[data-project]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const key = e.currentTarget.dataset.project;
    openProject(key);
  });
});

function openProject(key) {
  let html = "";

  if (key === "grama") {
    html = `
      <h2>Grama Angana</h2>
      <p><strong>Tech:</strong> Kotlin, Firebase, Jetpack Compose</p>
      <p>
        Developed a Community Hall Management System that enables users
        to browse halls, make bookings, manage events and track
        reservations through an Android application.
      </p>
      <h3>Key Features</h3>
      <ul>
        <li>Firebase Authentication</li>
        <li>Hall Booking Management</li>
        <li>Admin Dashboard</li>
        <li>Real-time Firestore Database</li>
        <li>Jetpack Compose UI</li>
      </ul>
      <p>
        <strong>What I learned:</strong>
        Android development, Firebase integration,
        role-based access control and Jetpack Compose.
      </p>
    `;
  } else if (key === "braille") {
    html = `
      <h2>Braille To Text & Voice Translator</h2>
      <p>
        <strong>Tech:</strong>
        Python, OpenCV, NumPy, gTTS
      </p>
      <p>
        Developed an AI-based assistive system that captures
        Braille images, detects dot patterns and converts them
        into readable text and speech.
      </p>
      <h3>Key Features</h3>
      <ul>
        <li>Optical Braille Recognition</li>
        <li>Image Processing using OpenCV</li>
        <li>Text Conversion</li>
        <li>Voice Output using TTS</li>
        <li>Accessibility-focused Design</li>
      </ul>
      <p>
        <strong>What I learned:</strong>
        Image Processing, Pattern Recognition,
        Accessibility AI and Text-to-Speech Integration.
      </p>
    `;
  }

  modalContent.innerHTML = html;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  modalContent.innerHTML = "";
}

// ---------- AI Chat Widget ----------
(function () {
  const toggle = document.getElementById("chat-toggle");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const messagesEl = document.getElementById("chat-messages");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  const suggestionsEl = document.getElementById("chat-suggestions");

  if (!toggle || !panel || !form) return;

  let history = [];
  let isSending = false;

  toggle.addEventListener("click", () => {
    panel.classList.toggle("hidden");
    if (!panel.classList.contains("hidden")) {
      input.focus();
    }
  });

  closeBtn?.addEventListener("click", () => {
    panel.classList.add("hidden");
  });

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = "chat-msg " + (sender === "user" ? "chat-msg-user" : "chat-msg-bot");
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function addTypingIndicator() {
    const div = document.createElement("div");
    div.className = "chat-msg chat-msg-bot chat-msg-typing-wrap";
    div.innerHTML = '<span class="chat-msg-typing"><span></span><span></span><span></span></span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  async function sendMessage(text) {
    if (!text.trim() || isSending) return;
    isSending = true;
    sendBtn.disabled = true;
    suggestionsEl.style.display = "none";

    addMessage(text, "user");
    history.push({ role: "user", content: text });
    input.value = "";

    const typingEl = addTypingIndicator();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: history.slice(0, -1) }),
      });

      const data = await res.json();
      typingEl.remove();

      if (!res.ok || !data.reply) {
        addMessage("Sorry, something went wrong. Please try again or email me directly.", "bot");
      } else {
        addMessage(data.reply, "bot");
        history.push({ role: "assistant", content: data.reply });
      }
    } catch (err) {
      typingEl.remove();
      addMessage("Sorry, I'm having trouble connecting right now. Please try again shortly.", "bot");
    } finally {
      isSending = false;
      sendBtn.disabled = false;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });

  suggestionsEl?.querySelectorAll(".chat-suggestion").forEach((btn) => {
    btn.addEventListener("click", () => {
      sendMessage(btn.textContent);
    });
  });
})();