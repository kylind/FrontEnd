import { Component, OnInit } from '@angular/core';

import { Product } from './product';
import { ProductService } from './product.service';
import { Observable } from 'rxjs/Observable';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'component-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: Product[];
    observableProducts: Observable<Product[]>;


    constructor(private productService: ProductService) {
    }

    ngOnInit() {
        // tslint:disable-next-line:max-line-length

    }

    getProductsByPromiseWithMockAPI() {
        this.productService.getProductsByPromiseWithMockAPI().then((products: Product[]) => {
            this.products = products;
        });
    }

    getProductsByPromiseWithConstData() {
        this.productService.getProductsByPromiseWithConstData().then((products: Product[]) => {
            this.products = products;
        });
    }

    getProductsByRxjsWithConstData() {
        this.observableProducts = this.productService.getProductsByRxjsWithConstData();
    }

    getProductsByRxJSWithMockAPI() {
        this.observableProducts = this.productService.getProductsByRxJSWithMockAPI();

    }


}
