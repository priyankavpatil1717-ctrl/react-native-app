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
