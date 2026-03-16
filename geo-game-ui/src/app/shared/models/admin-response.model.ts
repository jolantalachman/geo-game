export interface ActivityApiModel {
    activityType: string;
    activityDateTime: string;
    user: ActivityUserApiModel;
}

export interface ActivityUserApiModel {
    userId: number;
    userEmail: string;
}

export interface ActivityTableData {
    data: ActivityApiModel[];
    totalCount: number;
}

export interface UsersApiModel {
    id: number;
    email: string;
    role: string;
    lastActivity: string;
}

export interface UsersTableData {
    data: UsersApiModel[];
    totalCount: number;
}