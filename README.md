# 📱 Quote Vault App

Quote Vault is a **React Native CLI** based mobile application that allows users to explore, search, and save inspirational quotes.  
The app uses **Supabase** for authentication, database, and cloud-synced favorites.

---

## ✨ Features

### 🔐 Authentication
- Login & Signup using Supabase Auth
- Persistent session (stay logged in)
- Forgot Password support

### 🏠 Home Screen
- Browse quotes with infinite scrolling
- Category-based filtering (Motivation, Love, Success, etc.)
- Search quotes by text or author
- **Quote of the Day** (changes daily using local deterministic logic)

### ❤️ Favorites
- Save / remove quotes to favorites
- Favorites synced with Supabase (cloud-based)
- Dedicated Favorites screen

### 👤 Profile
- View logged-in user details
- Logout functionality

---
🤖 AI Tools Used

This project was built with the assistance of multiple AI tools to improve development speed, code quality, and architectural decisions.

1️⃣ ChatGPT (OpenAI)

Purpose:

Designing overall app architecture (Auth flow, Navigation, Screens)

Writing React Native components (Home, Profile, Favorites, Auth screens)

Supabase integration (Auth, CRUD, relations, pagination)

Debugging runtime and TypeScript errors

Optimizing UI/UX issues (tab height, spacing, touch issues)

Implementing advanced features:

Quote of the Day (daily logic)

Favorites & collections

Infinite scrolling & filtering

Improving code readability and best practices

Impact:
Reduced development time significantly and helped implement complex logic correctly.

2️⃣ GitHub Copilot

Purpose:

Auto-completing repetitive React Native and TypeScript code

Suggesting hooks, styles, and component structures

Speeding up UI implementation and refactoring

Impact:
Improved coding speed and reduced boilerplate writing.

3️⃣ Supabase AI (SQL Editor Suggestions)

Purpose:

Writing and validating SQL queries

Creating tables and relationships (quotes, favorites, profiles)

Understanding foreign key relations and joins

Impact:
Ensured correct database structure and smooth backend integration.

4️⃣ Figma / Stitch AI (Design Reference)

Purpose:

UI inspiration for cards, tabs, and layouts

Color and spacing reference

Translating designs into React Native components

Impact:
Helped maintain visual consistency and clean UI.

🧠 AI-Assisted Workflow

Defined feature requirements and evaluation criteria

Used AI to break features into small tasks

Implemented features incrementally

Debugged and refined using AI suggestions

Finalized code with performance and UX improvements



## 🛠 Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | React Native CLI |
| Navigation | React Navigation (Native Stack) |
| Backend | Supabase |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL |
| Styling | React Native StyleSheet |
| State | React Hooks |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/priyankavpatil1717-ctrl/react-native-app.git
