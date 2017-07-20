import { Component, OnInit } from '@angular/core';
import { Product } from './product';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'component-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: Product[];


    constructor() {
    }

    ngOnInit() {
        // tslint:disable-next-line:max-line-length
        this.products = [{ name: 'product1', sell: 10, buy: 20, des: 'this is fantastic.' },
         { name: 'product1', sell: 10, buy: 20, des: 'this is fantastic.' },
         { name: 'product1', sell: 10, buy: 20, des: 'this is fantastic.' },
         { name: 'product1', sell: 10, buy: 20, des: 'this is fantastic.' }];
    }

}
