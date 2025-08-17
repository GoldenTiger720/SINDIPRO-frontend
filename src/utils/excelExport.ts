import * as XLSX from 'xlsx';
import { MaterialRequestResponse } from '@/hooks/useFieldManagement';

export const exportMaterialRequestsToExcel = (data: MaterialRequestResponse[], filename: string = 'material_requests') => {
  // Flatten the data structure for Excel export
  const flattenedData = data.flatMap(request => 
    request.items.map((item, index) => ({
      'Request ID': request.id,
      'Request Title': request.title,
      'Building': request.building_name,
      'Caretaker': request.caretaker,
      'Status': request.status || 'sent',
      'Created Date': new Date(request.created_at).toLocaleDateString(),
      'Item #': index + 1,
      'Product Type': item.productType,
      'Quantity': item.quantity,
      'Observations': item.observations
    }))
  );

  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(flattenedData);
  
  // Auto-size columns
  const colWidths = [
    { wch: 10 }, // Request ID
    { wch: 30 }, // Request Title
    { wch: 20 }, // Building
    { wch: 20 }, // Caretaker
    { wch: 10 }, // Status
    { wch: 15 }, // Created Date
    { wch: 8 },  // Item #
    { wch: 25 }, // Product Type
    { wch: 10 }, // Quantity
    { wch: 30 }  // Observations
  ];
  ws['!cols'] = colWidths;
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Material Requests');
  
  // Generate Excel file and trigger download
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data_blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Create download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(data_blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(link.href);
};