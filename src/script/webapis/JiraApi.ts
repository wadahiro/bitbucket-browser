import { Settings } from '../Settings';

export interface ErrorResponse {
    errorMessages: string[];
    errors: any;
    status: number; // Add for handling
    key: string; // Add for handling
}

export function isErrorResponse(response: any): response is ErrorResponse {
    return response && typeof response.errorMessages === 'object';
}

interface JiraUser {
    key: string;
    name: string;
    displayName: string;
    self: string;
    active: boolean;
    timeZone: string;
}

interface JiraProject {
    id: string;
    key: string;
    name: string;
    self: string;
    projectCategory: {
        id: string;
        name: string;
        description: string;
        self: string;
    }
}

export interface JiraIssueResponse {
    id: number;
    key: string;
    self: string;
    expand: string;
    fields: {
        assignee: JiraUser;
        issueType: {
            id: string;
            name: string;
            description: string;
        }
        status: {
            id: string;
            name: string;
            description: string;
        }
        creator: JiraUser;
        reporter: JiraUser;
        project: JiraProject;
        created: string; // 2016-07-07T18:03:40.000+0900
        updated: string; // 2016-07-07T18:03:40.000+0900
        description: string;
        summary: string;
        priority: {
            id: string;
            name: string;
            self: string;
        }
    }
}

interface JiraApiOptions {
    baseUrl: string;
    fields: string[];
}

export class JiraApi {
    fields: string[];
    baseUrl: string;

    constructor(options: JiraApiOptions) {
        this.fields = options.fields;
        this.baseUrl = trimSlash(options.baseUrl);
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/rest/auth/1/session`, {
                credentials: 'same-origin'
            });

            if (response.status === 200) {
                await response.json();
                return true;
            }
        } catch (e) {
            console.warn('JIRA access error.', e);
        }
        return false;
    }

    async authenticate(loginId: string, password: string): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/rest/auth/1/session`, {
            credentials: 'same-origin',
            headers: {
                'Authorization': `Basic ${new Buffer(`${loginId}:${password}`).toString('base64')}`
            }
        });

        return await this.isAuthenticated();
    }

    async fetchIssue(issueId: string): Promise<JiraIssueResponse> {
        const response = await fetch(`${this.baseUrl}/rest/api/2/issue/${issueId}?fields=${this.fields.join(',')}created,updated,summary,status`, {
            credentials: 'same-origin'
        })

        const json: JiraIssueResponse | ErrorResponse = await response.json();

        if (isErrorResponse(json)) {
            // Add error status here
            json.status = response.status;
            json.key = issueId;
            throw json;
        }

        return json;
    }
}

function trimSlash(url: string) {
    const last = url.substring(url.length - 1);
    if (last === '/') {
        return url.substring(0, url.length - 1)
    }
    return url;
}