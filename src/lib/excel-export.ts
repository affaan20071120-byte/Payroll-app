import { Employee } from '../types';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';

export async function exportToExcel(employees: Employee[]) {
  if (!employees || employees.length === 0) {
    alert("No data to export.");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Payroll Data', {
    views: [{ state: 'frozen', ySplit: 1 }] // Freeze header row
  });

  // Define columns
  sheet.columns = [
    { header: 'Emp No', key: 'empNo', width: 12 },
    { header: 'Name', key: 'name', width: 22 },
    { header: 'Job', key: 'job', width: 22 },
    { header: 'Basic', key: 'basic', width: 15 },
    { header: 'DA', key: 'da', width: 15 },
    { header: 'HRA', key: 'hra', width: 15 },
    { header: 'Allowance', key: 'allowance', width: 15 },
    { header: 'Gross', key: 'gross', width: 16 },
    { header: 'Tax', key: 'tax', width: 15 },
    { header: 'Health Ins.', key: 'healthIns', width: 16 },
    { header: 'Car Ins.', key: 'carIns', width: 15 },
    { header: 'Net', key: 'net', width: 18 }
  ];

  // Add Header Style
  const headerRow = sheet.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0984E3' } // Vibrant Blue
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    };
  });

  // Add Data
  employees.forEach((e, index) => {
    const row = sheet.addRow({
      empNo: e.empNo,
      name: e.name,
      job: e.job,
      basic: e.basicSalary,
      da: e.da,
      hra: e.hra,
      allowance: e.otherAllowance,
      gross: e.grossSalary,
      tax: e.tax,
      healthIns: e.healthInsurance,
      carIns: e.carInsurance,
      net: e.netSalary
    });
    
    row.height = 25;

    // Default font and borders for the row
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'hair', color: { argb: 'FFE3E3E3' } },
        bottom: { style: 'hair', color: { argb: 'FFE3E3E3' } },
        left: { style: 'hair', color: { argb: 'FFE3E3E3' } },
        right: { style: 'hair', color: { argb: 'FFE3E3E3' } }
      };
      if (!cell.font) {
         cell.font = { color: { argb: 'FF2D3436' } };
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Alternating row background colors
    const isEven = index % 2 === 0;
    const rowFillColor = isEven ? 'FFF1F6FF' : 'FFFFFFFF';
    
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        // default background color for the row
        fgColor: { argb: rowFillColor }
      };
    });

    // Color specific columns (matching the PDF theme loosely)
    row.getCell('empNo').font = { color: { argb: 'FF0984E3' }, bold: true }; // Blue
    row.getCell('name').font = { color: { argb: 'FF6C5CE7' }, bold: true }; // Purple
    row.getCell('job').font = { color: { argb: 'FFE84393' }, bold: true }; // Pink
    row.getCell('basic').font = { color: { argb: 'FFD35400' }, bold: true }; // Orange/Brown

    row.getCell('da').font = { color: { argb: 'FF20BF6B' }, bold: true }; // Green
    row.getCell('hra').font = { color: { argb: 'FF20BF6B' }, bold: true }; // Green
    row.getCell('allowance').font = { color: { argb: 'FF20BF6B' }, bold: true }; // Green
    
    row.getCell('gross').font = { color: { argb: 'FFD29000' }, bold: true }; // Golden Dark
    
    row.getCell('tax').font = { color: { argb: 'FFEB3B5A' }, bold: true }; // Red
    row.getCell('healthIns').font = { color: { argb: 'FFEB3B5A' }, bold: true }; // Red
    row.getCell('carIns').font = { color: { argb: 'FFEB3B5A' }, bold: true }; // Red

    const netCell = row.getCell('net');
    netCell.font = { color: { argb: 'FF0097E6' }, bold: true }; // Blue bold for net salary
  });

  // Number formatting
  const numberFormat = '#,##0.00';
  ['basic', 'da', 'hra', 'allowance', 'gross', 'tax', 'healthIns', 'carIns', 'net'].forEach(key => {
    const col = sheet.getColumn(key);
    col.numFmt = numberFormat;
    // ensure right alignment for numbers
    col.eachCell({ includeEmpty: false }, (cell, rowNumber) => {
      if (rowNumber > 1) { // skip header
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      }
    });
  });

  // Generate Buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const filename = `payroll_data_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
  
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
