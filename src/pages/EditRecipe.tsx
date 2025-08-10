import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, X, Upload, Loader } from 'lucide-react';
import { supabase, uploadImage } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    cooking_time: 30,
    ingredients: [''],
    steps: [''],
    image_url: '',
    nutritional_info: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  });

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user && id) {
      fetchRecipe();
    } else if (user === null) {
      setPageLoading(false);
    }
  }, [user, id]);

  const fetchRecipe = async () => {
    if (!id || !user) return;

    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data.user_id !== user.id) {
        toast.error('You can only edit your own recipes');
        navigate('/my-recipes');
        return;
      }

      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        cooking_time: data.cooking_time,
        ingredients: data.ingredients,
        steps: data.steps,
        image_url: data.image_url || '',
        nutritional_info: data.nutritional_info || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        }
      });

      if (data.image_url) {
        setImagePreview(data.image_url);
      }
    } catch (error) {
      toast.error('Error loading recipe');
      navigate('/my-recipes');
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNutritionChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      nutritional_info: { ...prev.nutritional_info, [field]: value }
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const updateStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setLoading(true);
    try {
      const validIngredients = formData.ingredients.filter(ing => ing.trim());
      const validSteps = formData.steps.filter(step => step.trim());

      if (!formData.title.trim()) {
        toast.error('Please enter a recipe title');
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Please enter a recipe description');
        return;
      }
      if (!formData.category) {
        toast.error('Please select a category');
        return;
      }
      if (validIngredients.length === 0) {
        toast.error('Please add at least one ingredient');
        return;
      }
      if (validSteps.length === 0) {
        toast.error('Please add at least one instruction step');
        return;
      }

      let imageUrl = formData.image_url;
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast.error('Error uploading image. Recipe will be updated without new image.');
        }
      }

      const { error } = await supabase
        .from('recipes')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          difficulty: formData.difficulty,
          cooking_time: formData.cooking_time,
          ingredients: validIngredients,
          steps: validSteps,
          image_url: imageUrl,
          nutritional_info: formData.nutritional_info,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Recipe updated successfully!');
      navigate(`/recipe/${id}`);
    } catch (error: any) {
      console.error('Error updating recipe:', error);
      toast.error(error.message || 'Error updating recipe');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
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
          <p className="text-gray-600 mb-4">You need to be logged in to edit recipes.</p>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Recipe</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="input-field"
                  placeholder="Enter recipe title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Describe your recipe"
                required
              />
            </div>

            {/* Recipe Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="input-field"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooking Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.cooking_time}
                  onChange={(e) => handleInputChange('cooking_time', parseInt(e.target.value))}
                  className="input-field"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload a photo of your dish</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="btn-secondary cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ingredients *
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Ingredient</span>
                </button>
              </div>
              <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      className="flex-1 input-field"
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Instructions *
                </label>
                <button
                  type="button"
                  onClick={addStep}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Step</span>
                </button>
              </div>
              <div className="space-y-3">
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex space-x-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-medium mt-1">
                      {index + 1}
                    </span>
                    <textarea
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      className="flex-1 input-field resize-none"
                      rows={2}
                      placeholder={`Step ${index + 1} instructions`}
                    />
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nutritional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Nutritional Information (per serving)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Calories</label>
                  <input
                    type="number"
                    value={formData.nutritional_info.calories}
                    onChange={(e) => handleNutritionChange('calories', parseInt(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={formData.nutritional_info.protein}
                    onChange={(e) => handleNutritionChange('protein', parseInt(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={formData.nutritional_info.carbs}
                    onChange={(e) => handleNutritionChange('carbs', parseInt(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={formData.nutritional_info.fat}
                    onChange={(e) => handleNutritionChange('fat', parseInt(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/my-recipes')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {loading && <Loader className="h-4 w-4 animate-spin" />}
                <span>{loading ? 'Updating...' : 'Update Recipe'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;