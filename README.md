# 🚀 LeadFlow AI

An AI-powered CSV importer that transforms messy lead spreadsheets into clean, CRM-ready contacts.

🔗 **Live Demo:** https://leadflow-ai-five-lilac.vercel.app/

---

## 📌 Overview

LeadFlow AI helps businesses quickly import lead data from different CSV sources and convert unstructured spreadsheets into organized CRM records.

The application allows users to:

* Upload CSV lead files from different sources
* Preview original data before processing
* Confirm import only after reviewing the records
* Automatically map different column formats into CRM fields
* Identify imported and skipped leads with clear reasons

---

## ✨ Features

### 📂 CSV Import & Preview

* Upload CSV files from Excel, marketing platforms, and other lead sources
* Preview raw CSV data before processing
* Supports different column names and structures

Examples:

```
Customer Name → Name
Mail ID → Email
Contact No → Mobile
Location → City
Comments → CRM Notes
```

---

### 🤖 AI-Powered Lead Processing

* Uses AI-based extraction for intelligent field mapping
* Converts messy lead data into structured CRM format
* Understands different CSV formats and column variations

---

### ✅ Data Validation

* Automatically validates imported lead records
* Skips incomplete records when required information is missing
* Displays skipped leads with detailed reasons

---

### 💼 CRM Ready Output

Generates structured CRM records containing:

* Name
* Email
* Mobile Number
* Company
* City
* Country
* CRM Status
* CRM Notes

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express.js

### AI

* Google Gemini API

---

## 📂 Project Structure

```
leadflow-ai/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── backend/
│   ├── server.js
│   └── services/
│       └── aiExtractor.js
│
├── package.json
└── README.md
```

---

## ⚙️ Local Setup

### Frontend Setup

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

### Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

Start backend:

```bash
node server.js
```

Backend runs on:

```
http://localhost:5000
```

---

## 🔄 Application Workflow

```
Upload CSV
     ↓
Preview Original Data
     ↓
Confirm Import
     ↓
AI Processing & Field Mapping
     ↓
CRM Ready Records
     ↓
Imported / Skipped Results
```

---

## 🔒 Security

* API keys are stored securely using environment variables
* Data processing starts only after user confirmation
* User data is reviewed before import

---

## 👩‍💻 Author

**Shirustecaa Nagesh**
