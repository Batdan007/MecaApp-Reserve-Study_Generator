# Reserve Study Generator - User Manual

## Introduction

The Reserve Study Generator is a comprehensive system designed to help engineering companies create professional Structural Integrity Reserve Study (SIRS) reports for condominium associations and property management companies. This system automates the process of analyzing building components, calculating funding projections, and generating detailed reports that comply with Florida Statute Chapter 718 requirements.

This manual will guide you through the complete process of using the Reserve Study Generator to create professional reports.

## Table of Contents

1. [System Overview](#system-overview)
2. [Getting Started](#getting-started)
3. [Entering Property Information](#entering-property-information)
4. [Creating Component Inventory](#creating-component-inventory)
5. [Entering Financial Data](#entering-financial-data)
6. [Generating Reports](#generating-reports)
7. [Understanding Funding Scenarios](#understanding-funding-scenarios)
8. [Customizing Reports](#customizing-reports)
9. [Advanced Features](#advanced-features)
10. [Troubleshooting](#troubleshooting)

## System Overview

The Reserve Study Generator consists of the following main components:

- **Core Generator Engine**: Python-based system that handles calculations and report generation
- **Web Interface**: User-friendly interface for data entry and report generation
- **API**: Allows integration with other systems and automation of report generation

The system follows a four-step process:
1. Enter property information
2. Create component inventory
3. Enter financial data
4. Generate reports

## Getting Started

### Logging In

1. Open your web browser and navigate to the Reserve Study Generator website
2. Enter your username and password
3. Click "Log In"

### Dashboard

After logging in, you'll see the main dashboard with the following options:
- Create New Report
- View Saved Reports
- Continue Draft Reports
- System Settings

To start a new report, click "Create New Report."

## Entering Property Information

The first step is to enter details about the property:

### Required Information

- **Property Name**: The name of the condominium or property
- **Reference ID**: Your company's reference number for this project
- **Address**: Complete property address
- **Construction Date**: Year the property was constructed
- **Inspection Date**: Date the property was inspected
- **Building Details**: Number of buildings, stories, units, and total area

### Tips for Property Information

- Use the official name of the condominium association
- Include all buildings covered by the association
- Be precise with construction dates as they affect component age calculations
- Ensure the inspection date is accurate as it affects remaining life projections

### Saving Property Information

After entering all required information, click "Next" to proceed to the Component Inventory section.

## Creating Component Inventory

The Component Inventory is the heart of the reserve study. This section identifies all building components that require regular maintenance or replacement.

### Adding Components

For each component, enter the following information:

- **Component Name**: Clear, descriptive name
- **Category**: Select from predefined categories (Roof, Structure, Plumbing, etc.)
- **Quantity**: The amount of the component
- **Unit**: The unit of measurement (SF, SQ, EA, LF, LS)
- **Useful Life**: Expected total lifespan in years
- **Remaining Life**: Estimated years until replacement is needed
- **Replacement Cost**: Current cost to replace the component
- **Description**: Detailed description of the component, including condition assessment

### Component Categories

- **Roof**: All roofing elements (membranes, shingles, flashings)
- **Structure**: Structural elements (walkways, balconies, foundations)
- **Fireproofing**: Fire safety systems
- **Plumbing**: Plumbing systems and components
- **Electrical**: Electrical systems and components
- **Waterproofing**: Exterior paint, sealants, waterproofing systems
- **Mechanical**: Elevators, HVAC systems
- **Exteriors**: Other exterior components

### Tips for Component Inventory

- Be thorough – missing components can lead to funding shortfalls
- Use consistent naming conventions for similar components
- Base useful life on manufacturer specifications and environmental factors
- Assess remaining life based on visual inspection and maintenance records
- Include detailed descriptions of component conditions
- Include all components required by Florida Statute 718.112(2)(g)

### Component Examples

| Component Name | Category | Quantity | Unit | Useful Life | Remaining Life | Replacement Cost |
|----------------|----------|----------|------|-------------|----------------|------------------|
| Roof - Flat, TPO | Roof | 330 | SQ | 25 | 11 | $448,800 |
| Stairways & Walkways - Repairs | Structure | 11,670 | SF | 7 | 5 | $37,928 |
| Exterior Wall Paint | Waterproofing | 39,465 | SF | 10 | 7 | $98,663 |
| Elevator | Mechanical | 2 | EA | 30 | 28 | $250,000 |

## Entering Financial Data

The financial section allows you to enter current reserve fund information and calculate funding scenarios.

### Required Financial Information

- **Starting Reserve Fund Balance**: Current balance in the reserve fund
- **Annual Contribution**: Current annual contribution to the reserve fund
- **Interest Rate**: Expected interest rate earned on reserve funds
- **Accounting Method**: Pooled (Cash Flow) or Straight-Line (Component)

### Tips for Financial Data

- Use the most recent financial statements for accurate data
- Include interest earnings if significant
- Verify the accounting method with the association
- Consider any planned special assessments or changes in contributions

## Generating Reports

After entering all required information, you can generate the SIRS report.

### Report Options

- **Full Report**: Complete SIRS report with all sections
- **Executive Summary**: Condensed overview of key findings
- **Presentation**: PowerPoint presentation of key findings
- **Charts Only**: Generate only the funding and expenditure charts

### Report Generation Process

1. Select the desired report option
2. Click "Generate Report"
3. Wait for the system to process the data and create the report
4. Download the completed report

### Report Sections

A complete SIRS report includes:

1. **Title Page**: Property information and report date
2. **Table of Contents**: Navigation guide
3. **Definitions**: Key terms used in the report
4. **Project Overview**: Property description and inspection details
5. **Component Inventory**: List of all components
6. **Component Assessment**: Detailed assessment of each component
7. **Expenditures**: Projected expenditures over 30 years
8. **Reserve Fund Analysis**: Funding scenarios and recommendations
9. **Future Guidelines**: Maintenance recommendations
10. **Disclosures**: Legal disclosures and limitations

## Understanding Funding Scenarios

The system calculates three funding scenarios:

### Baseline Funding

- Keeps the reserve balance just above zero
- Highest risk of special assessments
- Lowest annual contribution requirement

### Threshold Funding

- Maintains the reserve balance above 50% of the fully funded balance
- Moderate risk of special assessments
- Moderate annual contribution requirement

### Fully Funded

- Maintains the reserve balance at or near 100% of the fully funded balance
- Lowest risk of special assessments
- Highest annual contribution requirement

### Funding Charts

The system generates visual charts showing:
- Annual expenditures by component
- Reserve balance projections for each funding scenario
- Percent funded over time

## Customizing Reports

### Company Branding

You can customize reports with your company's:
- Logo
- Contact information
- Color scheme
- Disclaimer text

### Report Templates

The system includes multiple templates:
- Standard SIRS Report
- Executive Summary
- Client Presentation
- Financial Focus

### Custom Text

You can add custom text to:
- Introduction section
- Recommendations section
- Maintenance guidelines

## Advanced Features

### Import Components from Excel

1. Prepare an Excel file with component data
2. Click "Import Components" on the Component Inventory page
3. Select your Excel file
4. Map columns to the required fields
5. Click "Import"

### Export to Different Formats

The system can export reports in various formats:
- Word Document (.docx)
- PDF Document (.pdf)
- Excel Workbook (.xlsx)
- PowerPoint Presentation (.pptx)

### Saving Report Templates

If you create custom report formats:
1. Set up the report as desired
2. Click "Save as Template"
3. Name your template
4. Use this template for future reports

## Troubleshooting

### Common Issues

#### Report Generation Fails

Possible causes:
- Missing required property information
- No components added to inventory
- Invalid financial data
- Server processing error

Solution:
- Check that all required fields are completed
- Ensure at least one component is added
- Verify financial data is entered correctly
- Try again or contact technical support

#### Charts Not Appearing in Reports

Possible causes:
- Temporary server issue
- Browser cache problem

Solution:
- Refresh the page and try again
- Clear browser cache
- Try a different browser

#### Incorrect Financial Projections

Possible causes:
- Inaccurate component data
- Incorrect starting balance or annual contribution
- Interest rate issues

Solution:
- Review component useful life and remaining life values
- Verify financial inputs
- Check interest calculation settings

## Appendix

### Florida Statute Requirements

Florida Statute 718.112(2)(g) requires the following components to be included in a SIRS:
- Roof
- Structure (including load-bearing walls)
- Fireproofing and fire protection systems
- Plumbing
- Electrical systems
- Waterproofing and exterior painting
- Windows and doors
- Any other item with replacement cost over $10,000

### Glossary of Terms

- **Useful Life (UL)**: Expected total lifespan of a component
- **Remaining Life (RL)**: Estimated years until replacement is needed
- **Fully Funded Balance (FFB)**: Ideal reserve balance based on component age
- **Percent Funded**: Ratio of actual reserve balance to fully funded balance
- **Special Assessment**: One-time assessment for specific projects
- **Straight Line Method**: Each component has its own dedicated reserve
- **Pooled Method**: All components share a common reserve pool

### Contact Support

For technical assistance, please contact:
- Email: support@yourcompany.com
- Phone: (555) 123-4567
- Hours: Monday-Friday, 9:00 AM - 5:00 PM EST
