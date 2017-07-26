import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { ProductsComponent } from './products/products.component';
import { ProductService } from './products/product.service';
// tslint:disable-next-line:import-spacing
import { HttpModule } from '@angular/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryProductService } from './products/product';
import { ProductComponent } from './product/product.component';

import { MakeupModule } from './makeups/makeup.module';
import { MakeupService } from './makeups/makeup.service';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    ProductComponent
  ],
  imports: [
    MakeupModule,
    AppRoutingModule,
    BrowserModule,
    HttpModule,
    FormsModule,
    InMemoryWebApiModule.forRoot(InMemoryProductService)

  ],
  bootstrap: [AppComponent],
  providers: [MakeupService, ProductService]
})
export class AppModule { }
 
