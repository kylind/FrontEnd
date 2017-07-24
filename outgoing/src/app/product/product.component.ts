import { Component, OnInit } from '@angular/core';
import { Product } from '../products/product';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductService } from '../products/product.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Product;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        const from = params.get('from');

        if (from === 'api') {
          return this.productService.getProductFromAPI(+params.get('id'));

        } else {
          return this.productService.getProductFromConst(+params.get('id'));
        }

      }).subscribe((product: Product) => {
        this.product = product;
      });
  }

}
