import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NgHttpLoaderComponent } from 'ng-http-loader';

@Component({
  selector: 'app-root',
  imports: [
		RouterOutlet,
    NgHttpLoaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public loadingSpinner = LoadingSpinnerComponent;
  title = 'download-and-upload-files-demo';
}