import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './app/auth/token-interceptor.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideHttpClient( withInterceptors([TokenInterceptor])),
    provideRouter(routes),
   
    ...appConfig.providers
  ]
}).catch(err => console.error(err));