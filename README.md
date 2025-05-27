# 🔐 2FA Authentication & Authorization Microservice

A Node.js-based microservice that provides secure user authentication with optional **Two-Factor Authentication (2FA)** using **Time-based One-Time Passwords (TOTP)**. It uses **JWT** for access control, supports **refresh tokens**, and is ready to run in **Docker**.

---

## 🛠️ Features

- ✅ User registration & login with hashed passwords
- 🔐 Optional Two-Factor Authentication (2FA) via TOTP (Google Authenticator)
- 🔁 JWT-based access & refresh token flow
- 🧪 Modular architecture with testable Express app
- 🐳 Docker & Docker Compose support
- 🧪 Postman Collection for quick testing

---

## 📦 Tech Stack

- **Node.js**, **Express**
- **MongoDB** with **Mongoose**
- **bcryptjs** for password hashing
- **jsonwebtoken** for token handling
- **speakeasy** for TOTP-based 2FA
- **qrcode** for generating QR codes
- **dotenv**, **cors**, etc.
- **Docker** for containerization

---

## 📁 Project Structure

2fa-auth-service/
├── src/
│ ├── app.js
│ ├── server.js
│ ├── config/
│ ├── controllers/
│ ├── routes/
│ ├── services/
│ └── models/
├── .env
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md


## 🚀 Getting Started

### 1. Clone the Repo

```
git clone https://github.com/kadelcode/2fa-auth-service.git
cd 2fa-auth-service
```

### 2. Install Dependencies
```
npm install
```

### 3. Set Environment Variables
Create a ```.env``` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/2fa_auth
JWT_SECRET=your_jwt_secret
```

### 4. Run Locally
```
npm start
```
Or using Docker:
```
docker-compose up --build
```
---

## 📮 API Endpoints
|Method|Endpoint                     |Description          |
|------|-----------------------------|---------------------|
|POST  |```/api/auth/register```     |Register new user    |
|POST  |```/api/auth/login```        |Register new user    |
|POST  |```/api/auth/2fa/setup```    |Register new user    |
|POST  |```/api/auth/2fa/verify```   |Verify 2FA TOTP code |
|POST  |```/api/auth/refresh-token```|Get new access & refresh token |

---


