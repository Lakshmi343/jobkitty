import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
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
        <div className="w-full">
            <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent className="py-4">
                    {categories.map((cat) => (
                        <CarouselItem key={cat._id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-2">
                                <Button
                                    onClick={() => searchJobHandler(cat.name)}
                                    variant="ghost"
                                    className="w-full text-lg font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                >
                                    {cat.name}
                                </Button>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="flex justify-center gap-4 mt-6">
                    <CarouselPrevious className="static translate-y-0 hover:bg-purple-50 text-purple-600" />
                    <CarouselNext className="static translate-y-0 hover:bg-purple-50 text-purple-600" />
                </div>
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
