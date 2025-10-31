import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CATEGORY_API_END_POINT } from '../utils/constant';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
// Animation styles replaced with CSS transitions
import { Briefcase, Monitor, Stethoscope, Hammer, GraduationCap, Building2 } from "lucide-react";

const CategoryCarousel = () => {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const INITIAL_DISPLAY_COUNT = 8;

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${CATEGORY_API_END_POINT}/get/`);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  
  const categoryIcons = {
    "IT": <Monitor className="w-12 h-12 text-blue-600" />,
    "Healthcare": <Stethoscope className="w-12 h-12 text-green-600" />,
    "Construction": <Hammer className="w-12 h-12 text-yellow-600" />,
    "Education": <GraduationCap className="w-12 h-12 text-purple-600" />,
    "Business": <Building2 className="w-12 h-12 text-red-600" />,
    "Default": <Briefcase className="w-12 h-12 text-gray-500" />,
  };

  return (
    <div className="w-full py-12 bg-gradient-to-b from-gray-50 via-white to-gray-100">
    
      <div className="text-center text-xs font-semibold tracking-widest text-red-500 mb-2 uppercase transition-all duration-500 ease-in-out opacity-0 animate-fadeInUp">
        BROWSE BY CATEGORY
      </div>

    
      <h2 
        className="text-3xl font-bold text-center mb-12 text-gray-800 transition-all duration-500 ease-in-out opacity-0 animate-fadeInUp delay-300"
      >
        Browse Top Categories
      </h2>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
        {(showAll ? categories : categories.slice(0, INITIAL_DISPLAY_COUNT)).map((cat, i) => (
          <div
            key={cat._id}
            className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center hover:scale-105"
            onClick={() => searchJobHandler(cat.name)}
          >
           
            <div 
              className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-50 hover:rotate-10 hover:scale-110 transition-all duration-300"
            >
              {categoryIcons[cat.name] || categoryIcons["Default"]}
            </div>

            <h3 
              className="text-base font-semibold text-gray-700 tracking-wide hover:text-blue-700 transition-colors duration-300"
            >
              {cat.name}
            </h3>
          </div>
        ))}
      </div>

    
      {categories.length > INITIAL_DISPLAY_COUNT && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 font-medium"
          >
            {showAll ? 'Show Less' : `Show All (${categories.length})`}
          </button>
        </div>
      )}

    </div>
  );
};

export default CategoryCarousel;
