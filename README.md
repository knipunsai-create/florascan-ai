
# 🌿 FloraScan AI — Plant Disease Detection Using CNN

FloraScan AI is an AI-powered web application that helps users identify possible plant diseases from leaf images. Users can upload a leaf image or capture one using a camera to receive an AI-generated prediction and plant-care guidance.

## 🎯 Project Objectives

- Identify possible plant diseases from leaf images.
- Display the predicted disease and model confidence.
- Provide practical plant-care guidance.
- Validate images to help reject non-plant inputs.
- Offer a simple, user-friendly web interface.

## ✨ Features

- 🌱 Plant-leaf image upload
- 📷 Camera capture
- 🤖 CNN-based plant disease prediction
- 🔍 Leaf-image validation
- 📊 Prediction confidence display
- 🌿 Plant-care guidance
- 🔐 Firebase authentication
- 🕘 Scan history stored in browser local storage
- 📱 Responsive botanical-themed interface

## 🛠️ Technologies Used

| Component | Technology |
|---|---|
| Frontend | React.js |
| Build tool | Vite |
| Backend | Python, FastAPI |
| Machine learning | Convolutional Neural Network (CNN) |
| Image validation | Leaf validation model |
| Authentication | Firebase Authentication |
| Backend hosting | Render |
| Version control | Git and GitHub |

## 🏗️ System Architecture

1. The user opens the FloraScan AI web application.
2. The user signs in and selects or captures a plant-leaf image.
3. The frontend sends the image to the backend prediction API.
4. The backend validates the image and processes it using the prediction model.
5. The backend returns the prediction response.
6. The frontend displays the result and available care guidance.

## 🔗 Backend API

The backend is deployed on Render.

**API service URL:**  
https://florascan-ai-api.onrender.com/

**Prediction endpoint:**  
https://florascan-ai-api.onrender.com/predict

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the frontend repository

Replace the placeholder with your actual frontend GitHub repository URL.

```bash
git clone YOUR_FRONTEND_GITHUB_REPOSITORY_URL
```

### 2. Open the project folder

```bash
cd florascan-ai
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Open the local URL printed in the terminal. Vite commonly uses:

http://localhost:5173/

If that port is occupied, Vite may use another port.

## 🔐 Authentication

FloraScan AI uses Firebase Authentication for user authentication.

Configured sign-in options include:

- Email and password
- Google sign-in

Ensure that the required domains are authorized in Firebase Authentication settings.

Never commit private credentials or service-account keys to GitHub.

## 📁 Frontend Project Structure

```text
florascan-ai/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── Login.jsx
│   ├── Login.css
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## ⚠️ Limitations

- Predictions may be incorrect, especially for unclear or unsuitable images.
- Model confidence does not guarantee prediction accuracy.
- The model can only classify the categories it was trained to recognize.
- Plant-care guidance is informational and is not a substitute for professional agricultural advice.
- Scan history stored in local storage is browser-specific.

## 🔮 Future Improvements

- Expand the training dataset to cover more plant species and diseases.
- Evaluate the model using precision, recall, F1-score, and a confusion matrix.
- Improve disease descriptions and treatment guidance.
- Add cloud-based scan history and user-specific reports.
- Develop a dedicated mobile application.

## 📌 Project Information

**Project Name:** FloraScan AI  
**Domain:** Artificial Intelligence and Machine Learning  
**Project Type:** Plant Disease Detection Using CNN

## 📄 Disclaimer

FloraScan AI provides predictions for educational and informational purposes. Results are not guaranteed to be accurate. Verify important disease and treatment decisions with a qualified agricultural professional.

## 📜 License

Add a suitable open-source license if you intend to distribute the project publicly.
