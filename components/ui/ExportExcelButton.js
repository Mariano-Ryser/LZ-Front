import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function ExportExcelButton({ data, filename = 'export', buttonText = 'Exportar Excel', disabled = false }) {
  const [loading, setLoading] = useState(false);

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert('Keine Daten zum Exportieren');
      return;
    }

    setLoading(true);

    try {
      // Transformar los datos para Excel
      const worksheetData = data.map(item => ({ 
        'Artikelnummer': item.artikelNumber || '',
        'Artikelname': item.artikelName || '',
        'Lagerplatz': item.lagerPlatz || '',
        'Beschreibung': item.description || '',
        'Lagerbestand': item.stock || 0,
        'Preis (€)': item.price || 0,
        'Bild': item.imagen ? 'Ja' : 'Nein',
        'Erstellt am': item.createdAt ? new Date(item.createdAt).toLocaleDateString('de-DE') : '',
        'Aktualisiert am': item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('de-DE') : ''
      }));
      
      // Crear libro de Excel
      const ws = XLSX.utils.json_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Produkte');

      // Autoajustar columnas
      const maxWidth = worksheetData.reduce((acc, row) => {
        Object.keys(row).forEach(key => {
          const length = String(row[key]).length;
          if (!acc[key] || length > acc[key]) {
            acc[key] = length;
          }
        });
        return acc;
      }, {});

      ws['!cols'] = Object.keys(maxWidth).map(key => ({ 
        width: Math.min(Math.max(maxWidth[key], key.length), 50) 
      }));

      // Descargar archivo
      XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Fehler beim Export: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={exportToExcel} 
      disabled={disabled || loading || !data || data.length === 0}
      className="excel-button"
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Exportiere...
        </>
      ) : (
        <>
          <svg className="excel-icon" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {buttonText}
        </>
      )}
      <style jsx>{`
        .excel-button {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          background: #217346;
          color: white;
          border: none;
          padding: 0.70rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }
        
        .excel-button:hover:not(:disabled) {
          background: #1a5c38;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(33, 115, 70, 0.3);
        }
        
        .excel-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .excel-icon {
          width: 18px;
          height: 18px;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}