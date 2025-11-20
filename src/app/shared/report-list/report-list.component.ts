import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportService } from '../../service/report.service';
import { Subscription } from 'rxjs';
import { jsPDF } from 'jspdf';
import * as html2canvas from 'html2canvas';


interface SalesRecord {
    "Order ID": string;
    "Date": string;
    "State": string;
    "Region": string;
    "City": string;
    "Company": string;
    "Product": string;
    "Category": string;
    "Quantity": number;
    "Unit Price": number;
    "Total": number;
    "Payment Method": string;
}

interface AnalysisRecord {
  query: string;
  chartData: any | null; 
  filteredRecords: SalesRecord[]; 
}


@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})

export class CustomerReportComponent implements OnInit {

    public showPreview: boolean = false;
    public tableData: SalesRecord[] = []; 
    public loadingData: boolean = true; 
    public queryPrompt: string = '';    
    public basicData: any; 
    public basicOptions: any; 
    public analysisHistory: AnalysisRecord[] = [];
    public showSuggestions: boolean = true; 
    private uiSubscription: Subscription = new Subscription();


    constructor(private reportServiceValues: ReportService) {} 

    ngOnInit(): void {
        this.fetchTableData();
        this.initializeChartOptions(); 

        this.uiSubscription = this.reportServiceValues.showSuggestions$.subscribe(
            (shouldShow: boolean) => {
                this.showSuggestions = shouldShow;                
                if (shouldShow) {                    
                    this.analysisHistory = []; 
                    this.reportServiceValues.updateHistory(this.analysisHistory); 
                }
            }
        );    
    }

    public processQuery(): void {
        const originalQuery = this.queryPrompt;
        const query = originalQuery.toLowerCase().trim();

        if (!query) {
            return; 
        }  
        
        this.showSuggestions = false;
        const uniqueCities = new Set(this.tableData.map(record => record.City.toLowerCase()));
        const uniqueProducts = new Set(this.tableData.map(record => record.Product.toLowerCase()));
    
        const activeCityFilters = Array.from(uniqueCities).filter(city => query.includes(city));
        const activeProductFilters = Array.from(uniqueProducts).filter(product => query.includes(product));

        let filteredResults = this.tableData;

        if (activeCityFilters.length > 0) {
            filteredResults = filteredResults.filter(record => 
                activeCityFilters.some(city => record.City.toLowerCase().includes(city))
            );
        } 
        
        if (activeProductFilters.length > 0) {
            filteredResults = filteredResults.filter(record => 
                activeProductFilters.some(product => record.Product.toLowerCase().includes(product))
            );
        }

        if (activeCityFilters.length === 0 && activeProductFilters.length === 0) {
            filteredResults = filteredResults.filter(record => {
                const queryMatchesCompany = query.includes(record.Company.toLowerCase());
                const queryMatchesCategory = query.includes(record.Category.toLowerCase());
                return queryMatchesCompany || queryMatchesCategory;
            });
        }

        let chartDataForHistory: any | null = null;
        
        if (filteredResults.length > 0 && this.isChartQuery(query)) {
            this.updateChartData(filteredResults);
            chartDataForHistory = this.basicData;
        } 

        const newRecord: AnalysisRecord = {
            query: originalQuery,
            chartData: chartDataForHistory,
            filteredRecords: filteredResults 
        };
        
        this.analysisHistory.push(newRecord);
        this.reportServiceValues.updateHistory(this.analysisHistory);
        this.reportServiceValues.showAnalysisResults();

        if (query.includes('pdf')) {           
            this.generatePdfReport(newRecord);
        }

        this.queryPrompt = ""; 
    }

    private fetchTableData(): void {

        const staticData: SalesRecord[] = [

        {
            "Order ID":"ORD-00001",
            "Date":"2025-01-05",
            "State":"West Bengal",
            "Region":"East",
            "City":"Siliguri",
            "Company":"Mahindra",
            "Product":"Oil",
            "Category":"Grocery",
            "Quantity":2,
            "Unit Price":29165.14,
            "Total":58330.28,
            "Payment Method":"Debit Card"
        },
        {
            "Order ID":"ORD-00002",
            "Date":"2024-08-15",
            "State":"Karnataka",
            "Region":"South",
            "City":"Mangalore",
            "Company":"Reliance",
            "Product":"Shoes",
            "Category":"Clothing",
            "Quantity":7,
            "Unit Price":15877.16,
            "Total":111140.12,
            "Payment Method":"Credit Card"
        },
        {
            "Order ID":"ORD-00003",
            "Date":"2025-02-15",
            "State":"Maharashtra",
            "Region":"West",
            "City":"Pune",
            "Company":"Tata",
            "Product":"Shoes",
            "Category":"Clothing",
            "Quantity":9,
            "Unit Price":8416.15,
            "Total":75745.35,
            "Payment Method":"UPI"
        },
        {
            "Order ID":"ORD-00004",
            "Date":"2024-03-29",
            "State":"Tamil Nadu",
            "Region":"South",
            "City":"Chennai",
            "Company":"Mahindra",
            "Product":"Car",
            "Category":"Automobile",
            "Quantity":6,
            "Unit Price":18772.8,
            "Total":112636.8,
            "Payment Method":"Cash"
        },
        {
            "Order ID":"ORD-00005",
            "Date":"2024-06-08",
            "State":"Tamil Nadu",
            "Region":"South",
            "City":"Chennai",
            "Company":"HCL",
            "Product":"Jacket",
            "Category":"Clothing",
            "Quantity":4,
            "Unit Price":34090.03,
            "Total":136360.12,
            "Payment Method":"UPI"
        },
        {
            "Order ID":"ORD-00006",
            "Date":"2025-01-27",
            "State":"Uttar Pradesh",
            "Region":"North",
            "City":"Varanasi",
            "Company":"Tata",
            "Product":"Tablet",
            "Category":"Electronics",
            "Quantity":8,
            "Unit Price":11252.78,
            "Total":90022.24,
            "Payment Method":"Credit Card"
        },
        {
            "Order ID":"ORD-00007",
            "Date":"2024-07-14",
            "State":"Telangana",
            "Region":"South",
            "City":"Nizamabad",
            "Company":"Wipro",
            "Product":"Helmet",
            "Category":"Automobile",
            "Quantity":4,
            "Unit Price":6018.55,
            "Total":24074.2,
            "Payment Method":"Debit Card"
        },
        {
            "Order ID":"ORD-00008",
            "Date":"2024-06-26",
            "State":"West Bengal",
            "Region":"East",
            "City":"Kolkata",
            "Company":"Adani",
            "Product":"Shirt",
            "Category":"Clothing",
            "Quantity":8,
            "Unit Price":36135.29,
            "Total":289082.32,
            "Payment Method":"Cash"
        },
        {
            "Order ID":"ORD-00009",
            "Date":"2025-07-08",
            "State":"West Bengal",
            "Region":"East",
            "City":"Kolkata",
            "Company":"Tech Mahindra",
            "Product":"Scooter",
            "Category":"Automobile",
            "Quantity":1,
            "Unit Price":6513.46,
            "Total":6513.46,
            "Payment Method":"Credit Card"
        },
        {
            "Order ID":"ORD-00010",
            "Date":"2024-02-03",
            "State":"Gujarat",
            "Region":"West",
            "City":"Vadodara",
            "Company":"Tata",
            "Product":"Oil",
            "Category":"Grocery",
            "Quantity":9,
            "Unit Price":47817.94,
            "Total":430361.46,
            "Payment Method":"Cash"
        },
        {
            "Order ID":"ORD-00011",
            "Date":"2024-03-13",
            "State":"Telangana",
            "Region":"South",
            "City":"Hyderabad",
            "Company":"Adani",
            "Product":"File",
            "Category":"Stationery",
            "Quantity":7,
            "Unit Price":49848.35,
            "Total":348938.45,
            "Payment Method":"Debit Card"
        },
        {
            "Order ID":"ORD-00012",
            "Date":"2025-10-09",
            "State":"Delhi",
            "Region":"North",
            "City":"New Delhi",
            "Company":"HCL",
            "Product":"Tyre",
            "Category":"Automobile",
            "Quantity":1,
            "Unit Price":22039.86,
            "Total":22039.86,
            "Payment Method":"UPI"
        },
        {
            "Order ID":"ORD-00013",
            "Date":"2025-08-10",
            "State":"Maharashtra",
            "Region":"West",
            "City":"Mumbai",
            "Company":"Tata",
            "Product":"Car",
            "Category":"Automobile",
            "Quantity":4,
            "Unit Price":1614.31,
            "Total":6457.24,
            "Payment Method":"Net Banking"
        },
        ];       

        setTimeout(() => {
            this.tableData = staticData;
            this.loadingData = false;
            this.basicData = null;    
        }, 500);
    }

    public togglePreview(): void {
        this.showPreview = !this.showPreview;
    }

    public autofillPrompt(prompt: string): void {
        this.queryPrompt = prompt;        
    }

    // chart
    private initializeChartOptions(): void {
        this.basicOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context: any) {
                            let label = context.dataset.label || 'Sales Value';
                            const actualValue = context.parsed.y;
                            
                            const formatter = new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 0
                            });
                            
                            return `${label}: ${formatter.format(actualValue)}`;
                        }
                    }
                }
            },
            scales: {
                x: {              
                    ticks: {
                        color: '#495057',
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                    }
                },
                y: {
                    ticks: {
                        color: '#495057',                     
                       
                        callback: function(value: number) {                
                            if (value >= 1000000) {
                                return '₹' + (value / 1000000).toFixed(1) + 'M';
                            }
                            if (value >= 1000) {
                                return '₹' + (value / 1000).toFixed(0) + 'K';
                            }
                            return '₹' + value.toFixed(0);
                        }
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
    }

    private updateChartData(data: SalesRecord[]): void {
        const labels: string[] = [];
        const salesTotals: number[] = []; 

        data.forEach(record => {           
            labels.push(`${record.Product} (Order: ${record['Order ID']})`);                 
            salesTotals.push(record.Total); 
        });

        this.basicData = {
            labels: labels,
            datasets: [
                {                  
                    label: 'Total Sales Value (INR)', 
                    backgroundColor: '#3b82f6', 
                    borderColor: '#1d4ed8',
                    data: salesTotals 
                }
            ]
        };
    }

    private isChartQuery(query: string): boolean {     
        const chartKeywords = ['chart', 'graph', 'trend', 'compare', 'summary', 'summarize', 'visualize', 'report', 'sq.ft. rate', 'price', 'pdf'];
        return chartKeywords.some(keyword => query.includes(keyword));
    }

    public async generatePdfReport(record: AnalysisRecord): Promise<void> {
        
        if (record.filteredRecords.length === 0) {
            alert('No data found for this query to generate a PDF.');
            return;
        }

        const doc = new jsPDF('p', 'mm', 'a4');
        let y = 10;
        const padding = 10;
        const pageHeight = 295; 
        
        const html2canvasCallable = ((html2canvas as any).default || html2canvas);

        doc.setFontSize(18);
        doc.text('AI Analysis Report', padding, y);
        y += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Query: ${record.query}`, padding, y);
        y += 10;
        doc.setTextColor(0); 
        
        if (record.chartData) {
    
            const chartElement = document.getElementById('analysisChartContainer'); 
            
            if (chartElement) {
                
                doc.text('Sales Price Analysis (Chart):', padding, y);
                y += 5;
                
                try {               
                    const canvas = await html2canvasCallable(chartElement, { scale: 2 }); 
                    const imgData = canvas.toDataURL('image/png');
                    
                    const imgWidth = 190; 
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    
                    if (y + imgHeight > pageHeight - padding) {
                        doc.addPage();
                        y = padding;
                    }
                    
                    doc.addImage(imgData, 'PNG', padding, y, imgWidth, imgHeight);
                    y += imgHeight + padding; 
                    
                } catch (error) {
                    console.error('Failed to capture chart:', error);             
                }
            }
        }

        const tableElement = document.getElementById('analysisTableContainer');
        if (tableElement) {
            
            doc.text('Filtered Sales Records (Raw Data):', padding, y);
            y += 5;

            try {
                const canvas = await html2canvasCallable(tableElement, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                
                const imgWidth = 190;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                if (y + imgHeight > pageHeight - padding) {
                    doc.addPage();
                    y = padding;
                }
                
                doc.addImage(imgData, 'PNG', padding, y, imgWidth, imgHeight);
                y += imgHeight + padding;
                
            } catch (error) {
                console.error('Failed to capture table:', error);        
                this.addRawDataAsText(doc, record.filteredRecords, y); 
            }
        } else {      
            this.addRawDataAsText(doc, record.filteredRecords, y); 
        }

        const filename = `Report_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(filename);
    }

    private addRawDataAsText(doc: jsPDF, filteredRecords: any[], startY: number): void {
        let y = startY;

        doc.setFontSize(12);
        doc.text('Filtered Sales Records (Text Fallback):', 10, y);
        y += 5;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('ID', 10, y);
        doc.text('Agent', 30, y);
        doc.text('Location', 50, y);
        doc.text('Metrics', 100, y);
        y += 5;
        
        doc.setDrawColor(200);
        doc.line(10, y, 200, y);
        y += 2;
        
        doc.setFont('helvetica', 'normal');
        
        filteredRecords.forEach(record => {
            if (y > 280) { 
                doc.addPage();
                y = 10;
                doc.text('Continued...', 10, y);
                y += 5;
            }

            doc.setFontSize(8);
            doc.text(String(record.recordId), 10, y);
            doc.text(String(record.agentId), 30, y);
            doc.text(record.location, 50, y, { maxWidth: 40 });
            doc.text(record.metrics, 100, y, { maxWidth: 100 });
            
            y += 7; 
        });
    }

    ngOnDestroy(): void {    
        this.uiSubscription.unsubscribe();
    }
}

