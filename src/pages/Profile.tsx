import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, ChefHat, Heart, Star, AtSign, X } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { useUsername } from '../hooks/useUsername';
import toast from 'react-hot-toast';

interface UserStats {
  totalRecipes: number;
  totalFavorites: number;
  averageRating: number;
}

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({ totalRecipes: 0, totalFavorites: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { checkUsernameAvailable, isChecking } = useUsername();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setProfile(data);
      setFullName(data?.full_name || '');
      setUsername(data?.username || '');
      setImagePreview(data?.avatar_url || user?.user_metadata?.avatar_url || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Get total recipes
      const { count: recipeCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get total favorites
      const { count: favoriteCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get average rating for user's recipes
      const { data: ratings } = await supabase
        .from('ratings')
        .select('rating, recipes!inner(user_id)')
        .eq('recipes.user_id', user.id);

      const avgRating = ratings && ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      setStats({
        totalRecipes: recipeCount || 0,
        totalFavorites: favoriteCount || 0,
        averageRating: avgRating
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUsernameChange = async (newUsername: string) => {
    setUsername(newUsername);
    if (newUsername.trim() && newUsername !== profile?.username) {
      const available = await checkUsernameAvailable(newUsername);
      setUsernameAvailable(available);
    } else {
      setUsernameAvailable(null);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file && user) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result as string);
        
        // Auto upload image
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(fileName, file);
          
          if (!uploadError) {
            const { data } = supabase.storage
              .from('profile-images')
              .getPublicUrl(fileName);
            
            const { error } = await supabase
              .from('user_profiles')
              .upsert({
                id: user.id,
                email: user.email,
                full_name: profile?.full_name || user?.user_metadata?.full_name || '',
                username: profile?.username || null,
                avatar_url: data.publicUrl
              });
            
            if (!error) {
              setProfile({ ...profile, avatar_url: data.publicUrl });
              toast.success('Profile image updated!');
            } else {
              toast.error('Error saving to database');
            }
          } else {
            toast.error('Error uploading image');
          }
        } catch (error) {
          toast.error('Error uploading image');
        }
        setImageFile(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteImage = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);
      
      if (!error) {
        setProfile({ ...profile, avatar_url: null });
        setImagePreview('');
        toast.success('Profile image removed!');
      }
    } catch (error) {
      toast.error('Error removing image');
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    if (username && !usernameAvailable) {
      toast.error('Username not available');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: fullName.trim(),
          username: username.trim() || null,
          avatar_url: profile?.avatar_url
        });

      if (error) throw error;

      setProfile({ 
        ...profile, 
        full_name: fullName.trim(),
        username: username.trim()
      });
      setEditing(false);
      setUsernameAvailable(null);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please Sign In</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">You need to be logged in to view your profile.</p>
          <button
            onClick={() => navigate('/auth')}
            className="btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Image */}
              <div className="relative group flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-white/30">
                  {imagePreview || profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                    <img 
                      src={imagePreview || profile?.avatar_url || user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-indigo-500" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <User className="h-8 w-8 text-white" />
                </div>
                {(profile?.avatar_url || imagePreview) && (
                  <button
                    onClick={deleteImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-lg"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Profile Info */}
              <div className="text-white text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {profile?.full_name || user?.user_metadata?.full_name || 'Anonymous User'}
                </h1>
                <p className="text-white/90 text-lg mb-2">{user?.email}</p>
                {profile?.username && (
                  <p className="text-white/80 text-base mb-4">@{profile.username}</p>
                )}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Joined {new Date(user?.created_at || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Recipes Created</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRecipes}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Favorite Recipes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalFavorites}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-pink-400 to-red-400 rounded-xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Email */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</p>
                <p className="text-gray-900 dark:text-white font-semibold">{user?.email}</p>
              </div>
            </div>

            {/* Username */}
            {profile?.username && !editing && (
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <div className="p-3 bg-green-500 rounded-xl">
                  <AtSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Username</p>
                  <p className="text-gray-900 dark:text-white font-semibold">@{profile.username}</p>
                </div>
              </div>
            )}

            {/* Username Edit */}
            {editing && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <AtSign className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Username</p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                      usernameAvailable === false ? 'border-red-500' : 
                      usernameAvailable === true ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Choose a unique username"
                  />
                  {isChecking && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                    </div>
                  )}
                </div>
                {usernameAvailable === false && (
                  <p className="text-red-500 text-sm mt-2">Username not available</p>
                )}
                {usernameAvailable === true && (
                  <p className="text-green-500 text-sm mt-2">Username available!</p>
                )}
              </div>
            )}

            {/* Full Name */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</p>
              </div>
              {editing ? (
                <>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={updateProfile}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFullName(profile?.full_name || '');
                        setUsername(profile?.username || '');
                        setUsernameAvailable(null);
                        setImageFile(null);
                        setImagePreview(profile?.avatar_url || user?.user_metadata?.avatar_url || '');
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 dark:text-white font-semibold text-lg">
                    {profile?.full_name || user?.user_metadata?.full_name || 'No name set'}
                  </p>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-indigo-500 hover:text-indigo-600 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sign Out */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleSignOut}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;