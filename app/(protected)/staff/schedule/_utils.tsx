'use server'

import Job from '@/models/Job';
import Leave from '@/models/Leave';

// Infer types from Mongoose models
export interface Leave extends Document {
    type: 'ANNUAL' | 'MC';  // Enum with specific string values
    status: 'PENDING' | 'APPROVED' | 'REJECTED';  // Enum with specific string values
    dateRange: {
      start: Date;  // Start date is required
      end: Date;    // End date is required
    };
    requesterId: string;  
    approverId: string;   
    createdAt?: Date;     
    updatedAt?: Date;     
  }

// Infer types from Mongoose models
export interface Job extends Document {
    serviceId: string;  
    staff: string[];    
    schedule: {
      timeStart: Date;  
      timeEnd: Date;   
    };
    status: 'PENDING' | 'ONGOING' | 'COMPLETED'; 
    createdAt?: Date;  
  }

  // Infer types from Mongoose models
 
const findAvailableStaff = (staffArray: { id: string; name: string }[], jobs: Job[], leaves: Leave[], timeStart: Date, timeEnd: Date) => {
    // 1. Filter jobs and leaves that overlap with the time range
    const overlappingJobs = jobs.filter((job) => job.schedule.timeStart < timeEnd && job.schedule.timeEnd > timeStart);
    const overlappingLeaves = leaves.filter((leave) => leave.dateRange.start < timeEnd && leave.dateRange.end > timeStart && leave.status === 'APPROVED');

    // 2. Extract staff involved in jobs and leaves
    const overlappingStaffFromJobs = overlappingJobs.map((job) => job.staff);  // Staff names from jobs
    const overlappingStaffFromLeaves = overlappingLeaves.map((leave) => leave.requesterId).map((id) => id = staffArray.find((staff) => staff.id === id)?.name || '');  // Staff names from leaves

    // 3. Combine staff from jobs and leaves
    const overlappingStaff = [...overlappingStaffFromJobs, ...overlappingStaffFromLeaves];
  
    // 4. Filter available staff (those not in overlapping jobs or leaves)
    const availableStaff = staffArray.filter((staff) => !overlappingStaff.includes(staff.name));
    return availableStaff;
  };
  

export { findAvailableStaff };
