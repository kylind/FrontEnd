import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Product, PRODUCTS, PRODUCTS_MARKUP } from './product';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class ProductService {
    constructor(private http: Http) {

    }
    getProductsByPromiseWithConstData(): Promise<Product[]> {

        return new Promise<Product[]>((resolve, reject) => {

            setTimeout(function () {
                resolve(PRODUCTS);

            }, 500);

        });

    }
    getProductsByPromiseWithMockAPI(): Promise<Product[]> {
        const url = 'api/products_markup';
        return this.http.get(url).map(response => response.json().data).toPromise<Product[]>();
    }

    getProductsByRxjsWithConstData(): Observable<Product[]> {

        return Observable.of<Product[]>(PRODUCTS);

    }
    getProductsByRxJSWithMockAPI(): Observable<Product[]> {
        const url = 'api/products_markup';
        return this.http.get(url).map(response => response.json().data as Product[]);
    }


}
