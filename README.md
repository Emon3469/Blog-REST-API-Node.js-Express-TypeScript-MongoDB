# Blog REST API

A comprehensive RESTful API for a blog platform built with Node.js, Express, TypeScript, and MongoDB. This API provides complete functionality for user authentication, blog management, comments, and likes.

<img width="825" height="773" alt="blog-pro" src="https://github.com/user-attachments/assets/2e7892d9-8257-421a-9276-10acfb9e40bf" />


## 🚀 Features

- **User Authentication & Authorization**
  - User registration and login
  - JWT-based authentication with refresh tokens
  - Role-based access control (Admin/User)
  - Secure password hashing with bcrypt

- **Blog Management**
  - Create, read, update, and delete blog posts
  - Blog banner image upload with Cloudinary integration
  - Slug-based blog retrieval
  - Draft and published status management
  - Admin-only blog creation and management

- **User Management**
  - User profile management
  - Admin user management capabilities
  - Social media links integration

- **Interactive Features**
  - Like/unlike blog posts
  - Comment system for blog posts
  - Comment management

- **Security & Performance**
  - Rate limiting
  - CORS protection
  - Helmet security headers
  - Request compression
  - Input validation and sanitization
  - Comprehensive logging with Winston

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Validation**: Express Validator + Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Development**: Nodemon, Prettier

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Cloudinary account (for image uploads)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Emon3469/REST-api.git
   cd REST-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database
   MONGO_URI=mongodb://localhost:27017/blog-api

   # JWT Secrets
   JWT_ACCESS_SECRET=your_access_token_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Logging
   LOG_LEVEL=info
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000/api/v1/`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | User login | Public |
| POST | `/auth/logout` | User logout | Authenticated |
| POST | `/auth/refresh-token` | Refresh access token | Public |

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users/current` | Get current user profile | Authenticated |
| PUT | `/users/current` | Update current user profile | Authenticated |
| DELETE | `/users/current` | Delete current user account | Authenticated |
| GET | `/users` | Get all users (paginated) | Admin |
| GET | `/users/:userId` | Get specific user | Admin |
| DELETE | `/users/:userId` | Delete specific user | Admin |

### Blog Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/blogs` | Create a new blog post | Admin |
| GET | `/blogs` | Get all blog posts (paginated) | Admin |
| GET | `/blogs/user/:userId` | Get blogs by specific user | Admin |
| GET | `/blogs/:slug` | Get blog by slug | Authenticated |
| PUT | `/blogs/:blogId` | Update blog post | Admin |
| DELETE | `/blogs/:blogId` | Delete blog post | Admin |

### Like Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/likes/blog/:blogId` | Like a blog post | Authenticated |
| DELETE | `/likes/blog/:blogId` | Unlike a blog post | Authenticated |

### Comment Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/comments/blog/:blogId` | Add comment to blog | Authenticated |
| GET | `/comments/blog/:blogId` | Get comments for blog | Authenticated |
| DELETE | `/comments/blog/:blogId` | Delete comment | Authenticated |

## 🔧 Project Structure

```
src/
├── @types/           # TypeScript type definitions
├── config/           # Configuration files
├── controllers/      # Route controllers
│   └── v1/          # Version 1 controllers
├── lib/             # Utility libraries
├── middlewares/     # Express middlewares
├── models/          # Mongoose models
├── routes/          # API routes
│   └── v1/         # Version 1 routes
├── utils/           # Utility functions
└── server.ts        # Main server file
```

## 🚦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start development server (same as dev)
- `npm test` - Run tests (not implemented yet)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Sets various HTTP headers for security
- **Input Validation**: Comprehensive request validation
- **Password Hashing**: Secure password storage with bcrypt

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 3000) |
| `NODE_ENV` | Environment mode | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_ACCESS_SECRET` | JWT access token secret | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Yes |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration time | Yes |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration time | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `LOG_LEVEL` | Logging level | No (default: info) |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Emon** - [GitHub Profile](https://github.com/Emon3469)

## 🔗 Links

- [Repository](https://github.com/Emon3469/REST-api)
- [API Documentation](http://docs.blog-api.codewithsadee.com)

---

For any questions or issues, please open an issue on GitHub or contact the maintainer.
