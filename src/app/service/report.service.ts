import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

interface AnalysisRecord {
    query: string;
    chartData: any | null; 
    filteredRecords: any[];   
}

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  private showSuggestionsSubject = new BehaviorSubject<boolean>(true);  
  public showSuggestions$: Observable<boolean> = this.showSuggestionsSubject.asObservable();    
  
  private analysisHistorySubject = new BehaviorSubject<AnalysisRecord[]>([]);
  public analysisHistory$: Observable<AnalysisRecord[]> = this.analysisHistorySubject.asObservable();     

  constructor() { }
  
  public resetToDefaultView(): void {
    this.showSuggestionsSubject.next(true); 
  }

  public showAnalysisResults(): void {
    this.showSuggestionsSubject.next(false);
  }

  public updateHistory(history: AnalysisRecord[]): void {
    this.analysisHistorySubject.next(history);
  }
}