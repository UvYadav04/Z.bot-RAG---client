# 💻 Z.bot---Client — Intelligent Document Chat Interface

Z.bot (client side) is a **modern, responsive React-based frontend** designed to interact seamlessly with the Z.bot RAG backend.

It provides a **real-time AI chat experience with document context**, enabling users to upload files, manage chats, and receive streamed responses — all with a clean and intuitive UI.

---

## ✨ Key Features

* ⚡ **Real-time Streaming Chat**

  * Token-by-token response rendering
  * Smooth and responsive chat experience

* 📄 **Document Upload & Management**

  * Upload PDF documents
  * Visual upload progress & status indicators
  * Context selection for querying

* 🔍 **Document Search**

  * Quickly filter documents in sidebar
  * Efficient navigation for large document sets

* 💬 **Multi-Chat System**

  * Create new chats
  * Resume previous conversations
  * Persistent chat history (for logged-in users)

* 👤 **Authentication**

  * Google OAuth login
  * Seamless session handling for guest users

* 🔄 **Error Handling & Retry**

  * Graceful UI for failed requests
  * Retry actions with clear feedback

* 📱 **Responsive Design**

  * Works across desktop and smaller screens
  * Optimized layout for usability

---

## 🏗️ UI Architecture

```id="u9x8y2"
Sidebar (Left Panel)
├── Document List (Searchable)
├── Upload Status / Info
└── Chat History (Bottom)

Main Chat Area
├── Messages (User + AI)
├── Streaming Response
└── Input Box (Shift+Enter support)
```

---

## 🛠️ Tech Stack

* **React.js**
* **TypeScript**
* **State Management:** (RTK Query / Context API)
* **Styling:** Tailwind CSS / ShadCN UI
* **Icons:** Lucide React
* **Networking:** Fetch API / RTK Query

---

## 📂 Features Breakdown

### 📄 Document Panel

* Displays uploaded documents
* Supports:

  * Search/filter by name
  * Selection for query context
* Behavior:

  * Logged-in users → persistent (fetched from backend)
  * Guest users → session-based

---

### 💬 Chat System

* Create and manage multiple chats
* Features:

  * Switch between chats
  * Continue previous conversations
  * Maintain context per chat

---

### ⚡ Streaming UI

* Displays responses as they are generated
* Improves:

  * Perceived performance
  * User engagement

---

### ⌨️ Input Handling

* Enter → Send message
* Shift + Enter → New line
* Controlled input with smooth UX

---

### 🔄 Error Handling

* Inline error messages
* Retry buttons for failed actions
* Non-blocking UI feedback

---

## 🔁 Data Flow

```
User Input
   ↓
API Request (Query / Upload)
   ↓
Streaming Response
   ↓
UI Updates in Real-Time
```

---

## ▶️ Getting Started

### 1. Clone the repository

```bash id="3h20di"
git clone https://github.com/your-username/Z.bot-RAG---client
cd Z.bot-RAG---client
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Environment variables

Create a `.env` file:

```
VITE_SERVER_URI=http://localhost:8000
```

---

### 4. Run the app

```
npm run dev
```

---

## 🎯 Design Principles

* ⚡ **Fast Feedback** → Streaming responses
* 🧠 **Context Awareness** → Document + chat integration
* 🧩 **Modular UI** → Clean separation of panels
* 🔄 **Resilience** → Retry & error handling
* 📱 **Responsiveness** → Works across devices

---

## 🚀 Future Improvements

* Drag & drop document upload
* Dark mode support
* Chat export / sharing
* Better mobile UX
* Virtualized lists for large datasets

---

## 🧠 Why Z.bot Client?

Z.bot Client focuses on delivering:

> “A seamless, real-time AI experience where users can interact with their documents naturally.”

By combining:

* **Streaming UI**
* **Contextual document access**
* **Persistent chat system**

…it provides a **production-ready frontend for RAG-based applications**.

---
