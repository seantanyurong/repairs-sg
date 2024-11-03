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
    vehicle: {
      id: string;  
      licencePlate: string;  
    };
    status: 'PENDING' | 'ONGOING' | 'COMPLETED'; 
    createdAt?: Date;  
  }

const findAvailableStaff = (staffArray: { id: string; name: string }[], jobs: Job[], leaves: Leave[], timeStart: Date, timeEnd: Date) => {
    // 1. Filter jobs and leaves that overlap with the time range
    const overlappingJobs = jobs.filter((job) => job.schedule.timeStart < timeEnd && job.schedule.timeEnd > timeStart);
    
    timeStart = new Date(timeStart.toISOString().substring(0, 10));
    timeEnd = new Date(timeEnd.toISOString().substring(0, 10));
    const overlappingLeaves = leaves.filter((leave) => 
      { const leaveStart = new Date(leave.dateRange.start.toISOString().substring(0, 10));
        const leaveEnd = new Date(leave.dateRange.end.toISOString().substring(0, 10));        
        return leaveStart <= timeEnd && leaveEnd >= timeStart && leave.status === 'APPROVED'});

    // 2. Extract staff involved in jobs and leaves
    const overlappingStaffFromJobs = overlappingJobs.map((job) => job.staff);  // Staff names from jobs
    const overlappingStaffFromLeaves = overlappingLeaves.map((leave) => leave.requesterId).map((id) => id = staffArray.find((staff) => staff.id === id)?.name || '');  // Staff names from leaves

    // 3. Combine staff from jobs and leaves
    const overlappingStaff = [...overlappingStaffFromJobs, ...overlappingStaffFromLeaves];
  
    // 4. Filter available staff (those not in overlapping jobs or leaves)
    const availableStaff = staffArray.filter((staff) => !overlappingStaff.includes(staff.name));
    return availableStaff;
  };

  const findAvailableVehicles = (vehicleArray: { id: string; licencePlate: string }[], jobs: Job[], timeStart: Date, timeEnd: Date) => {
    // 1. Filter jobs that overlap with the time range
    const overlappingJobs = jobs.filter((job) => job.schedule.timeStart < timeEnd && job.schedule.timeEnd > timeStart);
    
    timeStart = new Date(timeStart.toISOString().substring(0, 10));
    timeEnd = new Date(timeEnd.toISOString().substring(0, 10));

    // 2. Extract staff involved in jobs and leaves
    const overlappingVehicleFromJobs = overlappingJobs.map((job) => job.vehicle?.licencePlate);  // vehicle licenceplates from jobs
  
    // 4. Filter available vehicles
    const availableVehicle = vehicleArray.filter((vehicle) => !overlappingVehicleFromJobs.includes(vehicle.licencePlate));
    return availableVehicle;
  };
  

export { findAvailableStaff, findAvailableVehicles };
