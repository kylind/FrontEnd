import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MAKEUPS, Makeup } from './makeup';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class MakeupService {
    constructor(private http: Http) {

    }

    getMakeupsByRxjsWithConstData(): Observable<Makeup[]> {

        return Observable.of<Makeup[]>(MAKEUPS);

    }

    getMakeupsByRxJSWithMockAPI(): Observable<Makeup[]> {
        const url = 'api/makeups';
        return this.http.get(url).map(response => response.json().data as Makeup[]);
    }


    getMakeupFromAPI(id: number): Observable<Makeup> {

        const url = `api/makeups/${id}`;
        return this.http.get(url).map(response => response.json().data as Makeup);
    }

    getMakeupFromConst(id: number): Observable<Makeup> {

        // tslint:disable-next-line:no-shadowed-variable
        const makeup = MAKEUPS.find(makeup => id === makeup.id);

        return Observable.of(makeup);

    }

}
