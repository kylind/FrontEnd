import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ProductsComponent } from './products/products.component';
import { ProductService } from './products/product.service';
// tslint:disable-next-line:import-spacing
import { HttpModule } from '@angular/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryProductService } from './products/product';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryProductService)
  ],
  bootstrap: [AppComponent],
  providers: [ProductService]
})
export class AppModule { }
