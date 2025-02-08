export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  country: string;
  city: string;
  phoneNumber: string;
  role?: string;
}
