import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click on 'Sign In' in the navigation bar and then select 'Sign Up'. You can register with your email or use Google sign-in for quick access."
    },
    {
      question: "How do I add a new recipe?",
      answer: "Once logged in, click the 'Add Recipe' button in the navigation bar. Fill in the recipe details including title, ingredients, instructions, and upload a photo."
    },
    {
      question: "Can I edit my recipes after publishing?",
      answer: "Yes! Go to 'My Recipes' from your profile menu, find the recipe you want to edit, and click the edit button."
    },
    {
      question: "How do I save recipes to favorites?",
      answer: "Click the heart icon on any recipe card to add it to your favorites. You can view all your saved recipes in the 'Favorites' section."
    },
    {
      question: "Is there a limit on how many recipes I can add?",
      answer: "Free users can add up to 5 recipes. For unlimited recipes and premium features, consider upgrading your account."
    },
    {
      question: "How do I rate and review recipes?",
      answer: "Open any recipe and scroll down to the rating section. You can give a star rating and leave a comment about your cooking experience."
    },
    {
      question: "Can I search for recipes by ingredients?",
      answer: "Yes! Use the search bar on the recipes page and enter ingredients, recipe names, or cooking methods to find what you're looking for."
    },
    {
      question: "How do I change my profile information?",
      answer: "Click on your profile icon in the navigation bar, select 'Profile', and you can edit your information there."
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="h-8 w-8 text-primary-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Find answers to common questions</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                {openFAQ === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try searching with different keywords</p>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-12 bg-primary-50 dark:bg-primary-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Still need help?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <a
            href="/contact"
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;