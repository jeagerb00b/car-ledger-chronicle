// Database entity types based on the ER diagram

export interface Car {
  id: string;
  registrationNumber: string;
  yearOfRegistration: number;
  model: string;
  color: string;
  amount: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Full name
  state: string;
  pin: string; // Postal code
  address: string;
  city: string;
  createdAt: Date;
}

export interface CrimeHistory {
  id: string;
  carId: string;
  typeOfCrime: string;
  damage?: string;
  cid: string; // Crime ID
  dateRecorded: Date;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Dealership {
  id: string;
  dealershipName: string;
  location: string;
  phone: string;
  createdAt: Date;
}

export interface CarOwnership {
  id: string;
  carId: string;
  ownerId: string;
  startDate: Date;
  endDate?: Date;
  currentOwner: boolean;
}

export interface CarDealer {
  id: string;
  carId: string;
  dealershipId: string;
  depositDate: Date;
  status: 'Available' | 'Sold' | 'Reserved' | 'Under Inspection';
}

// UI Types
export type UserRole = 'admin' | 'viewer';

export interface DashboardStats {
  totalCars: number;
  totalOwners: number;
  totalCrimes: number;
  totalDealerships: number;
  carsWithCrimeHistory: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'car_added' | 'crime_reported' | 'ownership_changed' | 'car_sold';
  description: string;
  timestamp: Date;
  severity?: 'info' | 'warning' | 'danger';
}