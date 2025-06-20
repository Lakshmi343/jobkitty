import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CATEGORY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Palette, Code2, BarChart2, Smartphone, HardHat, Cpu, Home, PenTool, Briefcase } from 'lucide-react';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
          const categoriesWithCounts = response.data.categories.map(category => ({
            ...category,
            jobCount: Math.floor(Math.random() * 700) + 100,
            icon: getCategoryIcon(category.name)
          }));
          setCategories(categoriesWithCounts);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch categories");
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {loading ? (
        <div className="col-span-full flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
        </div>
      ) : error ? (
        <div className="col-span-full text-center text-red-500">{error}</div>
      ) : (
        <>
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => navigate(`/browse?category=${category.name}`)}
              className="group cursor-pointer p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-teal-400/20 to-cyan-400/20 group-hover:from-teal-400/30 group-hover:to-cyan-400/30 mb-4 transition-all duration-300">
                  {categoryIcons[category.name.toLowerCase()] || categoryIcons.default}
                </div>
                <h2 className="text-lg font-semibold bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text mb-2">
                  {category.name.toUpperCase()}
                </h2>
                <p className="text-gray-300 text-sm">{category.jobCount} Jobs Available</p>
              </div>
            </div>
          ))}
          <div
            onClick={() => navigate('/browse')}
            className="group cursor-pointer p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl"
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
  );
};

export default CategoryList;