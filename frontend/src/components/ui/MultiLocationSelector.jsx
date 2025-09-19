import React, { useEffect, useMemo, useState } from 'react';
import { Label } from './label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './select';
import { getStates, getDistricts } from '../../utils/locationData';
import { Checkbox } from './checkbox';

const MultiLocationSelector = ({
  label = 'Locations',
  required = false,
  value = { state: '', districts: [] },
  onChange,
  className = ''
}) => {
  const [stateVal, setStateVal] = useState(value?.state || '');
  const [districtVals, setDistrictVals] = useState(Array.isArray(value?.districts) ? value.districts : []);

  useEffect(() => {
    setStateVal(value?.state || '');
    setDistrictVals(Array.isArray(value?.districts) ? value.districts : []);
  }, [value]);

  const states = useMemo(() => getStates(), []);
  const districts = useMemo(() => (stateVal ? getDistricts(stateVal) : []), [stateVal]);

  const handleStateChange = (newState) => {
    setStateVal(newState);
    setDistrictVals([]);
    onChange?.({ state: newState, districts: [] });
  };

  const toggleDistrict = (d) => {
    const exists = districtVals.includes(d);
    const next = exists ? districtVals.filter(x => x !== d) : [...districtVals, d];
    setDistrictVals(next);
    onChange?.({ state: stateVal, districts: next });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500 mb-1">State</Label>
          <Select value={stateVal} onValueChange={handleStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {states.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-gray-500 mb-1">Districts</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-auto p-2 border rounded">
            {districts.length === 0 && (
              <div className="text-sm text-gray-500 col-span-full">{stateVal ? 'No districts available' : 'Select a state first'}</div>
            )}
            {districts.map(d => (
              <label key={d} className="flex items-center gap-2 text-sm">
                <Checkbox checked={districtVals.includes(d)} onCheckedChange={() => toggleDistrict(d)} />
                <span>{d}</span>
              </label>
            ))}
          </div>
        </div>

        {stateVal && districtVals.length > 0 && (
          <div className="text-xs text-gray-600 bg-blue-50 border rounded p-2">
            <span className="font-medium">Selected:</span> {stateVal} — {districtVals.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiLocationSelector;
