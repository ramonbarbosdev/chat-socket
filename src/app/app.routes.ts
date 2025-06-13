import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat.component/chat.component';
import { Principal } from './pages/layout/principal/principal';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/home', pathMatch: 'full' },
  {
    path: 'admin',
    component: Principal,
    canActivateChild: [],
    children: [
      { path: 'home', component: Home },
      { path: 'chat/:userId', component: ChatComponent },
    ],
  },
];
