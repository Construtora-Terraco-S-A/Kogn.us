import { Routes } from '@angular/router';
import { 
    Home,
    Register,
    GenerateContent,
    VerifyEmailComponent,
    LoginComponent
} from './pages';
import { AuthGuard } from './core';
import { NotAuthorized } from './pages/not-authorized/not-authorized.component';
import { Settings } from './pages/settings';

export const routes: Routes = [
    
    // * Rotas Públicas
    {
        path: '',
        component: Home,
        title: 'Explorar'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
    },
    {
        path: 'register',
        component: Register,
        title: 'Registro'
    },
    {
        path: 'email/verificar',
        component: VerifyEmailComponent,
        title: 'Verificar E-mail'
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
        title: 'Gerar Conteúdo',
        canActivate: [AuthGuard]
    },
    {
        path: 'settings',
        component: Settings,
        title: 'Configurações',
        canActivate: [AuthGuard]
    }
];
