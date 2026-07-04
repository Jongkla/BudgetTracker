import { RentEntry, UtilityEntry, CustomLogData } from './types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
}

export function formatMonth(monthStr: string): string {
  if (!monthStr) return '';
  try {
    const parts = monthStr.split('-');
    if (parts.length >= 2) {
      const [year, month] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return monthStr;
  } catch (e) {
    return monthStr;
  }
}

export function exportToCSV(rentEntries: RentEntry[], utilityEntries: UtilityEntry[], customLogs: CustomLogData[]) {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Rent Section
  csvContent += "--- Rent Payment Log ---\n";
  csvContent += "Date Paid,Period Covered,Rent Amount,Total Paid,Remaining Balance\n";
  rentEntries.forEach(entry => {
    const remaining = entry.rentAmount - entry.totalPaid;
    csvContent += `${entry.datePaid},${entry.periodCovered},${entry.rentAmount},${entry.totalPaid},${remaining}\n`;
  });

  csvContent += "\n";

  // Utility Section
  csvContent += "--- Utility Consumption Log ---\n";
  csvContent += "Month,Previous Reading,Present Reading,KWH Used,Cost per KWH,Total Cost,Amount Paid\n";
  utilityEntries.forEach(entry => {
    csvContent += `${entry.month},${entry.previousReading},${entry.presentReading},${entry.kwhUsed},${entry.costPerKwh},${entry.totalCost},${entry.amountPaid}\n`;
  });

  csvContent += "\n";

  // Custom Logs Section
  customLogs.forEach(log => {
    csvContent += `--- ${log.title} ---\n`;
    csvContent += "Expense Name,Date,Amount,Amount Paid,Remaining Balance\n";
    log.entries.forEach(entry => {
      const remaining = entry.amount - entry.amountPaid;
      csvContent += `${entry.billName},${entry.dueDate},${entry.amount},${entry.amountPaid},${remaining}\n`;
    });
    csvContent += "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "expense_tracker_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

