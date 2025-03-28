import { Routes } from '@angular/router';
import { MesasComponent } from './components/mesas/mesas.component';

export const routes: Routes = [
    {path: '', redirectTo:'mesas', pathMatch: 'full' },
    {path: 'mesas', component: MesasComponent},
    
];
