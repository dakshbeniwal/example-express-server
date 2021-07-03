export interface ILoggedInUser {
    "id": number,
    "email": string,
    "firstname": string,
    "lastname": string,
    "username": string
}

export interface ILoggedInAdminUser {
    "id": number,
    "email": string,
    "firstname": string,
    "lastname": string
}

export interface ILoginResponse {
    "success": boolean,
    "data"?: ILoggedInAdminUser | ILoggedInUser,
    "error"?: string
}