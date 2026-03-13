# Migration Guide: Supabase → Express Backend

## Quick Setup (5 minutes)

### 1. Frontend Setup
```bash
# Root folder mein
npm install axios
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=random_secret_key_123
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
NODE_ENV=development
```

### 3. Start Backend
```bash
cd backend
npm run dev
```

### 4. Update Frontend Files

**Option A: Automatic (Recommended)**
Main automatically update kar dunga - bas bolo!

**Option B: Manual**
Replace these imports in all files:
```typescript
// OLD
import { supabase } from '../utils/supabase';

// NEW
import * as api from '../utils/api';
import { useAuth } from '../hooks/useAuthNew';
```

### 5. Start Frontend
```bash
npm start
```

## Free Services Setup

### MongoDB Atlas (FREE)
1. https://www.mongodb.com/cloud/atlas
2. Create account → Create cluster (FREE M0)
3. Database Access → Add user
4. Network Access → Add IP (0.0.0.0/0)
5. Connect → Get connection string
6. Paste in `backend/.env`

### Cloudinary (FREE)
1. https://cloudinary.com
2. Sign up
3. Dashboard → Copy credentials
4. Paste in `backend/.env`

### Render Deployment (FREE)
1. Push to GitHub
2. https://render.com → New Web Service
3. Connect repo → Select `backend` folder
4. Add environment variables
5. Deploy!

## API Changes

### Auth
```typescript
// OLD
await supabase.auth.signUp({ email, password })

// NEW
await api.register({ username, email, password })
```

### Recipes
```typescript
// OLD
const { data } = await supabase.from('recipes').select('*')

// NEW
const { data } = await api.getRecipes()
```

### Upload
```typescript
// OLD
await supabase.storage.from('recipe-images').upload(path, file)

// NEW
const formData = new FormData()
formData.append('image', file)
await api.createRecipe(formData)
```

## Need Help?
Agar koi problem ho to batao, main fix kar dunga! 🚀
