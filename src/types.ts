export interface Employee {
  empNo: number;
  name: string;
  job: string;
  basicSalary: number;
  da: number;
  hra: number;
  otherAllowance: number;
  customAllowances: Record<string, number>;
  grossSalary: number;
  tax: number;
  healthInsurance: number;
  carInsurance: number;
  netSalary: number;
  createdAt?: string;
}

export interface CustomAllowance {
  id: string;
  label: string;
  rate: number;
}

export interface PayrollSettings {
  daOfficer: number;
  daManager: number;
  daTeacher: number;
  daDefault: number;
  hraOfficer: number;
  hraManager: number;
  hraTeacher: number;
  hraDefault: number;
  taxOfficer: number;
  taxManager: number;
  taxTeacher: number;
  taxDefault: number;
  healthRate: number;
  carRate: number;
  allowanceRate: number;
  customAllowances: CustomAllowance[];
  // Labels
  empNoLabel: string;
  nameLabel: string;
  jobLabel: string;
  basicLabel: string;
  daLabel: string;
  hraLabel: string;
  allowanceLabel: string;
  grossLabel: string;
  taxLabel: string;
  healthLabel: string;
  carLabel: string;
  netLabel: string;
}

export const defaultSettings: PayrollSettings = {
  daOfficer: 0.50, daManager: 0.45, daTeacher: 0.46, daDefault: 0.40,
  hraOfficer: 0.35, hraManager: 0.30, hraTeacher: 0.32, hraDefault: 0.25,
  taxOfficer: 0.20, taxManager: 0.15, taxTeacher: 0.25, taxDefault: 0.10,
  healthRate: 0.05, carRate: 0.03, allowanceRate: 0.10,
  customAllowances: [],
  empNoLabel: 'Emp No',
  nameLabel: 'Name',
  jobLabel: 'Job',
  basicLabel: 'Basic',
  daLabel: 'DA',
  hraLabel: 'HRA',
  allowanceLabel: 'Allowance',
  grossLabel: 'Gross',
  taxLabel: 'Tax',
  healthLabel: 'Health Ins.',
  carLabel: 'Car Ins.',
  netLabel: 'Net'
};
