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
export interface IExtendedProfile {
    provider: string;
    id: string;
    displayName: string;
    username?: string;
    name?: {
        familyName: string;
        givenName: string;
        middleName?: string;
    };
    emails?: Array<{
        value: string;
        type?: string;
        verified?: boolean;
    }>;
    photos?: Array<{
        value: string;
    }>;
    profileUrl: string;

    _raw: string;
    _json: {
        sub: string;
        name: string;
        given_name: string;
        picture: string;
        email: string;
        email_verified: boolean;
        locale: string;
    };
}