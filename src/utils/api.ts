import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data: { username: string; email: string; password: string; fullName?: string }) =>
  api.post('/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const getMe = () => api.get('/auth/me');

// Recipes
export const getRecipes = (params?: any) => api.get('/recipes', { params });

export const getRecipe = (id: string) => api.get(`/recipes/${id}`);

export const createRecipe = (formData: FormData) =>
  api.post('/recipes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const updateRecipe = (id: string, formData: FormData) =>
  api.put(`/recipes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const deleteRecipe = (id: string) => api.delete(`/recipes/${id}`);

// Categories
export const getCategories = () => api.get('/categories');

export const createCategory = (data: any) => api.post('/categories', data);

// Ratings
export const addRating = (data: { recipeId: string; rating: number; review?: string }) =>
  api.post('/ratings', data);

export const getRecipeRatings = (recipeId: string) => api.get(`/ratings/${recipeId}`);

// Favorites
export const getFavorites = () => api.get('/favorites');

export const addFavorite = (recipeId: string) => api.post('/favorites', { recipeId });

export const removeFavorite = (recipeId: string) => api.delete(`/favorites/${recipeId}`);

// Comments
export const addComment = (data: { recipeId: string; content: string }) =>
  api.post('/comments', data);

export const getComments = (recipeId: string) => api.get(`/comments/${recipeId}`);

export const deleteComment = (id: string) => api.delete(`/comments/${id}`);

// Image upload helper
export const uploadImage = async (file: File): Promise<string> => {
  const compressedFile = await compressImage(file, 600, 0.6);
  return URL.createObjectURL(compressedFile);
};

const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob!], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        resolve(compressedFile);
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Normalize backend recipe fields to frontend format
export const normalizeRecipe = (r: any) => ({
  id: r._id,
  title: r.title,
  description: r.description,
  image_url: r.imageUrl,
  cooking_time: (r.cookTime || 0) + (r.prepTime || 0),
  difficulty: r.difficulty
    ? r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)
    : 'Easy',
  category: r.categoryId?._id || r.categoryId || '',
  category_name: r.categoryId?.name || '',
  ingredients: r.ingredients || [],
  steps: r.instructions || [],
  user_id: r.userId?._id || r.userId || '',
  user_name: r.userId?.username || '',
  average_rating: r.averageRating || 0,
  total_ratings: r.ratingCount || 0,
  created_at: r.createdAt,
  nutritional_info: r.nutritionalInfo || null,
});

export default api;
