import { Routes } from '@angular/router';
import { Home, Register } from './pages';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home Page'
    },
    {
        path: 'register',
        component: Register,
        title: 'Register'
    }
];
