# Spoonify Backend

Express + MongoDB backend for Spoonify Recipe Platform

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create `.env` file:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_ENV=development
```

### 3. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (512MB)
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all)
5. Get connection string

### 4. Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Get credentials from dashboard

### 5. Run Server
```bash
npm run dev
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (protected)

### Recipes
- GET `/api/recipes` - Get all recipes (with filters)
- GET `/api/recipes/:id` - Get single recipe
- POST `/api/recipes` - Create recipe (protected)
- PUT `/api/recipes/:id` - Update recipe (protected)
- DELETE `/api/recipes/:id` - Delete recipe (protected)

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category (protected)

### Ratings
- POST `/api/ratings` - Add/update rating (protected)
- GET `/api/ratings/:recipeId` - Get recipe ratings

### Favorites
- GET `/api/favorites` - Get user favorites (protected)
- POST `/api/favorites` - Add to favorites (protected)
- DELETE `/api/favorites/:recipeId` - Remove from favorites (protected)

### Comments
- POST `/api/comments` - Add comment (protected)
- GET `/api/comments/:recipeId` - Get recipe comments
- DELETE `/api/comments/:id` - Delete comment (protected)

## Deploy to Render

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Create new Web Service
4. Connect GitHub repo
5. Add environment variables
6. Deploy

Your backend will be live at: `https://your-app.onrender.com`
