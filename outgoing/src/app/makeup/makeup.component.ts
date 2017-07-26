import { Component, OnInit } from '@angular/core';
import { Makeup } from '../makeups/makeup';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MakeupService } from '../makeups/makeup.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-makeup',
  templateUrl: './makeup.component.html',
  styleUrls: ['./makeup.component.css']
})
export class MakeupComponent implements OnInit {

  makeup: Makeup;

  constructor(
    private makeupService: MakeupService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        const isSpecial = params.get('isSpecial');

        if (isSpecial) {
          return this.makeupService.getMakeupFromAPI(+params.get('id'));

        } else {
          return this.makeupService.getMakeupFromConst(+params.get('id'));
        }

      }).subscribe((makeup: Makeup) => {
        this.makeup = makeup;
      });
  }

}
