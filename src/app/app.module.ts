import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './app.component';
import { LeftBarComponent } from './leftbar/leftbar.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, LeftBarComponent],
  imports: [
    BrowserModule, 
    FormsModule, 
    HttpClientModule, 
    SharedModule 
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}