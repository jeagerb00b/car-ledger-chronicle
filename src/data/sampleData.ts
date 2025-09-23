import { Car, Owner, CrimeHistory, Dealership, CarOwnership, CarDealer, DashboardStats, Activity } from '@/types/database';
import sampleCar1 from '@/assets/sample-car-1.jpg';
import sampleCar2 from '@/assets/sample-car-2.jpg';
import sampleCar3 from '@/assets/sample-car-3.jpg';

// Sample Cars Data
export const sampleCars: Car[] = [
  {
    id: '1',
    registrationNumber: 'MH-12-AB-1234',
    yearOfRegistration: 2020,
    model: 'BMW 3 Series',
    color: 'Metallic Blue',
    amount: 2500000,
    image: sampleCar1,
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    registrationNumber: 'DL-01-CD-5678',
    yearOfRegistration: 2019,
    model: 'Audi Q7',
    color: 'Black',
    amount: 4500000,
    image: sampleCar2,
    createdAt: new Date('2019-03-20'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    registrationNumber: 'KA-03-EF-9012',
    yearOfRegistration: 2021,
    model: 'Ferrari 488 Spider',
    color: 'Red',
    amount: 8500000,
    image: sampleCar3,
    createdAt: new Date('2021-06-10'),
    updatedAt: new Date('2024-01-20')
  }
];

// Sample Owners Data
export const sampleOwners: Owner[] = [
  {
    id: '1',
    firstName: 'Rajesh',
    lastName: 'Sharma',
    name: 'Rajesh Sharma',
    state: 'Maharashtra',
    pin: '400001',
    address: '123 Marine Drive',
    city: 'Mumbai',
    createdAt: new Date('2020-01-10')
  },
  {
    id: '2',
    firstName: 'Priya',
    lastName: 'Patel',
    name: 'Priya Patel',
    state: 'Delhi',
    pin: '110001',
    address: '456 Connaught Place',
    city: 'New Delhi',
    createdAt: new Date('2019-03-15')
  },
  {
    id: '3',
    firstName: 'Vikram',
    lastName: 'Singh',
    name: 'Vikram Singh',
    state: 'Karnataka',
    pin: '560001',
    address: '789 Brigade Road',
    city: 'Bangalore',
    createdAt: new Date('2021-06-05')
  },
  {
    id: '4',
    firstName: 'Anita',
    lastName: 'Desai',
    name: 'Anita Desai',
    state: 'Maharashtra',
    pin: '400002',
    address: '321 Bandra West',
    city: 'Mumbai',
    createdAt: new Date('2022-02-20')
  }
];

// Sample Crime History Data
export const sampleCrimeHistory: CrimeHistory[] = [
  {
    id: '1',
    carId: '1',
    typeOfCrime: 'Speeding Violation',
    damage: 'None',
    cid: 'CR-2023-001',
    dateRecorded: new Date('2023-05-15'),
    severity: 'Low'
  },
  {
    id: '2',
    carId: '2',
    typeOfCrime: 'Hit and Run',
    damage: 'Front bumper damage',
    cid: 'CR-2023-045',
    dateRecorded: new Date('2023-08-22'),
    severity: 'High'
  },
  {
    id: '3',
    carId: '3',
    typeOfCrime: 'Illegal Racing',
    damage: 'Minor scratches',
    cid: 'CR-2024-012',
    dateRecorded: new Date('2024-01-10'),
    severity: 'Medium'
  }
];

// Sample Dealerships Data
export const sampleDealerships: Dealership[] = [
  {
    id: '1',
    dealershipName: 'Premium Auto Mumbai',
    location: 'Andheri East, Mumbai',
    phone: '+91-9876543210',
    createdAt: new Date('2018-01-01')
  },
  {
    id: '2',
    dealershipName: 'Elite Motors Delhi',
    location: 'Karol Bagh, New Delhi',
    phone: '+91-9876543211',
    createdAt: new Date('2017-06-15')
  },
  {
    id: '3',
    dealershipName: 'Luxury Cars Bangalore',
    location: 'Koramangala, Bangalore',
    phone: '+91-9876543212',
    createdAt: new Date('2019-03-20')
  }
];

// Sample Car Ownership Data
export const sampleCarOwnership: CarOwnership[] = [
  {
    id: '1',
    carId: '1',
    ownerId: '1',
    startDate: new Date('2020-01-15'),
    currentOwner: true
  },
  {
    id: '2',
    carId: '2',
    ownerId: '2',
    startDate: new Date('2019-03-20'),
    endDate: new Date('2022-06-10'),
    currentOwner: false
  },
  {
    id: '3',
    carId: '2',
    ownerId: '4',
    startDate: new Date('2022-06-15'),
    currentOwner: true
  },
  {
    id: '4',
    carId: '3',
    ownerId: '3',
    startDate: new Date('2021-06-10'),
    currentOwner: true
  }
];

// Sample Dashboard Stats
export const sampleDashboardStats: DashboardStats = {
  totalCars: 3,
  totalOwners: 4,
  totalCrimes: 3,
  totalDealerships: 3,
  carsWithCrimeHistory: 3,
  recentActivities: [
    {
      id: '1',
      type: 'crime_reported',
      description: 'New crime reported for Ferrari 488 Spider (KA-03-EF-9012)',
      timestamp: new Date('2024-01-20T10:30:00'),
      severity: 'warning'
    },
    {
      id: '2',
      type: 'ownership_changed',
      description: 'Ownership transferred for Audi Q7 (DL-01-CD-5678)',
      timestamp: new Date('2024-01-18T14:15:00'),
      severity: 'info'
    },
    {
      id: '3',
      type: 'car_added',
      description: 'New car added: BMW 3 Series (MH-12-AB-1234)',
      timestamp: new Date('2024-01-15T09:00:00'),
      severity: 'info'
    }
  ]
};

// Helper functions to get related data
export const getCarOwner = (carId: string): Owner | null => {
  const ownership = sampleCarOwnership.find(o => o.carId === carId && o.currentOwner);
  if (!ownership) return null;
  return sampleOwners.find(owner => owner.id === ownership.ownerId) || null;
};

export const getCarCrimeHistory = (carId: string): CrimeHistory[] => {
  return sampleCrimeHistory.filter(crime => crime.carId === carId);
};

export const getOwnershipHistory = (carId: string): (CarOwnership & { owner: Owner })[] => {
  return sampleCarOwnership
    .filter(ownership => ownership.carId === carId)
    .map(ownership => ({
      ...ownership,
      owner: sampleOwners.find(owner => owner.id === ownership.ownerId)!
    }))
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
};