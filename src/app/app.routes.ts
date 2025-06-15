import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat.component/chat.component';
import { Principal } from './pages/layout/principal/principal';
import { Home } from './pages/home/home';
import { authGuard } from './auth/auth.guard';
import { Login } from './pages/layout/login/login';
import { Register } from './pages/layout/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: 'login', component: Login },
   { path: 'register', component: Register },
  {
    path: 'admin',
    component: Principal,
    canActivateChild: [authGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'chat', component: ChatComponent },
    ],
  },
];
