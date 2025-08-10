import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Auth from './pages/Auth';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import Categories from './pages/Categories';
import Favorites from './pages/Favorites';
import MyRecipes from './pages/MyRecipes';
import Profile from './pages/Profile';
import EditRecipe from './pages/EditRecipe';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/recipes" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
          <Route path="/add-recipe" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/my-recipes" element={<ProtectedRoute><MyRecipes /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit-recipe/:id" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
        </Routes>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#f2750a',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;