"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');

var contextPath = '/bitbucket';

var app = express();
app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));


function mkProjects(num) {
    const projects = [];
    for (let i = 1; i <= num; i++) {
        projects.push(
            {
                "slug": `test${i}-core`,
                "id": i,
                "name": "TEST-core",
                "project": {
                    "key": `PRJ${i}`,
                    "id": i
                }
            }
        );

        projects.push(
            {
                "slug": `test${i}-service`,
                "id": i,
                "name": "TEST-service",
                "project": {
                    "key": `PRJ${i}`,
                    "id": i
                }
            }
        );

        projects.push(
            {
                "slug": `test${i}-utils`,
                "id": i,
                "name": "TEST-utils",
                "project": {
                    "key": `PRJ${i}`,
                    "id": i
                }
            }
        );
    }
    return projects;
}

const projects = mkProjects(2);

app.get(contextPath + '/rest/api/1.0/repos', function (req, res) {
    setTimeout(function () {

        res.setHeader('Cache-Control', 'no-cache');
        res.json({
            "size": projects.length,
            "limit": 1000,
            "isLastPage": true,
            "values": projects
        });
    }, 0);
});


app.get(contextPath + '/rest/api/1.0/projects', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json({
        "size": 1,
        "limit": 25,
        "isLastPage": false,
        "values": [
            {
                "key": "PRJ1"
            }
        ],
        "start": 0,
        "nextPageStart": 25
    });
});

// get branches api response

app.get(new RegExp(contextPath + '/rest/api/1.0/projects/(.*)/repos/(.*)-(.*)/branches'), function (req, res) {
    const project = req.params[0];
    const repo = req.params[2];

    res.setHeader('Cache-Control', 'no-cache');
    if (repo === 'utils') {
        res.json(
            {
                values: []
            }
        );
    } else {
        res.json(
            {
                "size": 2,
                "limit": 25,
                "isLastPage": true,
                "values": [
                    {
                        "id": "refs/heads/feature/experimental",
                        "displayId": "feature/experimental",
                        "metadata": {
                            "com.atlassian.stash.stash-branch-utils:ahead-behind-metadata-provider": {
                                "ahead": 3,
                                "behind": 10
                            }
                        }
                    },
                    {
                        "id": "refs/heads/release/v1.0",
                        "displayId": "release/v1.0",
                        "latestChangeset": "ddfa05c0bb2f988f5fd8b8ce0c085fcd5e429190",
                        "latestCommit": "ddfa05c0bb2f988f5fd8b8ce0c085fcd5e429190",
                        "isDefault": true,
                        "metadata": {
                            "com.atlassian.stash.stash-branch-utils:ahead-behind-metadata-provider": {
                                "ahead": 5,
                                "behind": 4
                            }
                        }
                    },
                    {
                        "id": "refs/heads/release/v2.0",
                        "displayId": "release/v2.0",
                        "latestChangeset": "adfa05c0bb2f988f5fd8b8ce0c085fcd5e429190",
                        "latestCommit": "adfa05c0bb2f988f5fd8b8ce0c085fcd5e429190",
                        "isDefault": true,
                        "metadata": {
                            "com.atlassian.stash.stash-branch-utils:ahead-behind-metadata-provider": {
                                "ahead": 3,
                                "behind": 1
                            }
                        }
                    },
                    {
                        "id": "refs/heads/release/ISSUE-120",
                        "displayId": "release/ISSUE-120",
                        "latestChangeset": "bdfa05c0bb2f988f5fd8b8ce0c085fcd5e429190",
                        "latestCommit": "bdfa05c0bb2f988f5fd8b8ce0c085fcd5e429190",
                        "isDefault": true,
                        "metadata": {
                            "com.atlassian.stash.stash-branch-utils:ahead-behind-metadata-provider": {
                                "ahead": 10,
                                "behind": 1
                            }
                        }
                    },
                    {
                        "id": "refs/heads/master",
                        "displayId": "master",
                        "latestChangeset": "95f773d9188ca4de6e3d7de0483957f93c279934",
                        "latestCommit": "95f773d9188ca4de6e3d7de0483957f93c279934",
                        "isDefault": false,
                        "metadata": {
                            "com.atlassian.stash.stash-branch-utils:ahead-behind-metadata-provider": {
                                "ahead": 6,
                                "behind": 6
                            }
                        }
                    }
                ],
                "start": 0
            }
        );
    }
});

// Pull request api response

app.get(new RegExp(contextPath + '/rest/api/1.0/projects/(.*)/repos/(.*)-(.*)/pull-requests'), function (req, res) {
    const project = req.params[0];
    const repo = req.params[2];

    setTimeout(function () {
        res.setHeader('Cache-Control', 'no-cache');

        if (repo === 'core') {
            res.json(
                {
                    values: [
                        {
                            "id": 1,
                            "state": "OPEN",
                            "fromRef": {
                                "id": "refs/heads/master"
                            },
                            "toRef": {
                                "id": `refs/heads/release/${project}`
                            }
                        },
                        {
                            "id": 2,
                            "state": "OPEN",
                            "fromRef": {
                                "id": "refs/heads/feature/001"
                            },
                            "toRef": {
                                "id": "refs/heads/master"
                            }
                        },
                        {
                            "id": 3,
                            "state": "OPEN",
                            "fromRef": {
                                "id": "refs/heads/feature/002"
                            },
                            "toRef": {
                                "id": "refs/heads/master"
                            }
                        },
                        {
                            "id": 4,
                            "state": "OPEN",
                            "fromRef": {
                                "id": "refs/heads/feature/003"
                            },
                            "toRef": {
                                "id": "refs/heads/master"
                            }
                        }
                    ]
                }
            );
        } else if (repo === 'service') {
            res.json(
                {
                    values: [
                        {
                            "id": 101,
                            "state": "OPEN",
                            "fromRef": {
                                "id": "refs/heads/release/v1.0",
                                "repository": {
                                    "slug": "test-service",
                                    "name": null,
                                    "project": {
                                        "key": "PRJ2"
                                    }
                                }
                            },
                            "toRef": {
                                "id": "refs/heads/master",
                                "repository": {
                                    "slug": "test-service",
                                    "name": null,
                                    "project": {
                                        "key": "PRJ2"
                                    }
                                }
                            }
                        },
                        {
                            "id": 102,
                            "state": "OPEN",
                            "fromRef": {
                                "id": "refs/heads/release/v1.0",
                                "repository": {
                                    "slug": "test-service",
                                    "name": null,
                                    "project": {
                                        "key": "PRJ2"
                                    }
                                }
                            },
                            "toRef": {
                                "id": "refs/heads/release",
                                "repository": {
                                    "slug": "test-service",
                                    "name": null,
                                    "project": {
                                        "key": "PRJ2"
                                    }
                                }
                            }
                        },
                        {
                            "id": 103,
                            "state": "OPEN",
                            "fromRef": {
                                "id": "refs/heads/master",
                                "repository": {
                                    "slug": "test-service",
                                    "name": null,
                                    "project": {
                                        "key": "PRJ2"
                                    }
                                }
                            },
                            "toRef": {
                                "id": "refs/heads/feature/XYZ",
                                "repository": {
                                    "slug": "test-service",
                                    "name": null,
                                    "project": {
                                        "key": "PRJ2"
                                    }
                                }
                            }
                        },
                        {
                            "id": 104,
                            "state": "OPEN",
                            "fromRef": {
                                "id": "refs/heads/release/v1.0"
                            },
                            "toRef": {
                                "id": "refs/heads/master"
                            }
                        },
                        {
                            "id": 105,
                            "state": "OPEN",
                            "fromRef": {
                                "id": "refs/heads/release/v1.0"
                            },
                            "toRef": {
                                "id": "refs/heads/master"
                            }
                        },
                        {
                            "id": 106,
                            "state": "OPEN",
                            "fromRef": {
                                "id": "refs/heads/release/v1.0"
                            },
                            "toRef": {
                                "id": "refs/heads/master"
                            }
                        }
                    ]
                }
            );

        } else if (repo === 'utils') {
            res.json(
                {
                    values: []
                }
            );
        }

    }, 0);
});


// build-status api response

app.get(contextPath + '/rest/build-status/1.0/commits/ddfa05c0bb2f988f5fd8b8ce0c085fcd5e429190', function (req, res) {
    setTimeout(function () {
        res.setHeader('Cache-Control', 'no-cache');
        res.json({
            values: [
                {
                    state: 'SUCCESSFUL',
                    key: 'key',
                    name: 'name',
                    url: 'url',
                    description: 'desc',
                    dateAdded: 1462784955733
                }
            ]
        });
    }, 0);
});

app.get(contextPath + '/rest/build-status/1.0/commits/95f773d9188ca4de6e3d7de0483957f93c279934', function (req, res) {
    setTimeout(function () {
        res.setHeader('Cache-Control', 'no-cache');
        res.json({
            values: [
                {
                    state: 'SUCCESSFUL',
                    key: 'key1',
                    name: 'name1',
                    url: 'url1',
                    description: 'desc1',
                    dateAdded: 1462784955733
                },
                {
                    state: 'FAILED',
                    key: 'key2',
                    name: 'name2',
                    url: 'url2',
                    description: 'desc2',
                    dateAdded: 1461784955733
                }
            ]
        });
    }, 0);
});


// sonar4stash api response

app.get(contextPath + '/rest/sonar4stash/latest/statistics', function (req, res) {
    setTimeout(function () {
        res.setHeader('Cache-Control', 'no-cache');
        res.json({
            sonarServer: 'sonar.example.org',
            from: {
                name: 'fromBranchName',
                statistics: {
                    componentId: 'test001',
                    dupplicatedLines: 100,
                    coverage: 30,
                    violations: 200,
                    technicalDept: 8
                }
            },
            to: {
                name: 'toBranchName',
                statistics: {
                    componentId: 'test001',
                    dupplicatedLines: 90,
                    coverage: -1,
                    violations: 100,
                    technicalDept: 12
                }
            }
        });
    }, 0);
});


// SonarQube api response

app.post('/sonar/sessions/login', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json({
    });
});

app.get('/sonar/api/user_properties', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json({
    });
});

app.get('/sonar/api/resources', function (req, res) {
    var resource = req.param('resource');
    res.setHeader('Cache-Control', 'no-cache');
    res.json([{
        id: 0,
        key: resource,
        name: resource,
        date: '2016-04-07T19:23:08+0900',
        msr: [
            {
                key: 'lines',
                val: 200,
                frmt_val: '200 lines'
            },
            {
                key: 'blocker_violations',
                val: 3,
                frmt_val: '3'
            },
            {
                key: 'critical_violations',
                val: 5,
                frmt_val: '5'
            }
        ]
    }]);
});


// JIRA api response

app.get('/jira/rest/auth/1/session', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json({
    });
});

app.post('/jira/rest/auth/1/session', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json({
    });
});


app.get('/jira/rest/api/2/issue/:id', function (req, res) {
    var key = req.params.id
    res.setHeader('Cache-Control', 'no-cache');
    res.json({
        id: 0,
        key: key,
        name: key,
        date: '2016-04-07T19:23:08+0900',
        fields: {
            summary: 'Sample issue',
            created: '2016-07-07T18:03:40.000+0900',
            updated: '2016-07-07T20:30:00.000+0900',
            duedate: '2016-08-01',
            status: {
                id: '1',
                name: 'Open',
                description: ''
            }
        }
    });
});


app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

function sleep(time, callback) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {
        ;
    }
    callback();
}