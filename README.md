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