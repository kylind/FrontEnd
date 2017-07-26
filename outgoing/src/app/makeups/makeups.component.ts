import { Component, OnInit } from '@angular/core';

import { Makeup } from './makeup';
import { MakeupService } from './makeup.service';
import { Observable } from 'rxjs/Observable';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'component-products',
    templateUrl: './makeups.component.html',
    styleUrls: ['./makeups.component.css']
})
export class MakeupsComponent implements OnInit {

    makeups: Makeup[];
    observableMakeups: Observable<Makeup[]>;
    isSpecial: boolean;


    constructor(private makeupService: MakeupService) {
    }

    ngOnInit() {
        // tslint:disable-next-line:max-line-length

    }


    getMakeupsByRxjs(event) {
        const targeName = event.target.name;
        if (targeName === 'const') {
            this.observableMakeups = this.makeupService.getMakeupsByRxjsWithConstData();
            this.isSpecial = false;

        } else {
            this.observableMakeups = this.makeupService.getMakeupsByRxJSWithMockAPI();
            this.isSpecial = true;
        }

    }




}
