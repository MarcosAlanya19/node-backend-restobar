export enum UserRole {
  Customer = 'customer',
  Administrator = 'administrator',
}

export interface User {
  id: number;
  user_name: string;
  user_password: string;
  email: string;
  role: UserRole;
  phone_number: string,
  address: string
}
