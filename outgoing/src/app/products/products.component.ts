import { Component, OnInit } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Product } from './product';
import { ProductService } from './product.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'component-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: Product[];


    constructor(private productService: ProductService) {
    }

    ngOnInit() {
        // tslint:disable-next-line:max-line-length

    }

    getMockProductsPromise() {
        this.productService.getMockProductsPromise().then((products: Product[]) => {
            this.products = products;
        });
    }

    getProductsFromMockAPI(){

    }


}
