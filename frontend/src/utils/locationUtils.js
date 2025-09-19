
export const formatLocationForDisplay = (location) => {
  if (!location) return 'Remote';
  

  if (typeof location === 'string') return location;
  
  if (typeof location === 'object') {
    if (location.legacy) return location.legacy;
    if (location.district && location.state) {
      return `${location.district}, ${location.state}`;
    }
    if (location.district) return location.district;
    if (location.state) return location.state;
  }
  
  return 'Remote';
};


export const getLocationSearchString = (location) => {
  if (!location) return '';
  
  if (typeof location === 'string') return location.toLowerCase();
  
  if (typeof location === 'object') {
    const parts = [];
    if (location.legacy) parts.push(location.legacy);
    if (location.district) parts.push(location.district);
    if (location.state) parts.push(location.state);
    return parts.join(' ').toLowerCase();
  }
  
  return '';
};
