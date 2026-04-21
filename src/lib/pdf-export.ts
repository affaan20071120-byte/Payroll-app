import { Employee } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export function exportToPDF(employees: Employee[]) {
  if (!employees || employees.length === 0) {
    alert("No data to export.");
    return;
  }

  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Payroll Report', 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`, 14, 30);
  doc.text(`Total Employees: ${employees.length}`, 14, 36);

  const tableColumn = ["Emp No", "Name", "Job", "Basic", "DA", "HRA", "Allow", "Gross", "Tax", "Health", "Car", "Net"];
  const tableRows: any[] = [];

  employees.forEach(e => {
    const row = [
      e.empNo.toString(),
      e.name,
      e.job,
      e.basicSalary.toFixed(2),
      e.da.toFixed(2),
      e.hra.toFixed(2),
      e.otherAllowance.toFixed(2),
      e.grossSalary.toFixed(2),
      e.tax.toFixed(2),
      e.healthInsurance.toFixed(2),
      e.carInsurance.toFixed(2),
      e.netSalary.toFixed(2)
    ];
    tableRows.push(row);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 128, 255],
      textColor: 255,
      halign: 'center',
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8,
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [230, 243, 255]
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
