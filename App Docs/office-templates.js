// officeTemplates.js
import * as XLSX from 'xlsx';
import _ from 'lodash';

export class OfficeTemplateManager {
  constructor() {
    this.templates = {
      word: {
        full: 'templates/word/full_report.docx',
        summary: 'templates/word/executive_summary.docx'
      },
      powerpoint: {
        standard: 'templates/powerpoint/presentation.pptx',
        executive: 'templates/powerpoint/executive.pptx'
      },
      excel: {
        financial: 'templates/excel/financial_analysis.xlsx',
        components: 'templates/excel/component_inventory.xlsx'
      }
    };
  }

  // Excel Report Generation
  generateExcelReport(data, template = 'financial') {
    const workbook = XLSX.utils.book_new();
    
    // Financial Analysis Sheet
    if (data.financials) {
      const financialSheet = XLSX.utils.json_to_sheet(data.financials.yearlyData);
      XLSX.utils.book_append_sheet(workbook, financialSheet, 'Financial Analysis');
      
      // Apply financial template styling
      this.applyExcelStyling(financialSheet, {
        headerStyle: { font: { bold: true }, fill: { fgColor: { rgb: "CCE5FF" } } },
        numberFormat: '#,##0.00',
        columnWidths: [10, 15, 15, 15, 15]
      });
    }

    // Component Inventory Sheet
    if (data.components) {
      const componentSheet = XLSX.utils.json_to_sheet(data.components);
      XLSX.utils.book_append_sheet(workbook, componentSheet, 'Component Inventory');
      
      // Apply component template styling
      this.applyExcelStyling(componentSheet, {
        headerStyle: { font: { bold: true }, fill: { fgColor: { rgb: "E6F3FF" } } },
        numberFormat: '#,##0.00',
        columnWidths: [20, 15, 10, 10, 15]
      });
    }

    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  }

  // Apply Excel Styling
  applyExcelStyling(worksheet, styles) {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Apply header styling
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[headerAddress]) continue;
      worksheet[headerAddress].s = styles.headerStyle;
    }

    // Set column widths
    worksheet['!cols'] = styles.columnWidths.map(width => ({ width }));
  }

  // Generate Template Context
  generateTemplateContext(data) {
    return {
      project: {
        name: data.projectInfo.name,
        address: data.projectInfo.address,
        date: new Date().toLocaleDateString(),
        client: data.projectInfo.client
      },
      summary: {
        componentCount: data.components.length,
        totalCost: _.sumBy(data.components, 'replacementCost'),
        recommendedFunding: data.financials.recommendedAnnual,
        fundingGoal: data.financials.fundingGoal
      },
      components: data.components.map(c => ({
        name: c.name,
        category: c.category,
        usefulLife: c.usefulLife,
        remainingLife: c.remainingLife,
        replacementCost: c.replacementCost.toLocaleString()
      })),
      financials: {
        startingBalance: data.financials.startingBalance,
        annualContribution: data.financials.annualContribution,
        projectionYears: data.financials.projectionYears,
        fundingLevel: data.financials.fundingLevel
      },
      charts: {
        fundingProjection: 'charts/funding_projection.png',
        componentBreakdown: 'charts/component_breakdown.png'
      }
    };
  }

  // Template Processing Helpers
  processTextTemplate(template, context) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return _.get(context, key, match);
    });
  }

  // Format currency values
  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  // Format percentages
  formatPercentage(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  }
}

export default new OfficeTemplateManager();