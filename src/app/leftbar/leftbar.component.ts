import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ReportService } from '../service/report.service';
import { Subscription } from 'rxjs';


interface AnalysisRecord {
  query: string;
  chartData: any | null; 
  filteredRecords: any[]; 
}

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.css']
})

export class LeftBarComponent {

  selectedType: string = 'showall';
  public isSidebarOpen: boolean = true; 
  @Output() typeChanged = new EventEmitter<string>();
  @Output() closeSidebar = new EventEmitter<void>();     
  @Input() history: AnalysisRecord[] = []; 
  @Output() analysisSelected = new EventEmitter<AnalysisRecord>();
  private historySubscription: Subscription = new Subscription();

  constructor(private reportServiceValues: ReportService) {}

  ngOnInit(): void {      
    this.historySubscription = this.reportServiceValues.analysisHistory$.subscribe(
        (history: AnalysisRecord[]) => {
            this.history = history;
        }
    );
  }

  handleTypeChange(type: string) {
    this.selectedType = type;
    this.typeChanged.emit(type); 
       this.closeSidebar.emit(); 
  }
  
  public loadAnalysis(record: AnalysisRecord): void {     
    this.analysisSelected.emit(record);
    this.reportServiceValues.showAnalysisResults(); 
    this.closeSidebar.emit();
  } 

  public toggleSidebar(): void {
      this.isSidebarOpen = !this.isSidebarOpen;
  }

  startNewChat(): void {
    this.reportServiceValues.resetToDefaultView();   
    this.closeSidebar.emit();
  }

  ngOnDestroy(): void {
      this.historySubscription.unsubscribe();
  }
}
