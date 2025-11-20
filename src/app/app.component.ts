import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sidebarOpen = false;
  filterType: string = 'showall';

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }   

  onTypeChanged(type: string) {
    this.filterType = type;
  }
}
