# 🔗 Serverless URL Shortener (AWS Lambda + SQS)

A fully serverless **URL shortener system** built using AWS services with event-driven architecture.
It allows users to generate short URLs and redirect them to original links.

---

## 🚀 Live Architecture

```text
Frontend (Vite React)
        ↓
API Gateway
        ↓
Lambda (Producer)
        ↓
SQS Queue
        ↓
Lambda (Worker)
        ↓
DynamoDB
        ↓
Redirect Lambda (GET /{code})
```

---

## 🧠 Features

* 🔗 Generate short URLs from long URLs
* ⚡ Fast redirection using AWS Lambda
* 📦 Asynchronous processing using SQS
* 🗄️ Persistent storage using DynamoDB
* 🌐 Simple React (Vite) frontend
* ☁️ Fully serverless (no EC2 required)
* 💰 Free-tier friendly architecture

---

## 🏗️ AWS Services Used

* AWS Lambda (Python)
* Amazon API Gateway (HTTP API)
* Amazon SQS (Message Queue)
* Amazon DynamoDB (Database)
* AWS IAM (Permissions)

---

## 📁 Project Structure

```text
app/
 └── Vite React App

lambda/
 ├── producer_lambda.py   (creates short URL, sends to SQS)
 ├── worker_lambda.py     (consumes SQS, stores in DynamoDB)
 └── redirect_lambda.py   (handles GET /{code})
```

---

## ⚙️ How It Works

### 1️⃣ Create Short URL

User submits a long URL from frontend.

```text
POST /shorten
```

Flow:

```
Frontend → API Gateway → Producer Lambda → SQS → Worker Lambda → DynamoDB
```

---

### 2️⃣ Redirect Flow

User opens short URL:

```text
GET /abc123
```

Flow:

```
Browser → API Gateway → Redirect Lambda → DynamoDB → 301 Redirect
```

---

## 📦 DynamoDB Table Design

**Table Name:** `UrlShortener`

| Field     | Type   | Description  |
| --------- | ------ | ------------ |
| shortCode | String | Primary Key  |
| longUrl   | String | Original URL |
| createdAt | String | Timestamp    |

---

## 🖥️ Frontend Setup (Vite + React)

### Install dependencies

```bash
npm install
```

### Run project

```bash
npm run dev
```

### Features

* Input long URL
* Generate short URL
* Click and redirect

---

## 🧪 API Endpoints

### Create Short URL

```http
POST https://<api-id>.execute-api.<region>.amazonaws.com/shorten
```

Body:

```json
{
  "longUrl": "https://google.com"
}
```

---

### Redirect URL

```http
GET https://<api-id>.execute-api.<region>.amazonaws.com/{shortCode}
```

---

## 🔐 IAM Permissions Required

Lambda execution role needs:

* AmazonDynamoDBFullAccess
* AmazonSQSFullAccess
* AWSLambdaBasicExecutionRole

---

## 📊 Key Concepts Learned

* Serverless architecture
* Event-driven systems
* AWS Lambda functions
* SQS decoupling pattern
* DynamoDB NoSQL design
* API Gateway routing
* React frontend integration

---

## 🏁 Status

✔ MVP Completed
✔ Fully working end-to-end
✔ Free-tier compatible
✔ Production-style architecture

---

## 👨‍💻 Author

Built as a learning project to understand AWS Serverless architecture, event-driven systems, and cloud-native development.

---