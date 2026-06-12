# 🔗 Serverless URL Shortener

A production-style serverless URL shortener built on AWS using event-driven architecture. The application allows users to generate short URLs with configurable expiration times, track link clicks, and redirect users to original destinations through a scalable serverless backend.

---

## 🚀 Architecture

```text
                ┌─────────────────┐
                │  React + Vite   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ API Gateway     │
                └────────┬────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼

 ┌─────────────────┐         ┌─────────────────┐
 │ Create URL      │         │ Redirect URL    │
 │ Lambda          │         │ Lambda          │
 └────────┬────────┘         └────────┬────────┘
          │                           │
          ▼                           ▼
 ┌─────────────────┐         ┌─────────────────┐
 │ DynamoDB        │         │ DynamoDB        │
 │ UrlShortener    │         │ Read URL        │
 └─────────────────┘         └────────┬────────┘
                                      │
                                      ▼
                              ┌─────────────────┐
                              │ Amazon SQS      │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │ Click Worker    │
                              │ Lambda          │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │ DynamoDB        │
                              │ clickCount++    │
                              └─────────────────┘
```

---

## ✨ Features

* Generate short URLs instantly
* Custom expiration time for links
* Automatic expiration handling
* Duplicate URL detection
* Reuse existing short URLs
* Click tracking and analytics
* Event-driven click processing using SQS
* DynamoDB TTL support
* Responsive React frontend
* Fully serverless architecture
* AWS Free Tier friendly

---

## 🏗️ AWS Services Used

* AWS Lambda
* Amazon API Gateway
* Amazon DynamoDB
* Amazon DynamoDB TTL
* Amazon SQS
* AWS IAM
* Amazon CloudWatch

---

## 📁 Project Structure

```text
app/
 └── React + Vite Frontend

lambda/
 ├── create_url_lambda.py
 ├── redirect_lambda.py
 └── click_worker_lambda.py
```

---

## ⚙️ Application Flow

### 1. Create Short URL

User submits a URL and expiry time.

```text
Frontend
   ↓
API Gateway
   ↓
Create URL Lambda
   ↓
DynamoDB
```

If the URL already exists:

* Existing short URL is returned
* Expiry time is updated

If the URL is new:

* New short code is generated
* Record is stored in DynamoDB

---

### 2. Redirect Flow

User visits:

```text
https://bit.moinnaik.in/abc123
```

Flow:

```text
Browser
   ↓
API Gateway
   ↓
Redirect Lambda
   ↓
DynamoDB Lookup
   ↓
Return Original URL
```

The frontend then redirects the user to the destination URL.

---

### 3. Click Tracking Flow

Every successful redirect generates a click event.

```text
Redirect Lambda
      ↓
Amazon SQS
      ↓
Click Worker Lambda
      ↓
DynamoDB
(clickCount + 1)
```

Analytics processing is asynchronous and does not impact redirect performance.

---

## 🗄️ DynamoDB Schema

### Table: UrlShortener

| Attribute  | Type   | Description        |
| ---------- | ------ | ------------------ |
| shortCode  | String | Partition Key      |
| longUrl    | String | Original URL       |
| clickCount | Number | Total clicks       |
| expiryTime | Number | Unix TTL timestamp |
| createdAt  | String | Creation timestamp |

### Global Secondary Index

| Index Name    | Partition Key |
| ------------- | ------------- |
| longUrl-index | longUrl       |

Used to detect duplicate URLs and update expiry instead of creating new records.

---

## 📡 API Endpoints

### Create Short URL

```http
POST /shorten
```

Request:

```json
{
  "longUrl": "https://www.moinnaik.in",
  "expiryMinutes": 60
}
```

Response:

```json
{
  "shortUrl": "https://bit.moinnaik.in/abc123"
}
```

---

### Resolve Short URL

```http
GET /{shortCode}
```

Response:

```json
{
  "success": true,
  "longUrl": "https://www.moinnaik.in"
}
```

---

## 💻 Frontend

Built with:

* React
* Vite
* JavaScript
* CSS

Features:

* URL shortening
* Expiry selection
* Copy short URL
* Mobile responsive design
* Error handling
* Expired link handling

---

## 🔐 IAM Permissions

Lambda execution role requires:

* AmazonDynamoDBFullAccess
* AmazonSQSFullAccess
* AWSLambdaBasicExecutionRole

For production environments, use least-privilege custom IAM policies.

---

## 📚 Concepts Demonstrated

* Serverless Architecture
* Event-Driven Design
* Asynchronous Processing
* AWS Lambda Development
* API Gateway Integration
* DynamoDB Data Modeling
* DynamoDB TTL
* SQS Messaging
* Cloud-Native Development
* React Frontend Integration
* Click Analytics

---

## 🏁 Project Status

* ✅ URL Shortening
* ✅ Expiry Management
* ✅ Duplicate URL Detection
* ✅ Click Tracking
* ✅ SQS Event Processing
* ✅ Mobile Responsive UI
* ✅ Custom Domain Support
* ✅ AWS Free Tier Compatible