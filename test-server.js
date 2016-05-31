var fs = require('fs');
var path = require('path');
var express = require('express');

var app = express();
var COMMENTS_FILE = path.join(__dirname, 'comments.json');
app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));


app.get('/stash/rest/api/1.0/repos', function (req, res) {
    setTimeout(function () {
        res.setHeader('Cache-Control', 'no-cache');
        res.json({
            "size": 2,
            "limit": 25,
            "isLastPage": true,
            "values": [
                {
                    "slug": "test-core",
                    "id": 1,
                    "name": "TEST-core",
                    "scmId": "git",
                    "state": "AVAILABLE",
                    "statusMessage": "Available",
                    "forkable": true,
                    "project": {
                        "key": "PRJ1",
                        "id": 1
                    }
                },
                {
                    "slug": "test-service",
                    "id": 2,
                    "name": "TEST-service",
                    "scmId": "git",
                    "state": "AVAILABLE",
                    "statusMessage": "Available",
                    "forkable": true,
                    "project": {
                        "key": "PRJ2",
                        "id": 2
                    }
                },
                {
                    "slug": "test-utils",
                    "id": 2,
                    "name": "TEST-utils",
                    "scmId": "git",
                    "state": "AVAILABLE",
                    "statusMessage": "Available",
                    "forkable": true,
                    "project": {
                        "key": "PRJ2",
                        "id": 2
                    }
                }
            ]
        });
    }, 0);
});

app.get('/stash/rest/api/1.0/projects', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json({
        "size": 2,
        "limit": 25,
        "isLastPage": false,
        "values": [
            {
                "key": "PRJ1",
                "id": 113,
                "name": "PRJ1",
                "description": "project 1",
                "public": false,
                "type": "NORMAL",
                "link": {
                    "url": "/projects/PRJ1",
                    "rel": "self"
                },
                "links": {
                    "self": [
                        {
                            "href": "http://localhost:7990/stash/projects/PRJ1"
                        }
                    ]
                }
            },
            {
                "key": "PRJ2",
                "id": 28,
                "name": "PRJ2",
                "description": "project 2",
                "public": false,
                "type": "NORMAL",
                "link": {
                    "url": "/projects/PRJ2",
                    "rel": "self"
                },
                "links": {
                    "self": [
                        {
                            "href": "http://localhost:7990/stash/projects/PRJ2"
                        }
                    ]
                }
            }
        ],
        "start": 0,
        "nextPageStart": 25
    });
});

app.get('/stash/rest/api/1.0/projects/PRJ1/repos', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(
        {
            "size": 1,
            "limit": 25,
            "isLastPage": true,
            "values": [
                {
                    "slug": "test-core",
                    "id": 72,
                    "name": "test-core",
                    "project": {
                        "key": "PRJ1",
                    }
                }
            ],
            "start": 0
        }
    );
});

app.get('/stash/rest/api/1.0/projects/PRJ2/repos', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(
        {
            "size": 2,
            "limit": 25,
            "isLastPage": true,
            "values": [
                {
                    "slug": "test-service",
                    "id": 72,
                    "name": "test-service",
                    "scmId": "git",
                    "state": "AVAILABLE",
                    "statusMessage": "Available",
                    "forkable": false,
                    "project": {
                        "key": "PRJ2",
                        "id": 28,
                        "name": "PRJ2",
                        "description": "project 2",
                        "public": false,
                        "type": "NORMAL",
                        "link": {
                            "url": "/projects/PRJ2",
                            "rel": "self"
                        },
                        "links": {
                            "self": [
                                {
                                    "href": "http://localhost:7990/stash/projects/PRJ2"
                                }
                            ]
                        }
                    },
                    "public": false,
                    "link": {
                        "url": "/projects/PRJ2/repos/test-service/browse",
                        "rel": "self"
                    },
                    "cloneUrl": "http://test@localhost:7990/stash/scm/prj2/test-service.git",
                    "links": {
                        "clone": [
                            {
                                "href": "http://test@localhost:7990/stash/scm/prj2/test-service.git",
                                "name": "http"
                            },
                            {
                                "href": "ssh://git@localhost:7999/prj2/test-service.git",
                                "name": "ssh"
                            }
                        ],
                        "self": [
                            {
                                "href": "http://localhost:7990/stash/projects/PRJ2/repos/test-service/browse"
                            }
                        ]
                    }
                },
                {
                    "slug": "test-utils",
                    "id": 11,
                    "name": "test-utils",
                    "scmId": "git",
                    "state": "AVAILABLE",
                    "statusMessage": "Available",
                    "forkable": false,
                    "project": {
                        "key": "PRJ2",
                        "id": 28,
                        "name": "PRJ2",
                        "description": "project 2",
                        "public": false,
                        "type": "NORMAL",
                        "link": {
                            "url": "/projects/PRJ2",
                            "rel": "self"
                        },
                        "links": {
                            "self": [
                                {
                                    "href": "http://localhost:7990/stash/projects/PRJ2"
                                }
                            ]
                        }
                    },
                    "public": false,
                    "link": {
                        "url": "/projects/PRJ2/repos/test-utils/browse",
                        "rel": "self"
                    },
                    "cloneUrl": "http://test@localhost:7990/stash/scm/prj2/test-utils.git",
                    "links": {
                        "clone": [
                            {
                                "href": "http://test@localhost:7990/stash/scm/prj2/test-utils.git",
                                "name": "http"
                            },
                            {
                                "href": "ssh://git@localhost:7999/prj2/test-utils.git",
                                "name": "ssh"
                            }
                        ],
                        "self": [
                            {
                                "href": "http://localhost:7990/stash/projects/PRJ2/repos/test-utils/browse"
                            }
                        ]
                    }
                }
            ],
            "start": 0
        }
    );
});

// get branches api response

app.get('/stash/rest/api/1.0/projects/PRJ1/repos/test-core/branches', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(
        {
            "size": 2,
            "limit": 25,
            "isLastPage": true,
            "values": [
                {
                    "id": "refs/heads/release/v1.0",
                    "displayId": "release/v1.0",
                    "latestChangeset": "ddfa05c0bb2f988f5fd8b8ce0c085fcd5e429190",
                    "latestCommit": "ddfa05c0bb2f988f5fd8b8ce0c085fcd5e429190",
                    "isDefault": true,
                    "metadata": {
                        "com.atlassian.stash.stash-branch-utils:ahead-behind-metadata-provider": {
                            "ahead": 3,
                            "behind": 10
                        },
                        "com.atlassian.stash.stash-branch-utils:latest-changeset-metadata": {
                            "authorTimestamp": 1462784955733,
                            "id": 'ddfa05c0bb2f988f5fd8b8ce0c085fcd5e429190'
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
                            "ahead": 10,
                            "behind": 10
                        },
                        "com.atlassian.stash.stash-branch-utils:latest-changeset-metadata": {
                            "authorTimestamp": 1362784955733,
                            "id": '95f773d9188ca4de6e3d7de0483957f93c279934'
                        }
                    }
                }
            ],
            "start": 0
        }
    );
});

app.get('/stash/rest/api/1.0/projects/PRJ2/repos/test-service/branches', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(
        {
            "size": 5,
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
                            "ahead": 3,
                            "behind": 10
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
                            "ahead": 3,
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
                            "ahead": 3,
                            "behind": 10
                        }
                    }
                }
            ],
            "start": 0
        }
    );
});


app.get('/stash/rest/api/1.0/projects/PRJ2/repos/test-utils/branches', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(
        {
            values: []
        }
    );
});


// Pull request api response

app.get('/stash/rest/api/1.0/projects/PRJ1/repos/test-core/pull-requests', function (req, res) {
    setTimeout(function () {
        res.setHeader('Cache-Control', 'no-cache');
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
                            "id": "refs/heads/release/PRJ1"
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
    }, 0);
});


app.get('/stash/rest/api/1.0/projects/PRJ2/repos/test-service/pull-requests', function (req, res) {
    setTimeout(function () {
        res.setHeader('Cache-Control', 'no-cache');
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
    }, 0);
});

app.get('/stash/rest/api/1.0/projects/PRJ2/repos/test-utils/pull-requests', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(
        {
            values: []
        }
    );
});


// build-status api response

app.get('/stash/rest/build-status/1.0/commits/ddfa05c0bb2f988f5fd8b8ce0c085fcd5e429190', function (req, res) {
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

app.get('/stash/rest/build-status/1.0/commits/95f773d9188ca4de6e3d7de0483957f93c279934', function (req, res) {
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

app.get('/stash/rest/sonar4stash/latest/statistics', function (req, res) {
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