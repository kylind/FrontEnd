import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MakeupRoutingModule } from './makeup-routing.module';

import { MakeupHomeComponent } from './makeup-home.component';
import { MakeupsComponent } from './makeups.component';
import { MakeupComponent } from '../makeup/makeup.component';
import { MakeupService } from './makeup.service';

import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    MakeupHomeComponent,
    MakeupComponent,
    MakeupsComponent
],
  imports: [
    MakeupRoutingModule,
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  bootstrap: [MakeupHomeComponent],
  providers: [MakeupService]
})
export class MakeupModule { }
