import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PSDashboardComponent } from './pubScreen-dashboard.component';
//import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
    { path: '', component: PSDashboardComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PSDashboardRoutingModule { }

