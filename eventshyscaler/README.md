# Run and deploy your App

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js

## Frontend
1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# 🚀 Server Backend Deployment (Render)

This is the backend server of the project, built using **Node.js**, **Express.js**, and **MongoDB** (via Mongoose), and deployed on [Render](https://render.com).

## 🌐 Live Server URL

👉 [https://hyscaler-event.onrender.com/api](https://hyscaler-event.onrender.com/api)

👉 [Github Server Repo](https://github.com/anujsolanki716/hyscaler-event)

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **Dotenv** for environment variables
- **Render** for cloud deployment







# 🎉 EventsHyScaler

**EventsHyScaler** is a full-stack web application that enables users to **discover**, **create**, and **engage** with events. It uses **Google Gemini API** for AI-powered event generation, description crafting, and intelligent chat interactions.

The app is built using:
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **AI**: Google Gemini API (`@google/genai`)

---

## ✨ Features

### Frontend

- 🔐 **Login System** – Name-based login, passwords required.
- 🔎 **Event Discovery** – Browse and filter events by title, description, or location.
- ✍️ **AI Descriptions** – Generate engaging event descriptions from event titles.
- 🧾 **Event Creation** – Create events with title, time, date, location, and ticket price.
- 📄 **Detailed Event Pages** – Show event image, date, location, description, and ticket info.
- ✅ **One-Click Registration** – Register for any event and manage in “My Bookings”.
- 📊 **Dashboard** – Manage created events and track attendees.

### Backend

- 🧠 **AI Integration** – Descriptions, and AI chat via Gemini.
- 🗃️ **MongoDB Database** – Stores user, event, and booking information.
- 🛠️ **REST API** – Full CRUD API to support all event and user operations.
- 🔐 **JWT Auth** – Secured routes using JSON Web Tokens.

---

## 🧠 Gemini API Functions (Located in `services/geminiService.ts`)

- `generateEventDescription(title, keywords)`
  - Model: `gemini-2.5-flash`
  - Returns: A compelling paragraph-style description

---

## 🛠️ Tech Stack

| Layer       | Tech Stack                               |
|-------------|-------------------------------------------|
| Frontend    | React, TypeScript, Tailwind CSS           |
| Backend     | Node.js, Express, MongoDB, Mongoose       |
| AI API      | Google Gemini API        |
| Auth        | JWT                                       |
| Routing     | React Router (client) + Express Router    |
| State Mgmt  | React Context API                         |

---


