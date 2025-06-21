import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CATEGORY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Palette, Code2, BarChart2, Smartphone, HardHat, Cpu, Home, PenTool, Briefcase,
  Heart, GraduationCap, Building2, ShoppingCart, Hotel, Factory, Leaf, Truck,
  Users, Tv, Coffee, Scissors, Car, Shirt, Fish, Scale, Stethoscope, BookOpen
} from 'lucide-react';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Kerala-specific job categories with icons
  const keralaCategories = [
    { name: 'Healthcare & Medical', icon: <Heart className="w-6 h-6 text-red-500" />, count: 245 },
    { name: 'Education & Teaching', icon: <GraduationCap className="w-6 h-6 text-blue-500" />, count: 189 },
    { name: 'Banking & Finance', icon: <Building2 className="w-6 h-6 text-green-500" />, count: 156 },
    { name: 'Retail & Sales', icon: <ShoppingCart className="w-6 h-6 text-orange-500" />, count: 234 },
    { name: 'Hospitality & Tourism', icon: <Hotel className="w-6 h-6 text-purple-500" />, count: 178 },
    { name: 'Manufacturing', icon: <Factory className="w-6 h-6 text-gray-600" />, count: 123 },
    { name: 'Agriculture & Farming', icon: <Leaf className="w-6 h-6 text-green-600" />, count: 89 },
    { name: 'Construction & Real Estate', icon: <HardHat className="w-6 h-6 text-yellow-600" />, count: 167 },
    { name: 'Transportation & Logistics', icon: <Truck className="w-6 h-6 text-blue-600" />, count: 134 },
    { name: 'Government & Public Sector', icon: <Users className="w-6 h-6 text-indigo-600" />, count: 98 },
    { name: 'Media & Entertainment', icon: <Tv className="w-6 h-6 text-pink-500" />, count: 67 },
    { name: 'Food & Beverage', icon: <Coffee className="w-6 h-6 text-brown-500" />, count: 145 },
    { name: 'Beauty & Wellness', icon: <Scissors className="w-6 h-6 text-pink-400" />, count: 78 },
    { name: 'Automotive', icon: <Car className="w-6 h-6 text-gray-700" />, count: 92 },
    { name: 'Textiles & Garments', icon: <Shirt className="w-6 h-6 text-purple-400" />, count: 112 },
    { name: 'Fishing & Marine', icon: <Fish className="w-6 h-6 text-blue-400" />, count: 45 },
    { name: 'IT & Software', icon: <Cpu className="w-6 h-6 text-cyan-500" />, count: 203 },
    { name: 'Engineering', icon: <Code2 className="w-6 h-6 text-indigo-500" />, count: 167 },
    { name: 'Legal Services', icon: <Scale className="w-6 h-6 text-gray-800" />, count: 34 },
    { name: 'Nursing & Care', icon: <Stethoscope className="w-6 h-6 text-red-400" />, count: 156 }
  ];

  const categoryIcons = {
    'design': <Palette className="w-6 h-6 text-teal-400" />,
    'development': <Code2 className="w-6 h-6 text-cyan-400" />,
    'sales': <BarChart2 className="w-6 h-6 text-blue-400" />,
    'mobile': <Smartphone className="w-6 h-6 text-teal-400" />,
    'construction': <HardHat className="w-6 h-6 text-cyan-400" />,
    'technology': <Cpu className="w-6 h-6 text-blue-400" />,
    'real estate': <Home className="w-6 h-6 text-teal-400" />,
    'writing': <PenTool className="w-6 h-6 text-cyan-400" />,
    'default': <Briefcase className="w-6 h-6 text-blue-400" />,
    "Marketing": <Home className='w-6 h-6 text-teal-400' />
  };

  const getCategoryIcon = (categoryName) => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('design')) return categoryIcons.design;
    if (lowerName.includes('develop')) return categoryIcons.development;
    if (lowerName.includes('sales')) return categoryIcons.sales;
    if (lowerName.includes('mobile')) return categoryIcons.mobile;
    if (lowerName.includes('construct')) return categoryIcons.construction;
    if (lowerName.includes('tech') || lowerName.includes('it')) return categoryIcons.technology;
    if (lowerName.includes('real estate') || lowerName.includes('property')) return categoryIcons['real estate'];
    if (lowerName.includes('write') || lowerName.includes('content')) return categoryIcons.writing;
    return categoryIcons.default;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${CATEGORY_API_END_POINT}/get`);
        if (response.data.success) {
          // Use Kerala-specific categories instead of fetched ones
          setCategories(keralaCategories);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch categories");
        // Fallback to Kerala categories even if API fails
        setCategories(keralaCategories);
        toast.error("Using local categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Popular Job Categories in Kerala
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover opportunities across various sectors in God's Own Country
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500">{error}</div>
          ) : (
            <>
              {categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/browse?category=${category.name}`)}
                  className="group cursor-pointer p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-gradient-to-r from-teal-400/20 to-cyan-400/20 group-hover:from-teal-400/30 group-hover:to-cyan-400/30 mb-4 transition-all duration-300">
                      {category.icon}
                    </div>
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text mb-2">
                      {category.name.toUpperCase()}
                    </h2>
                    <p className="text-gray-300 text-sm">{category.count} Jobs Available</p>
                  </div>
                </div>
              ))}
              <div
                onClick={() => navigate('/browse')}
                className="group cursor-pointer p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-teal-400/20 to-cyan-400/20 group-hover:from-teal-400/30 group-hover:to-cyan-400/30 mb-4 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text mb-2">
                    BROWSE ALL SECTORS
                  </h2>
                  <p className="text-gray-300 text-sm">Explore all job categories</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;