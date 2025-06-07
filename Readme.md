# 📅 Gatherly

Gatherly is a powerful and intuitive event management web application that allows **admins to create events** and **users to join events** based on their interests. It simplifies event hosting and participation for all users with a clean interface and secure authentication.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based login and registration
- Role-based access control (Admin & User)

### 🛠️ Admin Functionalities
- Create, update, and delete events
- View registered users per event
- Manage event capacity and availability

### 👥 User Functionalities
- Browse and search upcoming events
- Register for events based on interest and availability
- View registered events

### 📦 Tech Stack

| Layer         | Technology           |
|---------------|----------------------|
| Frontend      | React.js             |
| Backend       | Node.js, Express.js  |
| Database      |MongoDB with Mongoose |
| Authentication| JWT, Cookies         |
| Others        | Bcrypt, Dotenv, CORS |

---

## 📁 Folder Structure (Backend)
```
Gatherly/
│
├── controllers/ # Route handlers (User & Event logic)
├── models/ # Mongoose schemas
├── routes/ # Express route definitions
├── middleware/ # Auth middleware for protected routes
├── database/ # DB connection files
├── .env # Environment variables
├── index.js # Entry point
└── package.json
```

```
📮 API Endpoints

🔑 Users

POST /api/users/register – User Registration

POST /api/user/login – User Login

POST /api/user/logout – Logout

PUT api/users/updateUser - User info update

PUT api/users/changePassword - Change password

🎟️ Events

POST /api/events/createEvent – Create Event (Admin)

PUT /api/events/updateEvent – Update Event (Admin)

DELETE /api/events/deleteEvent – Delete Event (Admin)
```

👨‍💻 Developed by
Akash Negi

MCA Student | MERN Stack Developer
• [LinkedIn](https://www.linkedin.com/in/11aakash-negi) • [Portfolio](http://akashnegi11.netlify.app/)

