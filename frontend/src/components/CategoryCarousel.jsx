import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import axios from 'axios';
import { motion } from "framer-motion";
import { Briefcase, Monitor, Stethoscope, Hammer, GraduationCap, Building2 } from "lucide-react";

const CategoryCarousel = () => {
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/category/get/');
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

  // Map category name → Icon
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
      {/* Subtitle */}
      <motion.p 
        className="text-center text-xs font-semibold tracking-widest text-red-500 mb-2 uppercase"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        FEATURED TOURS PACKAGES
      </motion.p>

      {/* Title */}
      <motion.h2 
        className="text-3xl font-bold text-center mb-12 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Browse Top Categories
      </motion.h2>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat._id}
            className="bg-white rounded-xl border border-blue-100 p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            onClick={() => searchJobHandler(cat.name)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Icon with hover animation */}
            <motion.div 
              className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-50"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {categoryIcons[cat.name] || categoryIcons["Default"]}
            </motion.div>

            {/* Category Name */}
            <motion.h3 
              className="text-base font-semibold text-gray-700 tracking-wide"
              whileHover={{ color: "#1d4ed8" }}
            >
              {cat.name}
            </motion.h3>
          </motion.div>
        ))}
      </div>

      {/* Browse All Button */}

    </div>
  );
};

export default CategoryCarousel;
