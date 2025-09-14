import React from 'react'
import Navbar from '../shared/Navbar'
import AppliedJobTable from '../AppliedJobTable'

const AppliedJobs = () => {
    return (
        <div>
            
            <div className='max-w-7xl mx-auto p-4'>
                <h1 className='text-2xl font-bold mb-6'>My Applied Jobs</h1>
                <AppliedJobTable />
            </div>
        </div>
    )
}

export default AppliedJobs 