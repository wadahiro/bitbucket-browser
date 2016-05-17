import { Settings } from './Settings';
import { baseUrl } from './Utils';

export interface AuthenticationResponse {
    validate: boolean;
}

export type SonarQubeMetrics = SonarQubeMetricsResponse | ErrorResponse;

export interface ErrorResponse {
    err_code: number;
    err_msg: string;
}

export function hasError(response: any): response is ErrorResponse {
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

export async function isAuthenticated(settings: Settings): Promise<boolean> {
    const { resolver } = settings.items.sonarQubeMetrics;

    // SonarQube Bug? It losts authenticated state...
    // const response = await fetch(`${baseUrl(resolver.baseUrl)}/api/authentication/validate`, {
    //     credentials: 'same-origin'
    // });
    // const result: AuthenticationResponse = await response.json();
    // return result.validate;

    const response = await fetch(`${baseUrl(resolver.baseUrl)}/api/user_properties?format=json`, {
        credentials: 'same-origin'
    });
    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}

export async function authenticate(settings: Settings, login: string, password: string): Promise<boolean> {
    const resolver = settings.items.sonarQubeMetrics.resolver;
    const response = await fetch(`${baseUrl(resolver.baseUrl)}/sessions/login`, {
        redirect: 'manual', // for redirect ignore
        credentials: 'same-origin',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}&commit=Log+in`
    })

    return await isAuthenticated(settings);
}

export async function fetchMetricsByKey(settings: Settings, repo: string, branch: string): Promise<SonarQubeMetrics> {
    const sonarBranch = branch.replace('/', '_');
    const resolver = settings.items.sonarQubeMetrics.resolver;

    const response = await fetch(`${baseUrl(resolver.baseUrl)}/api/resources?resource=${resolver.projectBaseKey}.${repo}:${sonarBranch}&metrics=${resolver.metrics}&format=json`, {
        credentials: 'same-origin'
    })

    const json = await response.json();

    if (json.err_code) {
        return json;
    }

    return json[0];
}