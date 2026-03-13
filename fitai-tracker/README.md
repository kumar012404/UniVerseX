# FitAI Tracker 🏋️‍♂️🤖

FitAI Tracker is a modern fitness and nutrition tracking application powered by AI (Gemini and Groq). It helps you track your workouts, logs your diet with an AI food scanner, and provides a smart chat coach.

## 🚀 Features

-   **AI Food Scanner**: Upload a photo of your meal to automatically detect calories, protein, carbs, and fat (Powered by Gemini 2.0).
-   **FitAI Coach**: A personal fitness assistant that provides workout and nutrition advice (Powered by LLaMA 3 via Groq).
-   **Dashboard**: Visualize your daily fitness stats and track your goal progress.
-   **Diet Log**: Record your meals and monitor your macros.
-   **Workout Log**: Track your strength progress and stay consistent with your routines.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Hot Toast, Lucide Icons.
-   **Backend**: Node.js, Express, MongoDB (Mongoose), Multer.
-   **AI Integration**: Google Generative AI (Gemini), Groq SDK.

## 📦 Installation

### Prerequisites
-   Node.js installed
-   MongoDB account/server
-   Gemini API Key
-   Groq API Key

### Setup Server
1. Navigate to the `server` folder.
2. Run `npm install`.
3. Create a `.env` file with the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_key
   GROQ_API_KEY=your_groq_key
   ```
4. Run `npm start`.

### Setup Client
1. Navigate to the `client` folder.
2. Run `npm install`.
3. Run `npm run dev`.

## 🛡️ License
This project is for educational purposes as an Alpha Tester.
