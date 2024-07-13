import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NgHttpLoaderModule } from 'ng-http-loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
		RouterOutlet,
    NgHttpLoaderModule, 
    LoadingSpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public loadingSpinner = LoadingSpinnerComponent;
  title = 'download-and-upload-files-demo';
}