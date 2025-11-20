import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerReportComponent } from './report-list/report-list.component';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [CustomerReportComponent],
  imports: [CommonModule,FormsModule,ChartModule],
  exports: [CustomerReportComponent]
})
export class SharedModule {}
