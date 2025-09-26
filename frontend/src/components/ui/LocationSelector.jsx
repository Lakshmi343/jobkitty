import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './select';
import { Label } from './label';
import { getStates, getDistricts } from '../../utils/locationData';
import { Input } from './input';

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
  useEffect(() => {
    if (value) {
      // Parse values like "District, State" or just "State". If more than 2 parts, take the last two as District, State
      const parts = String(value).split(',').map(s => s.trim()).filter(Boolean);
      let state = '';
      let district = '';
      if (parts.length >= 2) {
        state = parts[parts.length - 1];
        district = parts[parts.length - 2];
      } else if (parts.length === 1) {
        state = parts[0];
      }

      setSelectedState(state);
      setSelectedDistrict(district);
      if (state) {
        setAvailableDistricts(getDistricts(state));
      }
    } else {
      // reset
      setSelectedState('');
      setSelectedDistrict('');
      setAvailableDistricts([]);
    }
  }, [value]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedDistrict('');
    const districts = getDistricts(state);
    setAvailableDistricts(districts);
    // Emit state only for now; district/city can follow
    onChange(state || '');
  };

  const buildLegacy = (state, district) => {
    if (district && state) return `${district}, ${state}`;
    if (state) return state;
    return '';
  };

  const handleDistrictInput = (e) => {
    const dist = e.target.value;
    setSelectedDistrict(dist);
    onChange(buildLegacy(selectedState, dist));
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

        {/* District Typing Input */}
        <div>
          <Label className="text-xs text-gray-500 mb-1">District</Label>
          <Input
            list="district-options"
            placeholder={!selectedState ? 'Select state first' : 'Type or select district'}
            value={selectedDistrict}
            onChange={handleDistrictInput}
            disabled={!selectedState}
            required={!!(required && selectedState)}
          />
          <datalist id="district-options">
            {availableDistricts.map(d => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Display selected location */}
      {(selectedState || selectedDistrict) && (
        <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded border">
          <span className="font-medium">Selected:</span> {buildLegacy(selectedState, selectedDistrict)}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
