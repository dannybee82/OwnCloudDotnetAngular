import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-go-back-button',
  standalone: true,
  imports: [],
  templateUrl: './go-back-button.component.html',
  styleUrl: './go-back-button.component.scss'
})
export class GoBackButtonComponent {

  private router = inject(Router);

  goBack(): void {
    this.router.navigate(['/']);
  }

}