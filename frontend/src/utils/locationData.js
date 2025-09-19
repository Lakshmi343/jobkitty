// State-District mapping for South Indian states
export const stateDistrictData = {
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", 
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", 
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", 
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
    "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", 
    "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", 
    "Vellore", "Viluppuram", "Virudhunagar"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
    "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar",
    "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool",
    "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
    "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet",
    "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"
  ],
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna",
    "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam",
    "Vizianagaram", "West Godavari", "YSR Kadapa"
  ],
  "Karnataka": [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
    "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga",
    "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan",
    "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal",
    "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga",
    "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"
  ]
};

// Get all states
export const getStates = () => {
  return Object.keys(stateDistrictData);
};

// Get districts for a specific state
export const getDistricts = (state) => {
  return stateDistrictData[state] || [];
};

// Validate state-district combination
export const isValidLocation = (state, district) => {
  const districts = getDistricts(state);
  return districts.includes(district);
};

// Format location for display
export const formatLocation = (state, district) => {
  if (!state && !district) return '';
  if (!district) return state;
  return `${district}, ${state}`;
};

// Parse location string back to state and district
export const parseLocation = (locationString) => {
  if (!locationString) return { state: '', district: '' };
  
  // If it contains comma, split it
  if (locationString.includes(',')) {
    const [district, state] = locationString.split(',').map(s => s.trim());
    return { state, district };
  }
  
  // Otherwise, check if it's a state or district
  const states = getStates();
  if (states.includes(locationString)) {
    return { state: locationString, district: '' };
  }
  
  // Check if it's a district in any state
  for (const state of states) {
    const districts = getDistricts(state);
    if (districts.includes(locationString)) {
      return { state, district: locationString };
    }
  }
  
  return { state: '', district: locationString };
};
