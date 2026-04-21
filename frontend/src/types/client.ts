export interface Client {
  _id: string;
  name: string;
  status: string;
  contactPerson: string;
  email: string;
  address?: string;
  activeEmployees: number;
  totalBilled: number;
  createdAt?: string;
  updatedAt?: string;
}
