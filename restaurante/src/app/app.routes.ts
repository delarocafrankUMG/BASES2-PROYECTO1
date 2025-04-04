import { Routes } from '@angular/router';
import { MesasComponent } from './components/mesas/mesas.component';
import { LoginComponent } from './components/login/login.component';
import { CajaComponent } from './components/caja/caja.component';
import { meseroGuard } from './auth/mesero.guard';
import { cajeroGuard } from './auth/cajero.guard';
import { CocinaComponent } from './components/cocina/cocina.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { adminGuard } from './auth/admin.guard';

export const routes: Routes = [
    {path: '', redirectTo:'login', pathMatch: 'full' },
    {path: 'mesas', component: MesasComponent, canActivate:[meseroGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'cajas', component: CajaComponent, canActivate: [cajeroGuard]},
    {path: 'cocina', component: CocinaComponent, canActivate:[meseroGuard]},
    {path: 'reportes', component: ReportesComponent, canActivate:[adminGuard]}
];
