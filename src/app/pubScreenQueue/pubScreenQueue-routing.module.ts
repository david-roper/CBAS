import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PubScreenQueueComponent } from './pubScreenQueue.component';


const routes: Routes = [
    { path: '', component: PubScreenQueueComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PubScreenQueueRoutingModule { } 
