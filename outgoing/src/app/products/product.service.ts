import { Injectable } from '@angular/core';
import { Product, PRODUCTS } from './product';

@Injectable()
export class ProductService{
    getMockProductsPromise(): Promise<Product[]>{

        return new Promise<Product[]>((resolve, reject) => {

            setTimeout(function() {
                resolve(PRODUCTS);

            }, 2000);

        });

    }


}
