# NovaBuy — Premium E-Commerce Platform

NovaBuy is a robust, full-stack e-commerce solution engineered with a Node.js/Express backend and MongoDB. It features a highly responsive, premium dark-themed glassmorphism UI. The platform supports complete user flows including secure login, advanced product browsing, dynamic cart management, and seamless order processing.

---

## 📸 Screenshots
![alt text](<public/images/Screenshot 2026-04-18 222029.png>)
![alt text](<public/images/Screenshot 2026-04-18 222046.png>)
![alt text](<public/images/Screenshot 2026-04-18 222109.png>)
![alt text](<public/images/Screenshot 2026-04-18 222203.png>)
![alt text](<public/images/Screenshot 2026-04-18 222215.png>)


---

## 🚀 Features
- **Modern User Interface:** Sleek, dark-mode styling utilizing glassmorphism aesthetics.
- **User Authentication:** Secure signup and login flows using JWT and bcrypt.
- **Product Management:** Dynamic product listings with search and filtering capabilities.
- **Shopping Cart:** Interactive cart functionality with real-time total calculation.
- **Order Processing:** Seamless checkout and order history tracking.
- **RESTful API:** Structured backend routing for scalable data management.

---

## 📂 Folder Structure

```text
E-COM/
│
├── config/           # Database configuration and connection setup
├── middleware/       # Custom Express middlewares (e.g., JWT authentication)
├── models/           # Mongoose schemas (User, Product, Order)
├── public/           # Frontend static files (HTML, CSS, client-side JS)
├── routes/           # API routes (Auth, Products, Orders, Cart)
├── seeds/            # Scripts to populate the database with dummy data
├── .env              # Environment variables configuration 
├── .gitignore        # Git ignore rules
├── package.json      # Project dependencies and npm scripts
└── server.js         # Main entry point of the Express application
```

---

## 💻 How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and a running instance of [MongoDB](https://www.mongodb.com/try/download/community) installed on your machine.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd E-COM
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Make sure you have a `.env` file in the root directory. It should look like this:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Seed the Database (Optional)
To populate the database with initial products so the shop isn't empty, run the seeding script:
```bash
npm run seed
```

### 5. Start the Application
To run the server in development mode (with hot-reloading via nodemon):
```bash
npm run dev
```

To run the server normally:
```bash
npm start
```

The application will be running on `http://localhost:3000` (or whatever `PORT` you've specified).

---

## 🛠️ Technology Stack
- **Frontend:** HTML5, Vanilla CSS (Glassmorphism), Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
