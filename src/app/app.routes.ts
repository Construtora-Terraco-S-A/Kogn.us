import { Routes } from '@angular/router';
import { GenerateContent, Home, Register } from './pages';
import { AuthGuard } from './core';
import { NotAuthorized } from './pages/not-authorized/not-authorized.component';

export const routes: Routes = [
    
    // * Rotas Públicas
    {
        path: '',
        component: Home,
        title: 'Home Page'
    },
    {
        path: 'register',
        component: Register,
        title: 'Register'
    },
    {
        path: 'notauthorized',
        component: NotAuthorized,
        title: 'Not Authorized'
    },

    // * Rotas Protegidas
    {
        path: 'generate-content',
        component: GenerateContent,
        title: 'Generate Content',
        canActivate: [AuthGuard]
    },
    // {
    //     path: 'profile',
    //     component: Profile,
    //     title: 'Profile',
    //     canActivate: [AuthGuard]
    // }
];
