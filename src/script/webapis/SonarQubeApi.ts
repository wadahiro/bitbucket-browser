import { Settings } from '../Settings';

export interface AuthenticationResponse {
    validate: boolean;
}

export interface ErrorResponse {
    err_code: number;
    err_msg: string;
}

export function isErrorResponse(response: any): response is ErrorResponse {
    return typeof response.err_code === 'number';
}

export interface SonarQubeMetricsResponse {
    id: number;
    key: string; // <sonar project base key>:<sonar-branch>
    name: string;
    scope: string;
    qualifier: string;
    date: string; // 2016-04-07T19:23:08+0900
    creationDate: string; // 2016-04-07T19:23:08+0900
    lname: string;
    version: string;
    description: string;
    msr: Metric[]
}

export interface Metric {
    key: string; // lines, violations, ...
    val: number;
    frmt_val: string;
}

interface SonarQubeApiOptions {
    baseUrl: string;
}

export class SonarQubeApi {
    baseUrl: string;
    
    constructor(options) {
        this.baseUrl = trimSlash(options.baseUrl);
    }

    async isAuthenticated(): Promise<boolean> {
        // SonarQube Bug? It losts authenticated state...
        // const response = await fetch(`${baseUrl(resolver.baseUrl)}/api/authentication/validate`, {
        //     credentials: 'same-origin'
        // });
        // const result: AuthenticationResponse = await response.json();
        // return result.validate;

        const response = await fetch(`${this.baseUrl}/api/user_properties?format=json`, {
            credentials: 'same-origin'
        });

        try {
            if (response.status === 200) {
                await response.json();
                return true;
            }
        } catch (e) {
            console.warn('Sonar access error.', e);
        }
        return false;
    }

    async authenticate(loginId: string, password: string): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/sessions/login`, {
            redirect: 'manual', // for redirect ignore
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `login=${encodeURIComponent(loginId)}&password=${encodeURIComponent(password)}&commit=Log+in`
        });

        return await this.isAuthenticated();
    }

    async fetchMetricsByKey(projectKey: string, sonarBranch: string, metrics: string): Promise<SonarQubeMetricsResponse> {
        const response = await fetch(`${this.baseUrl}/api/resources?resource=${projectKey}:${sonarBranch}&metrics=${metrics}&format=json`, {
            credentials: 'same-origin'
        })

        const json: SonarQubeMetricsResponse | ErrorResponse = await response.json();

        // return 404 if the project isn't be found
        if (isErrorResponse(json)) {
            throw json;
        }

        return json[0];
    }
}

function trimSlash(url: string) {
    const last = url.substring(url.length - 1);
    if (last === '/') {
        return url.substring(0, url.length - 1)
    }
    return url;
}