import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import ScrollToTop from './components/ScrollToTop';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Auth from './pages/Auth';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import About from './pages/About';
import Contact from './pages/Contact';
import AboutMe from './pages/AboutMe';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Favorites from './pages/Favorites';
import MyRecipes from './pages/MyRecipes';
import Profile from './pages/Profile';
import EditRecipe from './pages/EditRecipe';
import Chefs from './pages/Chefs';
import ChefProfile from './pages/ChefProfile';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  // Detect if the page was reloaded (hard reload like F5)
  const isHardReload = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type === "reload";

  const [showSplash, setShowSplash] = useState(() => {
    // Show splash if it's not a hard reload
    return !isHardReload;
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <div className="App bg-white dark:bg-gray-900 min-h-screen transition-colors">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/recipes" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
          <Route path="/add-recipe" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
          <Route path="/chefs" element={<Chefs />} />
          <Route path="/chef/:id" element={<ChefProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
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
    </ThemeProvider>
  );
}

export default App;