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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your profile.</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    {imagePreview || profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                      <img 
                        src={imagePreview || profile?.avatar_url || user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-primary-500" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <User className="h-6 w-6 text-white" />
                  </div>
                  {(profile?.avatar_url || imagePreview) && (
                    <button
                      onClick={deleteImage}
                      className="absolute -bottom-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">
                    {profile?.full_name || user?.user_metadata?.full_name || 'Anonymous User'}
                  </h1>
                  <p className="text-primary-100">{user?.email}</p>
                  {profile?.username && (
                    <p className="text-primary-200 text-sm">@{profile.username}</p>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            <div className="px-6 py-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <ChefHat className="h-6 w-6 text-primary-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalRecipes}</div>
              <div className="text-sm text-gray-600">Recipes</div>
            </div>
            <div className="px-6 py-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalFavorites}</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </div>
            <div className="px-6 py-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{user?.email}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">
                  Joined {new Date(user?.created_at || '').toLocaleDateString()}
                </span>
              </div>
              
              {profile?.username && !editing && (
                <div className="flex items-center space-x-3">
                  <AtSign className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">@{profile.username}</span>
                </div>
              )}
              
              {editing && (
                <div className="flex items-center space-x-3">
                  <AtSign className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          usernameAvailable === false ? 'border-red-500' : 
                          usernameAvailable === true ? 'border-green-500' : 'border-gray-300'
                        }`}
                        placeholder="Choose a unique username"
                      />
                      {isChecking && (
                        <div className="absolute right-3 top-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                        </div>
                      )}
                    </div>
                    {usernameAvailable === false && (
                      <p className="text-red-500 text-sm mt-1">Username not available</p>
                    )}
                    {usernameAvailable === true && (
                      <p className="text-green-500 text-sm mt-1">Username available!</p>
                    )}
                  </div>
                </div>
              )}


              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                {editing ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                    <button
                      onClick={updateProfile}
                      className="btn-primary"
                    >
                      Save
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
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-gray-700">
                      {profile?.full_name || user?.user_metadata?.full_name || 'No name set'}
                    </span>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-primary-500 hover:text-primary-600 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;