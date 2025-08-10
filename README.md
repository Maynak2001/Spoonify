# Spoonify - Recipe Sharing Platform

A modern, full-stack recipe sharing platform built with React, TypeScript, Tailwind CSS, and Supabase. Share, discover, and save your favorite recipes with a beautiful, mobile-friendly interface.

## 🚀 Features

- **Recipe Management**: Create, edit, and share recipes with detailed ingredients and step-by-step instructions
- **User Authentication**: Secure login with email/password and Google OAuth via Supabase Auth
- **Image Upload**: Upload recipe photos using Supabase Storage
- **Search & Filter**: Advanced filtering by category, difficulty, cooking time, and ingredients
- **Ratings & Reviews**: Rate recipes and leave comments
- **Favorites**: Save recipes to your personal favorites list
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Meta tags and structured data for better search visibility

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/spoonify.git
   cd spoonify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 🗄️ Supabase Setup

### 1. Create a New Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

### 2. Set Up the Database

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-setup.sql`
3. Run the SQL script to create all tables, policies, and functions

### 3. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable Email authentication
3. For Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### 4. Set Up Storage

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `recipe-images`
3. Set the bucket to public
4. Configure the following bucket policy:

```sql
CREATE POLICY "Anyone can view recipe images" ON storage.objects
FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload recipe images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own recipe images" ON storage.objects
FOR UPDATE USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own recipe images" ON storage.objects
FOR DELETE USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 5. Add Sample Data

1. Go to the SQL Editor
2. Use the sample recipes from `sample-recipes.json` to populate your database
3. You can insert them manually or create a script to import them

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Backend (Supabase)

Your Supabase backend is already hosted and managed by Supabase. No additional deployment needed.

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Mobile phones (320px and up)
- Tablets (768px and up)
- Desktop (1024px and up)

## 🔒 Security Features

- Row Level Security (RLS) policies for all database tables
- Secure image upload with file type validation
- Authentication required for sensitive operations
- Input sanitization and validation

## 🎨 Design System

The application uses a consistent design system with:
- Primary color: Orange (#f2750a)
- Typography: Inter font family
- Consistent spacing and component patterns
- Accessible color contrasts

## 📊 Database Schema

### Tables

- `user_profiles`: User information and preferences
- `categories`: Recipe categories
- `recipes`: Recipe data with ingredients and instructions
- `ratings`: User ratings and reviews
- `favorites`: User's saved recipes
- `comments`: Recipe comments and discussions

### Key Features

- UUID primary keys for security
- Proper foreign key relationships
- Indexes for optimal query performance
- Row Level Security for data protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend-as-a-service
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Lucide](https://lucide.dev) for the beautiful icons
- [Vercel](https://vercel.com) for seamless deployment

## 📞 Support

If you have any questions or need help setting up the project, please open an issue or contact the maintainers.

---

**Happy Cooking! 👨‍🍳👩‍🍳**