
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Makeup } from '../makeups/makeup';
export class Product {
    id: number;
    name: string;
    buy: number;
    sell: number;
    des: string;

    constructor(id: number, name: string, buy: number, sell: number, des: string) {
        this.id = id;
        this.name = name;
        this.buy = buy;
        this.sell = sell;
        this.des = des;
    }
}
export const PRODUCTS_MARKUP: Product[] = [{ id: 1, name: 'Product Markup 1', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 2, name: 'Product Markup 2', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 3, name: 'Product Markup 3', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 4, name: 'Product Markup 4', sell: 10, buy: 20, des: 'this is fantastic.' }];

export const PRODUCTS: Product[] = [{ id: 1, name: 'Product 1', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 2, name: 'Product 2', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 3, name: 'Product 3', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 4, name: 'product 4', sell: 10, buy: 20, des: 'this is fantastic.' }];

export const SPECIAL_MAKEUPS: Makeup[] = [{ id: 1, name: 'Special Markup 1', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 2, name: 'Special Markup 2', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 3, name: 'Special Markup 3', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 4, name: 'Special Markup 4', sell: 10, buy: 20, des: 'this is fantastic.' }];

export const MAKEUPS: Makeup[] = [{ id: 1, name: 'Product Markup 1', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 2, name: 'Product Markup 2', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 3, name: 'Product Markup 3', sell: 10, buy: 20, des: 'this is fantastic.' },
{ id: 4, name: 'Product Markup 4', sell: 10, buy: 20, des: 'this is fantastic.' }];

export class InMemoryProductService implements InMemoryDbService {

    createDb() {
        return { products: PRODUCTS, products_markup: PRODUCTS_MARKUP, makeups: MAKEUPS, special_makeups: SPECIAL_MAKEUPS };
    }

}








