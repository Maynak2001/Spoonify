import React from 'react';
import { User, Code, Coffee, Heart } from 'lucide-react';

const AboutMe: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 shadow-lg">
            <img src="/me.jpg" alt="Maynak Sannigrahi" className="w-full h-full object-cover object-top" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">About the Developer</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Hi, I'm Maynak Sannigrahi, the creator of Spoonify!</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Story</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Welcome to Spoonify! I'm Maynak Sannigrahi, a passionate developer who loves to eat but doesn't know how to cook! 
            This platform was born from my struggle to find simple, easy-to-follow recipes that even a beginner like me could attempt.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            I don't know how to cook, but I love to eat! So I created Spoonify to help people like me discover amazing recipes 
            and learn from experienced home cooks. It's a place where cooking novices can find inspiration and experts can share their knowledge.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Spoonify is my way of bringing the cooking community together, making it easier for everyone to find inspiration 
            for their next delicious meal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
            <Code className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Tech Stack</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">React, TypeScript, Tailwind CSS, Supabase</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
            <Coffee className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Passion</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Building user-friendly applications that solve real problems</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
            <Heart className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Mission</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Connecting people through the love of food and cooking</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Let's Connect</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            I'd love to hear your feedback, suggestions, or just chat about food and technology!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:maynak@spoonify.com" 
              className="btn-primary inline-flex items-center justify-center"
            >
              Get in Touch
            </a>
            <a 
              href="/contact" 
              className="btn-secondary inline-flex items-center justify-center"
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;