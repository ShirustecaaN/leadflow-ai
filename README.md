# LeadFlow AI

An AI-powered CSV importer that converts messy lead spreadsheets into CRM-ready contacts using Gemini AI.

## 🚀 Overview

LeadFlow AI helps businesses import lead data from different CSV formats and automatically extracts important CRM fields.

The application allows users to:

- Upload any CSV lead file
- Preview data before processing
- Confirm import only when ready
- Use AI to map different column names into CRM fields
- View imported and skipped records

## ✨ Features

### CSV Import
- Upload CSV files from different sources
- Preview original CSV data before processing
- Supports different column names and structures

### AI-Powered Extraction
- Uses Gemini AI for intelligent field mapping
- Converts messy CSV data into CRM format
- Understands different column names like:
  - Customer Name → Name
  - Mail ID → Email
  - Contact No → Mobile
  - Location → City
  - Comments → CRM Notes

### Data Validation
- Automatically skips invalid records
- Skips leads without email and mobile number
- Displays skipped rows with reasons

### User Experience
- Responsive tables
- Sticky headers
- Loading state during AI processing
- Import summary showing total imported and skipped records

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js

### AI
- Google Gemini API

## 📂 Project Structure


leadflow-ai/
│
├── app/ # Next.js frontend
│
├── backend/
│ ├── server.js # Express API server
│ └── services/
│ └── aiExtractor.js # Gemini AI extraction logic
│
├── README.md
└── package.json


## ⚙️ Setup Instructions

### Frontend Setup

Install dependencies:

```bash
npm install

Run frontend:

npm run dev

Frontend runs on:

http://localhost:3000
Backend Setup

Go to backend folder:

cd backend

Install dependencies:

npm install

Create a .env file:

GEMINI_API_KEY=your_api_key_here

Start backend:

node server.js

Backend runs on:

http://localhost:5000
🔄 Application Flow
Upload CSV
     ↓
Preview Original Data
     ↓
Confirm Import
     ↓
Gemini AI Extraction
     ↓
CRM Ready Records
     ↓
Imported / Skipped Results
📌 CRM Fields Extracted
Name
Email
Mobile Number
Company
City
Country
CRM Status
CRM Notes
🔒 Security
API keys are stored using environment variables
Data processing happens only after user confirmation
👩‍💻 Author

Shirustecaa Nagesh
