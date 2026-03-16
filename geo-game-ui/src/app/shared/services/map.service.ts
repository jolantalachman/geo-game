import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CountriesData } from "@shared/models";

@Injectable({
    providedIn: 'root',
})
export class MapService {

    constructor(private http: HttpClient) {}

    getMap(): Observable<CountriesData> {
        return this.http.get<CountriesData>('assets/countries.geo.json');
    }
}