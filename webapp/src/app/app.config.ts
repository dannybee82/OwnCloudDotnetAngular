import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { pendingRequestsInterceptor$ } from 'ng-http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
		provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimations(), 
    provideHttpClient(
      withInterceptors([pendingRequestsInterceptor$]),
      withInterceptorsFromDi()
    ),
    importProvidersFrom([ToastrModule.forRoot({ positionClass: 'toast-bottom-center' })])
  ]
};