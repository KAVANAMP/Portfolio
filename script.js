// Init AOS
AOS.init({
  duration: 700,
  once: true
});

// Typing Effect
const phrases = [
  "Aspiring Software Engineer",
  "Web Developer — HTML • CSS • JavaScript • React"
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
      setTimeout(tick, 1000);
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

// Modal Elements
const modal = document.getElementById("project-modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

// ONLY Details Buttons
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
  }

  else if (key === "braille") {
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 94c3665c4542649d5cf08fa773625b8f04ac0c89
