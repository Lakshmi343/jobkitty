// import React, { useEffect, useState } from 'react';
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
// import { Button } from './ui/button';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setSearchedQuery } from '@/redux/jobSlice';
// import axios from 'axios';

// const CategoryCarousel = () => {
//     const [categories, setCategories] = useState([]);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get('http://localhost:8000/api/v1/category/get/');
//             if (response.data.success) {
//                 setCategories(response.data.categories);
//             }
//         } catch (error) {
//             console.error("Error fetching categories:", error);
//         }
//     };

//     const searchJobHandler = (query) => {
//         dispatch(setSearchedQuery(query));
//         navigate("/browse");
//     };

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     return (
//         <div className="w-full">
//             <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">Browse by Category</h2>
//             <Carousel className="w-full max-w-4xl mx-auto">
//                 <CarouselContent className="py-4">
//                     {categories.map((cat) => (
//                         <CarouselItem key={cat._id} className="md:basis-1/2 lg:basis-1/3">
//                             <div className="p-2">
//                                 <div className="bg-gradient-to-br from-[#232526] via-[#6a11cb] via-40% via-[#2575fc] via-70% via-[#ff512f] to-[#dd2476] rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg min-h-[120px]">
//                                     {/* Placeholder for icon/image */}
//                                     {/* <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 mb-2" /> */}
//                                     <Button
//                                         onClick={() => searchJobHandler(cat.name)}
//                                         variant="ghost"
//                                         className="w-full text-lg font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg py-3 flex justify-center"
//                                     >
//                                         <span className="mx-auto">{cat.name}</span>
//                                     </Button>
//                                     <Button
//                                         variant="outline"
//                                         className="mt-4 w-24 mx-auto flex justify-center"
//                                         onClick={() => searchJobHandler(cat.name)}
//                                     >
//                                         More
//                                     </Button>
//                                 </div>
//                             </div>
//                         </CarouselItem>
//                     ))}
//                 </CarouselContent>
//                 <div className="flex justify-center gap-4 mt-6">
//                     <CarouselPrevious className="static translate-y-0 hover:bg-blue-50 text-blue-600" />
//                     <CarouselNext className="static translate-y-0 hover:bg-blue-50 text-blue-600" />
//                 </div>
//             </Carousel>
//         </div>
//     );
// };

// export default CategoryCarousel;


import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import axios from 'axios';

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

    return (
        <div className="w-full py-8">
            <p className="text-center text-xs text-red-500 mb-2">FEATURED TOURS PACKAGES</p>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Browse Top Categories</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
                {categories.map((cat) => (
                    <div 
                        key={cat._id} 
                        className="bg-white rounded-md border border-blue-100 p-6 text-center shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => searchJobHandler(cat.name)}
                    >
                        <div className="w-14 h-14 mx-auto mb-4">
                            
                            <img 
                                src={cat.iconUrl || '/default-icon.png'} 
                                alt={cat.name} 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h3 className="text-sm font-medium text-gray-700">{cat.name}</h3>
                        <p className="text-red-500 text-sm mt-1">({cat.jobCount || '0'})</p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-8">
                <Button
                    onClick={() => navigate('/all-categories')}
                    variant="outline"
                    className="text-blue-700 border-blue-700 hover:bg-blue-50"
                >
                    Browse All Sectors
                </Button>
            </div>
        </div>
    );
};

export default CategoryCarousel;
