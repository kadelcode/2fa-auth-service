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
|Method|Endpoint                       |Description                     |
|------|-------------------------------|--------------------------------|
|POST  |```/api/auth/register```       |Register new user               |
|POST  |```/api/auth/login```          |Login new user                  |
|POST  |```/api/auth/2fa/setup```      |Setup 2FA and get QR code       |
|POST  |```/api/auth/2fa/verify```     |Verify 2FA TOTP code            |
|POST  |```/api/auth/refresh-token  ```|Get new access & refresh token  |
|POST  |```/api/auth/forgot-password```|Accepts email, sends reset link |
|POST  |```/api/auth/reset-password ```|Accepts token and new password    |


🔗 Import the [Postman Collection]() or use the included ```postman_collection.json``` file.

---

## 🔐 2FA Setup & Flow
1. Register & login normally.
2. POST ```/2fa/setup``` to get a secret & QR code.
3. Scan QR in Google Authenticator.
4. POST ```/2fa/verify``` with the 6-digit code.
5. On next login, 2FA will be required.

---

## 🧪 Testing
You can test endpoints using:

- Postman (see included collection)
- Supertest & Jest (setup testing with app.js export)

Example test file: ```test/auth.test.js```

---

## 🐳 Docker Support
```
docker-compose up --build
```
- App runs at ```http://localhost:5000```
- MongoDB runs on port ```27017```

---

## 🔒 Security Notes
- All secrets are kept in ```.env``` file
- Passwords are hashed with bcrypt
- JWT tokens are signed securely
- 2FA secrets are stored server-side only
- Refresh tokens are rotated on each use

---

## 🧩 To Do / Extensions
- Role-based authorization (admin, user, etc.)
- Email or SMS 2FA option
- Rate limiting & brute force protection
- Add Swagger API docs
- Unit & integration tests

---

## 📝 License
This project is licensed under the MIT License.