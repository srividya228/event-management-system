# Event Booking System

A full-stack web application designed to simplify the event planning process. This project allows users to register, log in, explore various event services (like catering, photography, music, etc.), and book slots for events. It uses a Node.js backend with Express and MongoDB for data management, and a responsive frontend built with HTML, CSS, and JavaScript.

## 🎯 Project Goals

- Provide an intuitive interface for users to explore event services.
- Enable easy registration and login for users.
- Allow users to book services and manage their event details.
- Offer a modular and expandable codebase for future feature integration.

## ✨ Features

### 🔐 Authentication
- User Registration
- Secure Login with server-side authentication

### 📅 Booking & Services
- Slot booking system for scheduling events
- Pages for various event services:
  - **Catering**
  - **Photography**
  - **Music**
  - **Venue Decoration**

### 📂 Frontend Interface
- Multiple static HTML pages
- Clean and simple navigation bar
- JavaScript-based interactivity

### 🧠 Backend (Node.js + Express)
- RESTful endpoints for registration and login
- MongoDB integration for storing user data and bookings
- Two server scripts (`server.js`, `server2.js`) for modular or experimental development

## 🛠️ Technologies Used

| Area       | Tech Stack                          |
|------------|-------------------------------------|
| Frontend   | HTML5, CSS3, JavaScript             |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB                             |
| Others     | npm (Node Package Manager)          |

## ⚙️ Installation

# Install all dependencies
```bash
npm install
```

# Start the server
```bash
node server.js
```
> For testing alternate routes, you may use:
```bash
node server2.js
```

## 🧪 Running the Project

- Ensure MongoDB is installed and running locally.  
- Modify the connection string in `server.js` if you're using a remote MongoDB cluster.
- Once the server is running, open your browser and go to:
```
http://localhost:5001
```

## 🗂️ Folder Structure

```
pro/
├── about.html
├── catering.html
├── co.html
├── cont.html
├── gallery.html
├── ho.html
├── log.html
├── music.html
├── nav.html
├── package-lock.json
├── package.json
├── photo.html
├── register.html
├── script.js
├── server.js
├── server2.js
├── service.html
├── slo.html
├── slot.html
└── video.html
```

## 🛡️ Security Notes

- Ensure you do **not** expose your MongoDB credentials in public repositories.
- Consider implementing password hashing (e.g., with `bcrypt`) in the future.

## 🚀 Future Enhancements

- Admin dashboard to manage bookings
- Payment gateway integration
- Email confirmations after booking
- Responsive UI with modern design frameworks (like Bootstrap or Tailwind CSS)
- API-based dynamic content loading
