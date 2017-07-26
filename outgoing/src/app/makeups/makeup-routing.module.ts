import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MakeupHomeComponent } from './makeup-home.component';
import { MakeupsComponent } from './makeups.component';
import { MakeupComponent } from '../makeup/makeup.component';

const routes: Routes = [
    {
        path: 'makeup',
        component: MakeupHomeComponent,
        children: [{
            path: '',
            component: MakeupsComponent,
            children: [{
                path: ':id',
                component: MakeupComponent
            }]
        }]
    }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class MakeupRoutingModule {

}

