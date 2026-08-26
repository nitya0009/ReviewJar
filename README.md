# ReviewJar 

A full-stack product review platform where users can explore products, share their experiences, and manage product reviews through a clean and responsive interface.

##  About

ReviewJar is a MERN-stack web application built to provide a simple platform for users to discover products and share their opinions through reviews.

The application includes a React frontend and an Express.js backend connected to MongoDB using Mongoose. It also includes user authentication, protected routes, product management, and image upload functionality.



## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* CORS
* dotenv

## 📂 Project Structure

```text
ReviewJar/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── .env.example
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/nitya0009/ReviewJar.git
cd ReviewJar
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

Add the required environment variables based on the provided `.env.example` file.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

If the frontend requires environment variables, create a `.env` file inside the `client` directory as well.

> Never commit actual passwords, database credentials, JWT secrets, or other private API keys to GitHub.

## ▶️ Running the Application

### Start the backend

```bash
cd server
npm run dev
```

The backend will start using Node.js and Express.

### Start the frontend

In another terminal:

```bash
cd client
npm run dev
```
Vite will start the frontend development server.



## 👩‍💻 Author

Nitya Nandini

GitHub: [@nitya0009](https://github.com/nitya0009)
