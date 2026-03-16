import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { GameStatsModel, LoginResponseModel, ScoreApiModel, ScoreChartModel, ScoreTableData, UserModel } from "@shared/models";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    // private apiUrl = 'https://localhost:7296';
    private apiUrl = 'https://geo-game-be-acgbgyg5ewgdcmcz.polandcentral-01.azurewebsites.net';

    constructor(private http: HttpClient) {}

    login(idToken: string): Observable<LoginResponseModel> {
        return this.http.post<LoginResponseModel>(`${this.apiUrl}/Account/Login`, { idToken });
    }

    getUserRole(): Observable<{role: string | null}> {
        return this.http.get<{role: string | null}>(`${this.apiUrl}/Account/Role`);
    }

    getUserInfo(): Observable<UserModel> {
        return this.http.get<UserModel>(`${this.apiUrl}/Account/UserInfo`);
    }

    getUserScoreChart(): Observable<ScoreChartModel> {
        return this.http.get<ScoreChartModel>(`${this.apiUrl}/Account/UserScoreChart`);
    }

    getUserScores(pageIndex: number, pageSize: number, sort: Sort): Observable<ScoreTableData> {
        let params: HttpParams = new HttpParams();
        params = params.append('pageIndex', pageIndex.toString());
        params = params.append('pageSize', pageSize.toString());
        if(sort.active !== '' && sort.direction !== '') {
            params = params.append('sortBy', sort.active);
        }
        if(sort.direction !== '') {
            params = params.append('sortDir', sort.direction);
        }
        return this.http.get<ScoreTableData>(`${this.apiUrl}/Account/UserScores`, {params});
    }

    deleteUserScores() {
        return this.http.delete<ScoreTableData>(`${this.apiUrl}/Account/UserScores`);
    }

    deleteUserAccount() {
        return this.http.delete<ScoreTableData>(`${this.apiUrl}/Account/User`);
    }

    saveScore(gameStats: GameStatsModel): Observable<ScoreApiModel> {
        const scoreRequest: ScoreApiModel = {
            guessedCountries: gameStats.guessedCountries,
            gameTime: gameStats.time,
            gameDate: new Date(gameStats.gameDate + 'Z').toISOString(),
        };

        return this.http.post<ScoreApiModel>(`${this.apiUrl}/Account/SaveScore`, scoreRequest);
    }

    saveNick(nick: string) {
        return this.http.patch<boolean>(`${this.apiUrl}/Account/SaveNick`, {nick});
    }

    getRole(): string | null {
        return sessionStorage.getItem('role');
    }

    getToken(): string | null {
        return sessionStorage.getItem('authToken');
    }

    setRole(role: string | null): void {
        sessionStorage.setItem('role', role ?? '');
    }

    setToken(token: string): void {
        sessionStorage.setItem('authToken', token);
    }

    removeStorage(): void {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('role');
    }
}