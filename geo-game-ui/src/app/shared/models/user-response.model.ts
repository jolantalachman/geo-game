export interface LoginResponseModel {
    token: string;
    role: string | null;
} 

export interface Score {
    gameDate: string;
    gameTime: string;
    score: string;
}

export interface ScoreChartModel {
    gameDates: string[];
    guessedCountries: number[];
}

export interface UserModel {
    id: number | string;
    email: string;
    role: string;
    nick?: string;
    scores: Score[];
    gamesPlayed?: number;
    averageScore?: number;
    averageTime?: number;
}

export interface GameStatsModel {
    guessedCountries: string;
    time: number;
    gameDate: Date | null;
}

export interface ScoreApiModel {
    guessedCountries: string;
    gameTime: number;
    gameDate?: string;
}

export interface ScoreTableData {
    data: ScoreApiModel[];
    totalCount: number;
}