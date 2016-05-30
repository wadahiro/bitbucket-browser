# Bitbucket Browser

- [About](#about)
- [Settings](#settings)
- [Development](#development)
 - [Requirements](#requirements)
 - [Setup](#setup)
 - [Run with development mode](#run-with-development-mode)
 - [Release Build](#release-build)
- [License](#license)

## About

**Bitbucket Browser** is a Viewer for [Atlassian Bitbucket (formerly Stash)](https://bitbucket.org/).

## Settings

1. Rename `settings.json.sample` file to `settings.json`.
2. Edit `settings.json`. You can customize the column's displayName and enabled options.

```
{
    "title": "Bitbucket Browser",
    "baseUrl": "/bitbucket",
    "debug": false,
    "items": {
        "project": {
            "displayName": "Project"
        },
        "repo": {
            "displayName": "Repository"
        },
        "branch": {
            "displayName": "Branch"
        },
        "branchAuthor": {
            "enabled": true,
            "displayName": "Branch Author"
        },
        "branchCreated": {
            "enabled": true,
            "displayName": "Branch Created"
        },
        "latestCommitDate": {
            "enabled": true,
            "displayName": "Updated"
        },
        "behindAheadBranch": {
            "enabled": true,
            "displayName": "Behind/Ahead Branch"
        },
        "pullRequestStatus": {
            "enabled": true,
            "displayName": "Pull Request Status"
        },
        "buildStatus": {
            "enabled": true,
            "displayName": "Build Status"
        },
        "sonarForBitbucketStatus": {
            "enabled": false,
            "displayName": "Sonar for Stash Metric"
        },
        "sonarQubeMetrics": {
            "enabled": false,
            "displayName": "SonarQube Metrics",
            "resolver": {
                "baseUrl": "/sonar",
                "projectBaseKey": "foo.bar",
                "metrics": "lines,blocker_violations,critical_violations"
            }
        },
        "branchNameLink": {
            "enabled": true,
            "displayName": "JIRA Ticket",
            "resolver": {
                "pattern": "ISSUE\\-[0-9]+",
                "baseUrl": "http://jira.example.org/browse",
                "displayName": "JIRA Ticket"
            }
        }
    }
}
```

## Development

### Requirements 

* [Node.js](https://nodejs.org/)

### Setup

1. Install JavaScript dependencies.

 ```bash
npm install
 ```

### Run with development mode

1. Run dummy bitbucket server for development.

 ```bash
npm run server
 ```

2. Run webpack dev server.

 ```bash
npm start
 ```
 
3. Open http://localhost:9000

### Release Build

Run webpack with production mode. All you have to do is run `npm run build`. The artifacts are created under `./public` directory.

```bash
npm run build
```

## License

Licensed under the [MIT](/LICENSE.txt) license.
