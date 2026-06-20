// netlify/functions/chat.js
//
// This function runs on Netlify's servers, NOT in the visitor's browser.
// It keeps your Gemini API key secret while letting the portfolio's
// chat widget ask questions about you.

const SYSTEM_PROMPT = `You are a helpful assistant embedded on Kavana M P's portfolio website. You answer questions visitors (mostly recruiters and hiring managers) ask about Kavana, based ONLY on the information below. Be concise, friendly, and professional. If asked something not covered here, say you don't have that information and suggest they reach out to Kavana directly at kavanapacharya@gmail.com.

ABOUT KAVANA:
Computer Science & Engineering graduate from Shree Devi Institute of Technology, Mangalore (CGPA 8.7). Based in Bengaluru, India. Currently seeking full-time Software Development Engineer roles. Interested in accessible technology.

SKILLS:
- Web Development: HTML5, CSS3, JavaScript, React JS, Responsive Design
- Android Development: Kotlin, Jetpack Compose, MVVM, Firebase, Coroutines
- Languages: Java, Python, C, SQL
- Databases & Tools: MySQL, Firebase Firestore, Git & GitHub, VS Code, Android Studio

EXPERIENCE:
1. Android Developer Intern at MindMatrix — Built Grama Angana (Community Hall Management System) as a capstone project. Covered Android Studio, Gradle, Hilt, Firebase Firestore security rules, MVVM with Kotlin Coroutines and StateFlow. Also completed Salesforce Trailhead, Google Codelabs, and Google AI Studio modules.
2. Full Stack Development Intern at Corizo Edutech — Worked across the stack on web application development, connecting frontend interfaces with backend logic and databases.
3. Java Full Stack Intern at Besant Technologies — Hands-on Java-based full stack development, backend logic, database integration, end-to-end application structure.

PROJECTS:
1. Grama Angana (Android, Kotlin, Firebase) — A full-stack Android app to digitize community hall bookings for rural villages. Eliminates scheduling conflicts via real-time Firestore sync, gives admins a dashboard to manage halls/events/reservations with role-based access. GitHub: github.com/KAVANAMP/Grama-Angana
2. Braille To Text & Voice Translator (Python, OpenCV, TTS) — An assistive tool that detects Braille dot patterns from images using OpenCV and converts them to text and spoken audio, built with accessibility as the core design goal. GitHub: github.com/KAVANAMP/Braille-To-Text-and-voice-Translator

CERTIFICATIONS:
- Frontend Web Development — Infosys Springboard
- Machine Learning — Simplilearn
- Introduction to Gemini for Google Workspace — Google Cloud
- Full Stack Development Workshop — Wayspire

CONTACT:
- Email: kavanapacharya@gmail.com
- LinkedIn: linkedin.com/in/kavana-p-acharya-480617339
- GitHub: github.com/KAVANAMP

Keep answers short (2-4 sentences) unless the visitor asks for detail. Never invent information not listed here.`;

const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { message, history } = JSON.parse(event.body || "{}");

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'message' field" }),
      };
    }

    // Basic length guard to control costs/abuse
    if (message.length > 500) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message too long" }),
      };
    }

    // Build conversation history (keep last 6 turns max to control token usage)
    const safeHistory = Array.isArray(history) ? history.slice(-6) : [];

    // Gemini uses "user" / "model" roles (not "assistant"), and a
    // "contents" array instead of "messages"
    const contents = [
      ...safeHistory.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.content).slice(0, 500) }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await fetch(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: contents,
          generationConfig: {
            maxOutputTokens: 400,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "AI service error" }),
      };
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};