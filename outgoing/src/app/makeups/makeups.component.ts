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
    isMakeupList: boolean;


    constructor(private makeupService: MakeupService) {
    }

    ngOnInit() {
        // tslint:disable-next-line:max-line-length

    }


    getmakeupsByRxjsWithConstData() {
        this.observableMakeups = this.makeupService.getMakeupsByRxjsWithConstData();
        this.isMakeupList = false;

    }

    getMakeupsByRxJSWithMockAPI() {
        this.observableMakeups = this.makeupService.getMakeupsByRxJSWithMockAPI();
        this.isMakeupList = true;


    }


}
