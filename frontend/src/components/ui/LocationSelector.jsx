import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './select';
import { Label } from './label';
import { getStates, getDistricts, formatLocation, parseLocation } from '../../utils/locationData';

const LocationSelector = ({ 
  value = '', 
  onChange, 
  required = false, 
  className = '',
  label = 'Location',
  placeholder = 'Select location'
}) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [availableDistricts, setAvailableDistricts] = useState([]);

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      const { state, district } = parseLocation(value);
      setSelectedState(state);
      setSelectedDistrict(district);
      if (state) {
        setAvailableDistricts(getDistricts(state));
      }
    }
  }, [value]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedDistrict(''); // Reset district when state changes
    const districts = getDistricts(state);
    setAvailableDistricts(districts);
    
    // If there's only one district or no districts, auto-select or notify parent
    if (districts.length === 0) {
      onChange(state); // Just state
    } else {
      onChange(''); // Reset value until district is selected
    }
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    const formattedLocation = formatLocation(selectedState, district);
    onChange(formattedLocation);
  };

  const states = getStates();

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State Selection */}
        <div>
          <Label className="text-xs text-gray-500 mb-1">State</Label>
          <Select
            value={selectedState}
            onValueChange={handleStateChange}
            required={required}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* District Selection */}
        <div>
          <Label className="text-xs text-gray-500 mb-1">District</Label>
          <Select
            value={selectedDistrict}
            onValueChange={handleDistrictChange}
            disabled={!selectedState || availableDistricts.length === 0}
            required={required && selectedState}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  !selectedState 
                    ? "Select state first" 
                    : availableDistricts.length === 0 
                      ? "No districts available"
                      : "Select district"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableDistricts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Display selected location */}
      {selectedState && selectedDistrict && (
        <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded border">
          <span className="font-medium">Selected:</span> {formatLocation(selectedState, selectedDistrict)}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
