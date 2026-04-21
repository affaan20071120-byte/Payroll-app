import { Employee, PayrollSettings, defaultSettings } from '../types';

export function calculateSalaryComponents(job: string, basicSalary: number, settings: PayrollSettings = defaultSettings) {
  const j = job.toUpperCase();
  let da = 0, hra = 0, tax = 0;

  if (j === 'OFFICER') {
    da = basicSalary * settings.daOfficer;
    hra = basicSalary * settings.hraOfficer;
    tax = basicSalary * settings.taxOfficer;
  } else if (j === 'MANAGER') {
    da = basicSalary * settings.daManager;
    hra = basicSalary * settings.hraManager;
    tax = basicSalary * settings.taxManager;
  } else if (j === 'TEACHER') {
    da = basicSalary * settings.daTeacher;
    hra = basicSalary * settings.hraTeacher;
    tax = basicSalary * settings.taxTeacher;
  } else {
    da = basicSalary * settings.daDefault;
    hra = basicSalary * settings.hraDefault;
    tax = basicSalary * settings.taxDefault;
  }

  const otherAllowance = basicSalary * settings.allowanceRate;
  const healthInsurance = basicSalary * settings.healthRate;
  const carInsurance = basicSalary * settings.carRate;

  const customAllowances: Record<string, number> = {};
  let totalCustomAllowances = 0;
  
  if (settings.customAllowances) {
    settings.customAllowances.forEach(ca => {
      const val = basicSalary * ca.rate;
      customAllowances[ca.id] = val;
      totalCustomAllowances += val;
    });
  }

  const grossSalary = basicSalary + da + hra + otherAllowance + totalCustomAllowances;
  const netSalary = grossSalary - tax - healthInsurance - carInsurance;

  return { da, hra, otherAllowance, customAllowances, grossSalary, tax, healthInsurance, carInsurance, netSalary };
}
