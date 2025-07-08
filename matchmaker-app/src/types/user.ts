export type UserType = 'employer' | 'agency' | 'individual_helper';

export interface BaseUser {
  uid: string;
  email?: string;
  phoneNumber?: string;
  userType: UserType;
  isRegistrationComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface EmployerProfile {
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  description: string;
  website?: string;
  contactPerson: string;
  // Fields for AI matching
  preferredSkills: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  jobTypes: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
}

export interface AgencyProfile {
  agencyName: string;
  licenseNumber: string;
  location: string;
  description: string;
  website?: string;
  specializations: string[];
  // Fields for AI matching
  availableHelpers: number;
  serviceAreas: string[];
  priceRange: {
    min: number;
    max: number;
  };
  qualityRating: number;
}

export interface IndividualHelperProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  location: string;
  bio: string;
  // Fields for AI matching
  skills: string[];
  experience: string;
  availability: {
    fullTime: boolean;
    partTime: boolean;
    weekends: boolean;
    nights: boolean;
  };
  hourlyRate: number;
  certifications: string[];
  languages: string[];
  workRadius: number; // in kilometers
}

export interface User extends BaseUser {
  employerProfile?: EmployerProfile;
  agencyProfile?: AgencyProfile;
  individualHelperProfile?: IndividualHelperProfile;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  redirectUrl?: string;
}

export interface SignUpData {
  email?: string;
  phoneNumber?: string;
  password: string;
  userType: UserType;
}

export interface SignInData {
  email?: string;
  phoneNumber?: string;
  password: string;
}