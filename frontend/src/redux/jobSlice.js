import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
        filters: {
            // Hydrate preferred location from localStorage if available
            location: (() => {
                try {
                    return localStorage.getItem('preferredLocation') || "";
                } catch (e) {
                    return "";
                }
            })(),
            jobType: "",
            salaryRange: "",
            experienceRange: "",
            categoryId: "",  // This should match what's used in your components
            companyType: "",
            datePosted: ""   // e.g., 'today', 'yesterday', 'week', 'month'
        }
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
        setJobFilters: (state, action) => {
            // Only update filters that exist in the initial state
            Object.keys(action.payload).forEach(key => {
                if (state.filters.hasOwnProperty(key)) {
                    state.filters[key] = action.payload[key];
                }
            });
            console.log('Updated filters in Redux:', state.filters);
        }
    }
});
export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    setJobFilters
} = jobSlice.actions;
export default jobSlice.reducer;