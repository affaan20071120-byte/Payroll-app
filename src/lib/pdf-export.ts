import { Employee } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export function exportToPDF(employees: Employee[]) {
  if (!employees || employees.length === 0) {
    alert("No data to export.");
    return;
  }

  const doc = new jsPDF('landscape'); // use landscape for more columns
  
  // Title
  doc.setTextColor(0, 102, 204); // Deep Modern Blue
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Payroll Executive Report', 14, 22);
  
  // Subtitle/Info
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy - hh:mm a')}`, 14, 30);
  doc.text(`Total Employees: ${employees.length}`, 14, 35);

  // Divider Line
  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(0.5);
  doc.line(14, 38, 283, 38); // landscape width is ~297

  const tableColumn = ["Emp No", "Name", "Job", "Basic", "DA", "HRA", "Allow", "Gross", "Tax", "Health Ins", "Car Ins", "Net"];
  const tableRows: any[] = [];

  employees.forEach(e => {
    const row = [
      e.empNo.toString(),
      e.name,
      e.job,
      e.basicSalary.toLocaleString('en-US', {minimumFractionDigits:2}),
      e.da.toLocaleString('en-US', {minimumFractionDigits:2}),
      e.hra.toLocaleString('en-US', {minimumFractionDigits:2}),
      e.otherAllowance.toLocaleString('en-US', {minimumFractionDigits:2}),
      e.grossSalary.toLocaleString('en-US', {minimumFractionDigits:2}),
      e.tax.toLocaleString('en-US', {minimumFractionDigits:2}),
      e.healthInsurance.toLocaleString('en-US', {minimumFractionDigits:2}),
      e.carInsurance.toLocaleString('en-US', {minimumFractionDigits:2}),
      e.netSalary.toLocaleString('en-US', {minimumFractionDigits:2})
    ];
    tableRows.push(row);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: { top: 4, right: 2, bottom: 4, left: 2 },
      textColor: [44, 62, 80],
      lineColor: [223, 230, 233],
      lineWidth: 0.1,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [9, 132, 227], // Vibrant Blue
      textColor: 255,
      halign: 'center',
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      halign: 'right'
    },
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold', textColor: [9, 132, 227] }, // Emp No (Blue)
      1: { halign: 'left', fontStyle: 'bold', textColor: [108, 92, 231] }, // Name (Purple)
      2: { halign: 'left', fontStyle: 'bold', textColor: [232, 67, 147] }, // Job (Pink)
      3: { fontStyle: 'bold', textColor: [211, 84, 0] }, // Basic (Orange/Brown)
      4: { textColor: [32, 191, 107], fontStyle: 'bold' }, // DA (Green)
      5: { textColor: [32, 191, 107], fontStyle: 'bold' }, // HRA
      6: { textColor: [32, 191, 107], fontStyle: 'bold' }, // Allowance
      7: { textColor: [251, 197, 49], fontStyle: 'bold' }, // Gross (Yellow)
      8: { textColor: [235, 59, 90], fontStyle: 'bold' }, // Tax (Red)
      9: { textColor: [235, 59, 90], fontStyle: 'bold' }, // Health
      10: { textColor: [235, 59, 90], fontStyle: 'bold' }, // Car
      11: { textColor: [0, 210, 255], fontStyle: 'bold' } // Net (Cyan)
    },
    alternateRowStyles: {
      fillColor: [241, 246, 255] // Very light blueish grey
    }
  });

  // Save/Open PDF
  const filename = `payroll_report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  
  // Try to open in new tab
  const newWin = window.open(blobUrl, '_blank');
  if (!newWin) {
    // Fallback if browser blocked popup
    doc.save(filename);
  }
}
