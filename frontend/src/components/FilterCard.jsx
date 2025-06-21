import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { MapPin, Building, DollarSign } from 'lucide-react'

const filterData = [
    {
        filterType: "Location",
        icon: MapPin,
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Kolkata"]
    },
    {
        filterType: "Industry",
        icon: Building,
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Mobile Developer", "DevOps Engineer", "Data Scientist"]
    },
    {
        filterType: "Salary",
        icon: DollarSign,
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh", "5lakh+"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();
    
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    
    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue, dispatch]);

    return (
        <div className='w-full bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100'>
            <h1 className='font-bold text-xl mb-4 text-gray-800'>Filter Jobs</h1>
            <hr className='mb-6 border-gray-200' />
            
            <RadioGroup value={selectedValue} onValueChange={changeHandler} className="space-y-6">
                {
                    filterData.map((data, index) => {
                        const IconComponent = data.icon;
                        return (
                            <div key={index} className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <IconComponent className="w-5 h-5 text-gray-600" />
                                    <h2 className='font-semibold text-lg text-gray-800'>{data.filterType}</h2>
                                </div>
                                <div className="space-y-2 pl-7">
                                    {
                                        data.array.map((item, idx) => {
                                            const itemId = `${data.filterType}-${idx}`
                                            return (
                                                <div key={itemId} className='flex items-center space-x-3 py-1'>
                                                    <RadioGroupItem 
                                                        value={item} 
                                                        id={itemId}
                                                        className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <Label 
                                                        htmlFor={itemId}
                                                        className="text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                                                    >
                                                        {item}
                                                    </Label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </RadioGroup>
            
            {/* Clear Filters Button */}
            {selectedValue && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => setSelectedValue('')}
                        className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    )
}

export default FilterCard