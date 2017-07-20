
import { InMemoryDbService } from 'angular-in-memory-web-api';
export class Product {
    name: string;
    buy: number;
    sell: number;
    des: string;

    constructor(name: string, buy: number, sell: number, des: string) {
        this.name = name;
        this.buy = buy;
        this.sell = sell;
        this.des = des;
    }
}
export const PRODUCTS: Product[] = [{ name: 'Product 1', sell: 10, buy: 20, des: 'this is fantastic.' },
{ name: 'Product 2', sell: 10, buy: 20, des: 'this is fantastic.' },
{ name: 'Product 3', sell: 10, buy: 20, des: 'this is fantastic.' },
{ name: 'product 4', sell: 10, buy: 20, des: 'this is fantastic.' }];


export class InMemoryProductService implements InMemoryDbService {

    createDb() {
        return { PRODUCTS };
    }

}






