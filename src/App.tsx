import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './hooks/useAuth';
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
import Help from './pages/Help';
import Favorites from './pages/Favorites';
import MyRecipes from './pages/MyRecipes';
import Profile from './pages/Profile';
import EditRecipe from './pages/EditRecipe';
import Chefs from './pages/Chefs';
import ChefProfile from './pages/ChefProfile';
import Categories from './pages/Categories';
import MealPlanner from './pages/MealPlanner';
import ShoppingList from './pages/ShoppingList';
import ActivityFeed from './pages/ActivityFeed';
import ProtectedRoute from './components/ProtectedRoute';
import { ShoppingListProvider } from './contexts/ShoppingListContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './index.css';

function App() {
  const isHardReload = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type === "reload";
  const [showSplash, setShowSplash] = useState(() => !isHardReload);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ShoppingListProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <AppLayout />
        </Router>
          </ShoppingListProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAuth = location.pathname === '/auth';

  return (
    <div className="App bg-[#0a0a0a] min-h-screen">
      {!isAuth && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
              <Route path="/recipes" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
              <Route path="/add-recipe" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
              <Route path="/chefs" element={<Chefs />} />
              <Route path="/chef/:id" element={<ChefProfile />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/meal-planner" element={<ProtectedRoute><MealPlanner /></ProtectedRoute>} />
              <Route path="/shopping-list" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
              <Route path="/activity-feed" element={<ProtectedRoute><ActivityFeed /></ProtectedRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about-me" element={<AboutMe />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/help" element={<Help />} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/my-recipes" element={<ProtectedRoute><MyRecipes /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/edit-recipe/:id" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
      </Routes>
      {!isAuth && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: {
            duration: 3000,
            iconTheme: { primary: '#f2750a', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
}

export default App;
