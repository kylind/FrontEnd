import { Component, OnInit } from '@angular/core';

import { Product } from './product';
import { ProductService } from './product.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: Product[];
    observableProducts: Observable<Product[]>;
    isMakeupList: boolean;


    constructor(private productService: ProductService) {
    }

    ngOnInit() {
        // tslint:disable-next-line:max-line-length

    }

    getProductsByPromiseWithMockAPI() {
        this.productService.getProductsByPromiseWithMockAPI().then((products: Product[]) => {
            this.products = products;
            this.isMakeupList = true;
        });
    }

    getProductsByPromiseWithConstData() {
        this.productService.getProductsByPromiseWithConstData().then((products: Product[]) => {
            this.products = products;
            this.isMakeupList = false;
        });
    }

    getProductsByRxjsWithConstData() {
        this.observableProducts = this.productService.getProductsByRxjsWithConstData();
        this.isMakeupList = false;

    }

    getProductsByRxJSWithMockAPI() {
        this.observableProducts = this.productService.getProductsByRxJSWithMockAPI();
        this.isMakeupList = true;


    }


}
