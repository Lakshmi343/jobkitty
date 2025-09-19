import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
   
    return (
        <div className='max-w-7xl mx-auto my-10 md:my-20 px-4 md:px-6'>
            <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left'>
                <span className='text-[#6A38C2]'>Latest & Top </span> Job Openings</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 my-5'>
                {
                    allJobs.length <= 0 ? <span className="col-span-full text-center text-gray-500">No Job Available</span> : allJobs?.slice(0,6).map((job) => <LatestJobCards key={job._id} job={job}/>)
                }
            </div>
           <div className="text-center mt-8">
                    <Link to="/jobs" ><motion.button
                   
                       className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       Show More Jobs 
                     </motion.button></Link>
                   </div>
            
        </div>
    )
}

export default LatestJobs


