# 📝 Blog Backend

A powerful **Node.js + Express** backend for a blogging platform.  
This project supports **user & admin roles**, **authentication**, **CRUD operations**, and **file uploads** using **Multer + Cloudinary**.

---

## 🚀 Features

- 🔑 **Authentication & Authorization**
  - JWT-based login/register
  - Admin & User role-based access

- 📂 **File Upload**
  - Multer for handling files
  - Cloudinary for image storage

- 📝 **Blog Features**
  - Posts CRUD (Create, Read, Update, Delete)
  - Categories management
  - Comments system with user reference

- 🛡 **Middleware**
  - `authMiddleware.js` → JWT verification
  - `isAdmin.js` → Restrict routes for admin only
  - `upload.js` → Handle image uploads

---

## 📁 Project Structure

BLOGBACKEND/
│── config/ # DB & cloudinary configuration
│── controllers/ # All route controllers
│── middleware/ # Auth, Admin check, Upload handling
│ ├── authMiddleware.js
│ ├── isAdmin.js
│ ├── upload.js
│── models/ # MongoDB models
│ ├── Category.js
│ ├── Comment.js
│ ├── Post.js
│ ├── UserModel.js
│── routes/ # Express routes
│ ├── auth.route.js
│ ├── category.route.js
│ ├── comment.route.js
│ ├── post.route.js
│── utils/ # Helpers
│── server.js # Entry point
│── .env # Environment variables
│── package.json
│── README.md