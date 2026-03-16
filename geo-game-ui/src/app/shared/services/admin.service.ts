import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { ActivityTableData, UsersTableData } from "@shared/models";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class AdminService {
    // private apiUrl = 'https://localhost:7296';
    private apiUrl = 'https://geo-game-be-acgbgyg5ewgdcmcz.polandcentral-01.azurewebsites.net';

    constructor(private http: HttpClient) {}

    getActivities(pageIndex: number, pageSize: number, sort: Sort): Observable<ActivityTableData> {
        let params: HttpParams = new HttpParams();
        params = params.append('pageIndex', pageIndex.toString());
        params = params.append('pageSize', pageSize.toString());
        if(sort.active !== '' && sort.direction !== '') {
            params = params.append('sortBy', sort.active);
        }
        if(sort.direction !== '') {
            params = params.append('sortDir', sort.direction);
        }
        return this.http.get<ActivityTableData>(`${this.apiUrl}/Admin/ActivityLog`, {params});
    }

    getUsers(pageIndex: number, pageSize: number, sort: Sort): Observable<UsersTableData> {
        let params: HttpParams = new HttpParams();
        params = params.append('pageIndex', pageIndex.toString());
        params = params.append('pageSize', pageSize.toString());
        if(sort.active !== '' && sort.direction !== '') {
            params = params.append('sortBy', sort.active);
        }
        if(sort.direction !== '') {
            params = params.append('sortDir', sort.direction);
        }
        return this.http.get<UsersTableData>(`${this.apiUrl}/Admin/Users`, {params});
    }

    deleteUser(id: number) {
        let params: HttpParams = new HttpParams();
        params = params.append('id', id);
        return this.http.delete(`${this.apiUrl}/Admin/User`, {params});
    }
}