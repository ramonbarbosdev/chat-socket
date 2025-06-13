import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat.component/chat.component';

export const routes: Routes = [
    
    {path: 'chat/:userId', component: ChatComponent }
];
