/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Cloud_MonitorController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Cloud_Monitor, CheckboxGroup, DataCenter,urlParamsTrnasfer){

        $scope.$on('$viewContentLoaded', function(){
            Metronic.initAjax();
            
        });
       
        $scope.cloud_monitors = [];
        //
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.cloud_monitors);
        //初始化数据
        var _data = {
                "adfadfa": {
                    "cloud_id": "d6bf3768-0a6d-4fde-ace2-f8f0124c2577",
                    "disk_data": {
                        "hour_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        9
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "write_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "write_total",
                                    0
                                ]
                            }
                        ],
                        "type": "disk",
                        "day_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "read_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "read_total",
                                    0
                                ]
                            }
                        ]
                    },
                    "host": "libertyall",
                    "cpu_data": {
                        "hour_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ]
                        ],
                        "param_02": [
                            "frequency",
                            "3.4kHz"
                        ],
                        "type": "CPU",
                        "day_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ],
                            [
                                6,
                                0
                            ],
                            [
                                7,
                                0
                            ],
                            [
                                8,
                                0
                            ],
                            [
                                9,
                                0
                            ],
                            [
                                10,
                                0
                            ],
                            [
                                11,
                                0
                            ],
                            [
                                12,
                                0
                            ],
                            [
                                13,
                                0
                            ],
                            [
                                14,
                                0
                            ],
                            [
                                15,
                                0
                            ],
                            [
                                16,
                                0
                            ],
                            [
                                17,
                                0
                            ],
                            [
                                18,
                                0
                            ],
                            [
                                19,
                                0
                            ],
                            [
                                20,
                                0
                            ],
                            [
                                21,
                                0
                            ],
                            [
                                22,
                                0
                            ],
                            [
                                23,
                                0
                            ]
                        ],
                        "param_01": [
                            "kernal_nums",
                            "9"
                        ]
                    },
                    "network_data": {
                        "hour_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            }
                        ],
                        "type": "network",
                        "day_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "ADSL_UP",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_UP",
                                    0
                                ]
                            }
                        ]
                    },
                    "run_time": "1318:2:18"
                },
                "dasdfadf": {
                    "cloud_id": "6e43e360-7752-4292-aa68-4db27d05709a",
                    "disk_data": {
                        "hour_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "write_total",
                                    10
                                ]
                            },
                            {
                                "day": [
                                    "write_total",
                                    0
                                ]
                            }
                        ],
                        "type": "disk",
                        "day_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "read_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "read_total",
                                    0
                                ]
                            }
                        ]
                    },
                    "host": "libertyall",
                    "cpu_data": {
                        "hour_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ]
                        ],
                        "param_02": [
                            "frequency",
                            "3.4kHz"
                        ],
                        "type": "CPU",
                        "day_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ],
                            [
                                6,
                                0
                            ],
                            [
                                7,
                                0
                            ],
                            [
                                8,
                                0
                            ],
                            [
                                9,
                                0
                            ],
                            [
                                10,
                                0
                            ],
                            [
                                11,
                                0
                            ],
                            [
                                12,
                                0
                            ],
                            [
                                13,
                                0
                            ],
                            [
                                14,
                                0
                            ],
                            [
                                15,
                                0
                            ],
                            [
                                16,
                                0
                            ],
                            [
                                17,
                                0
                            ],
                            [
                                18,
                                0
                            ],
                            [
                                19,
                                0
                            ],
                            [
                                20,
                                0
                            ],
                            [
                                21,
                                0
                            ],
                            [
                                22,
                                0
                            ],
                            [
                                23,
                                0
                            ]
                        ],
                        "param_01": [
                            "kernal_nums",
                            "18"
                        ]
                    },
                    "network_data": {
                        "hour_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            }
                        ],
                        "type": "network",
                        "day_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "ADSL_UP",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_UP",
                                    0
                                ]
                            }
                        ]
                    },
                    "run_time": "1318:42:2"
                },
                "afadfa": {
                    "cloud_id": "f99e5e71-7d04-4f3b-87ee-d3bc64e7c3ff",
                    "disk_data": {
                        "hour_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "write_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "write_total",
                                    0
                                ]
                            }
                        ],
                        "type": "disk",
                        "day_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "read_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "read_total",
                                    0
                                ]
                            }
                        ]
                    },
                    "host": "libertyall",
                    "cpu_data": {
                        "hour_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ]
                        ],
                        "param_02": [
                            "frequency",
                            "3.4kHz"
                        ],
                        "type": "CPU",
                        "day_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ],
                            [
                                6,
                                0
                            ],
                            [
                                7,
                                0
                            ],
                            [
                                8,
                                0
                            ],
                            [
                                9,
                                0
                            ],
                            [
                                10,
                                0
                            ],
                            [
                                11,
                                0
                            ],
                            [
                                12,
                                0
                            ],
                            [
                                13,
                                0
                            ],
                            [
                                14,
                                0
                            ],
                            [
                                15,
                                0
                            ],
                            [
                                16,
                                0
                            ],
                            [
                                17,
                                0
                            ],
                            [
                                18,
                                0
                            ],
                            [
                                19,
                                0
                            ],
                            [
                                20,
                                0
                            ],
                            [
                                21,
                                0
                            ],
                            [
                                22,
                                0
                            ],
                            [
                                23,
                                0
                            ]
                        ],
                        "param_01": [
                            "kernal_nums",
                            "1"
                        ]
                    },
                    "network_data": {
                        "hour_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            }
                        ],
                        "type": "network",
                        "day_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "ADSL_UP",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_UP",
                                    0
                                ]
                            }
                        ]
                    },
                    "run_time": "1317:47:54"
                },
                "yvcddd": {
                    "cloud_id": "e0b742d9-e3d4-455c-8e5a-ee5521033ee9",
                    "disk_data": {
                        "hour_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "write_total",
                                    20
                                ]
                            },
                            {
                                "day": [
                                    "write_total",
                                    0
                                ]
                            }
                        ],
                        "type": "disk",
                        "day_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "read_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "read_total",
                                    0
                                ]
                            }
                        ]
                    },
                    "host": "libertyall",
                    "cpu_data": {
                        "hour_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ]
                        ],
                        "param_02": [
                            "frequency",
                            "3.4kHz"
                        ],
                        "type": "CPU",
                        "day_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ],
                            [
                                6,
                                0
                            ],
                            [
                                7,
                                0
                            ],
                            [
                                8,
                                0
                            ],
                            [
                                9,
                                0
                            ],
                            [
                                10,
                                0
                            ],
                            [
                                11,
                                0
                            ],
                            [
                                12,
                                0
                            ],
                            [
                                13,
                                0
                            ],
                            [
                                14,
                                0
                            ],
                            [
                                15,
                                0
                            ],
                            [
                                16,
                                0
                            ],
                            [
                                17,
                                0
                            ],
                            [
                                18,
                                0
                            ],
                            [
                                19,
                                0
                            ],
                            [
                                20,
                                0
                            ],
                            [
                                21,
                                0
                            ],
                            [
                                22,
                                0
                            ],
                            [
                                23,
                                0
                            ]
                        ],
                        "param_01": [
                            "kernal_nums",
                            "1"
                        ]
                    },
                    "network_data": {
                        "hour_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "ADSL_DOWN",
                                    10
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_DOWN",
                                    20
                                ]
                            }
                        ],
                        "type": "network",
                        "day_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "ADSL_UP",
                                    40
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_UP",
                                    90
                                ]
                            }
                        ]
                    },
                    "run_time": "1319:52:29"
                },
                "ydd1121": {
                    "cloud_id": "6448d6eb-360c-4049-8cbb-40113ead635f",
                    "disk_data": {
                        "hour_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "write_total",
                                    30
                                ]
                            },
                            {
                                "day": [
                                    "write_total",
                                    40
                                ]
                            }
                        ],
                        "type": "disk",
                        "day_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "read_total",
                                    10
                                ]
                            },
                            {
                                "day": [
                                    "read_total",
                                    60
                                ]
                            }
                        ]
                    },
                    "host": "libertyall",
                    "cpu_data": {
                        "hour_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ]
                        ],
                        "param_02": [
                            "frequency",
                            "3.4kHz"
                        ],
                        "type": "CPU",
                        "day_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ],
                            [
                                6,
                                0
                            ],
                            [
                                7,
                                0
                            ],
                            [
                                8,
                                0
                            ],
                            [
                                9,
                                0
                            ],
                            [
                                10,
                                0
                            ],
                            [
                                11,
                                0
                            ],
                            [
                                12,
                                0
                            ],
                            [
                                13,
                                0
                            ],
                            [
                                14,
                                0
                            ],
                            [
                                15,
                                0
                            ],
                            [
                                16,
                                0
                            ],
                            [
                                17,
                                0
                            ],
                            [
                                18,
                                0
                            ],
                            [
                                19,
                                0
                            ],
                            [
                                20,
                                0
                            ],
                            [
                                21,
                                0
                            ],
                            [
                                22,
                                0
                            ],
                            [
                                23,
                                0
                            ]
                        ],
                        "param_01": [
                            "kernal_nums",
                            "1"
                        ]
                    },
                    "network_data": {
                        "hour_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            }
                        ],
                        "type": "network",
                        "day_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "ADSL_UP",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_UP",
                                    0
                                ]
                            }
                        ]
                    },
                    "run_time": "1322:36:15"
                },
                "gfsfgafda": {
                    "cloud_id": "85edcd7c-da59-4968-b122-808716d28934",
                    "disk_data": {
                        "hour_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "write_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "write_total",
                                    0
                                ]
                            }
                        ],
                        "type": "disk",
                        "day_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "read_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "read_total",
                                    0
                                ]
                            }
                        ]
                    },
                    "host": "libertyall",
                    "cpu_data": {
                        "hour_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ]
                        ],
                        "param_02": [
                            "frequency",
                            "3.4kHz"
                        ],
                        "type": "CPU",
                        "day_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ],
                            [
                                6,
                                0
                            ],
                            [
                                7,
                                0
                            ],
                            [
                                8,
                                0
                            ],
                            [
                                9,
                                0
                            ],
                            [
                                10,
                                0
                            ],
                            [
                                11,
                                0
                            ],
                            [
                                12,
                                0
                            ],
                            [
                                13,
                                0
                            ],
                            [
                                14,
                                0
                            ],
                            [
                                15,
                                0
                            ],
                            [
                                16,
                                0
                            ],
                            [
                                17,
                                0
                            ],
                            [
                                18,
                                0
                            ],
                            [
                                19,
                                0
                            ],
                            [
                                20,
                                0
                            ],
                            [
                                21,
                                0
                            ],
                            [
                                22,
                                0
                            ],
                            [
                                23,
                                0
                            ]
                        ],
                        "param_01": [
                            "kernal_nums",
                            "1"
                        ]
                    },
                    "network_data": {
                        "hour_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            }
                        ],
                        "type": "network",
                        "day_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "ADSL_UP",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_UP",
                                    0
                                ]
                            }
                        ]
                    },
                    "run_time": "1322:4:4"
                },
                "dafda": {
                    "cloud_id": "2d09fa85-a568-469d-aca9-89eef2973988",
                    "disk_data": {
                        "hour_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "write_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "write_total",
                                    20
                                ]
                            }
                        ],
                        "type": "disk",
                        "day_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "read_total",
                                    30
                                ]
                            },
                            {
                                "day": [
                                    "read_total",
                                    50
                                ]
                            }
                        ]
                    },
                    "host": "libertyall",
                    "cpu_data": {
                        "hour_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ]
                        ],
                        "param_02": [
                            "frequency",
                            "3.4kHz"
                        ],
                        "type": "CPU",
                        "day_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ],
                            [
                                6,
                                0
                            ],
                            [
                                7,
                                0
                            ],
                            [
                                8,
                                0
                            ],
                            [
                                9,
                                0
                            ],
                            [
                                10,
                                0
                            ],
                            [
                                11,
                                0
                            ],
                            [
                                12,
                                0
                            ],
                            [
                                13,
                                0
                            ],
                            [
                                14,
                                0
                            ],
                            [
                                15,
                                0
                            ],
                            [
                                16,
                                0
                            ],
                            [
                                17,
                                0
                            ],
                            [
                                18,
                                0
                            ],
                            [
                                19,
                                0
                            ],
                            [
                                20,
                                0
                            ],
                            [
                                21,
                                0
                            ],
                            [
                                22,
                                0
                            ],
                            [
                                23,
                                0
                            ]
                        ],
                        "param_01": [
                            "kernal_nums",
                            "1"
                        ]
                    },
                    "network_data": {
                        "hour_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            }
                        ],
                        "type": "network",
                        "day_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "ADSL_UP",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_UP",
                                    0
                                ]
                            }
                        ]
                    },
                    "run_time": "137:51:37"
                },
                "test": {
                    "cloud_id": "cf00a263-2529-433d-9bf3-e84400b0d788",
                    "disk_data": {
                        "hour_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "write_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "write_total",
                                    0
                                ]
                            }
                        ],
                        "type": "disk",
                        "day_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "read_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "read_total",
                                    0
                                ]
                            }
                        ]
                    },
                    "host": "libertyall",
                    "cpu_data": {
                        "hour_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ]
                        ],
                        "param_02": [
                            "frequency",
                            "3.4kHz"
                        ],
                        "type": "CPU",
                        "day_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ],
                            [
                                6,
                                0
                            ],
                            [
                                7,
                                0
                            ],
                            [
                                8,
                                0
                            ],
                            [
                                9,
                                0
                            ],
                            [
                                10,
                                0
                            ],
                            [
                                11,
                                0
                            ],
                            [
                                12,
                                0
                            ],
                            [
                                13,
                                0
                            ],
                            [
                                14,
                                0
                            ],
                            [
                                15,
                                0
                            ],
                            [
                                16,
                                0
                            ],
                            [
                                17,
                                0
                            ],
                            [
                                18,
                                0
                            ],
                            [
                                19,
                                0
                            ],
                            [
                                20,
                                0
                            ],
                            [
                                21,
                                0
                            ],
                            [
                                22,
                                0
                            ],
                            [
                                23,
                                0
                            ]
                        ],
                        "param_01": [
                            "kernal_nums",
                            "1"
                        ]
                    },
                    "network_data": {
                        "hour_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            }
                        ],
                        "type": "network",
                        "day_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "ADSL_UP",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_UP",
                                    0
                                ]
                            }
                        ]
                    },
                    "run_time": "128:41:12"
                },
                "fadfadfa": {
                    "cloud_id": "561e83b6-ae35-44ad-b366-9ac963482776",
                    "disk_data": {
                        "hour_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "write_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "write_total",
                                    0
                                ]
                            }
                        ],
                        "type": "disk",
                        "day_data": [
                            {
                                "read_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "write_data": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "read_total",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "read_total",
                                    0
                                ]
                            }
                        ]
                    },
                    "host": "libertyall",
                    "cpu_data": {
                        "hour_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ]
                        ],
                        "param_02": [
                            "frequency",
                            "3.4kHz"
                        ],
                        "type": "CPU",
                        "day_data": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                0
                            ],
                            [
                                2,
                                0
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ],
                            [
                                6,
                                0
                            ],
                            [
                                7,
                                0
                            ],
                            [
                                8,
                                0
                            ],
                            [
                                9,
                                0
                            ],
                            [
                                10,
                                0
                            ],
                            [
                                11,
                                0
                            ],
                            [
                                12,
                                0
                            ],
                            [
                                13,
                                0
                            ],
                            [
                                14,
                                0
                            ],
                            [
                                15,
                                0
                            ],
                            [
                                16,
                                0
                            ],
                            [
                                17,
                                0
                            ],
                            [
                                18,
                                0
                            ],
                            [
                                19,
                                0
                            ],
                            [
                                20,
                                0
                            ],
                            [
                                21,
                                0
                            ],
                            [
                                22,
                                0
                            ],
                            [
                                23,
                                0
                            ]
                        ],
                        "param_01": [
                            "kernal_nums",
                            "1"
                        ]
                    },
                    "network_data": {
                        "hour_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_02": [
                            {
                                "hour": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_DOWN",
                                    0
                                ]
                            }
                        ],
                        "type": "network",
                        "day_data": [
                            {
                                "ADSL_UP_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                "ADSL_DOWN_DATA": [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        "param_01": [
                            {
                                "hour": [
                                    "ADSL_UP",
                                    0
                                ]
                            },
                            {
                                "day": [
                                    "ADSL_UP",
                                    0
                                ]
                            }
                        ]
                    },
                    "run_time": "1319:1:45"
                }
            }
        // var _data = {
        //         'test2': {
        //             'network_data': {
        //                 'hour_data': [
        //                     {
        //                         'ADSL_UP_DATA': [
        //                             [
        //                                 0,
        //                                 100
        //                             ],
        //                             [
        //                                 1,
        //                                 4
        //                             ],
        //                             [
        //                                 2,
        //                                 0
        //                             ],
        //                             [
        //                                 3,
        //                                 0
        //                             ],
        //                             [
        //                                 4,
        //                                 0
        //                             ],
        //                             [
        //                                 5,
        //                                 0
        //                             ]
        //                         ]
        //                     },
        //                     {
        //                         'ADSL_DOWN_DATA': [
        //                             [
        //                                 0,
        //                                 0
        //                             ],
        //                             [
        //                                 1,
        //                                 0
        //                             ],
        //                             [
        //                                 2,
        //                                 0
        //                             ],
        //                             [
        //                                 3,
        //                                 6
        //                             ],
        //                             [
        //                                 4,
        //                                 0
        //                             ],
        //                             [
        //                                 5,
        //                                 0
        //                             ]
        //                         ]
        //                     }
        //                 ],
        //                 'param_02': [
        //                     {
        //                         'hour': [
        //                             'ADSL_DOWN',
        //                             3
        //                         ]
        //                     },
        //                     {
        //                         'day': [
        //                             'ADSL_DOWN',
        //                             0
        //                         ]
        //                     }
        //                 ],
        //                 'type': 'network',
        //                 'day_data': [
        //                     {
        //                         'ADSL_UP_DATA': [
        //                             [
        //                                 0,
        //                                 0
        //                             ],
        //                             [
        //                                 1,
        //                                 0
        //                             ],
        //                             [
        //                                 2,
        //                                 0
        //                             ],
        //                             [
        //                                 3,
        //                                 0
        //                             ],
        //                             [
        //                                 4,
        //                                 0
        //                             ],
        //                             [
        //                                 5,
        //                                 0
        //                             ],
        //                             [
        //                                 6,
        //                                 0
        //                             ],
        //                             [
        //                                 7,
        //                                 0
        //                             ],
        //                             [
        //                                 8,
        //                                 0
        //                             ],
        //                             [
        //                                 9,
        //                                 0
        //                             ],
        //                             [
        //                                 10,
        //                                 0
        //                             ],
        //                             [
        //                                 11,
        //                                 0
        //                             ],
        //                             [
        //                                 12,
        //                                 0
        //                             ],
        //                             [
        //                                 13,
        //                                 0
        //                             ],
        //                             [
        //                                 14,
        //                                 0
        //                             ],
        //                             [
        //                                 15,
        //                                 0
        //                             ],
        //                             [
        //                                 16,
        //                                 0
        //                             ],
        //                             [
        //                                 17,
        //                                 0
        //                             ],
        //                             [
        //                                 18,
        //                                 0
        //                             ],
        //                             [
        //                                 19,
        //                                 0
        //                             ],
        //                             [
        //                                 20,
        //                                 0
        //                             ],
        //                             [
        //                                 21,
        //                                 0
        //                             ],
        //                             [
        //                                 22,
        //                                 0
        //                             ],
        //                             [
        //                                 23,
        //                                 0
        //                             ]
        //                         ]
        //                     },
        //                     {
        //                         'ADSL_DOWN_DATA': [
        //                             [
        //                                 0,
        //                                 0
        //                             ],
        //                             [
        //                                 1,
        //                                 0
        //                             ],
        //                             [
        //                                 2,
        //                                 0
        //                             ],
        //                             [
        //                                 3,
        //                                 0
        //                             ],
        //                             [
        //                                 4,
        //                                 0
        //                             ],
        //                             [
        //                                 5,
        //                                 0
        //                             ],
        //                             [
        //                                 6,
        //                                 0
        //                             ],
        //                             [
        //                                 7,
        //                                 0
        //                             ],
        //                             [
        //                                 8,
        //                                 0
        //                             ],
        //                             [
        //                                 9,
        //                                 0
        //                             ],
        //                             [
        //                                 10,
        //                                 0
        //                             ],
        //                             [
        //                                 11,
        //                                 0
        //                             ],
        //                             [
        //                                 12,
        //                                 0
        //                             ],
        //                             [
        //                                 13,
        //                                 0
        //                             ],
        //                             [
        //                                 14,
        //                                 0
        //                             ],
        //                             [
        //                                 15,
        //                                 0
        //                             ],
        //                             [
        //                                 16,
        //                                 0
        //                             ],
        //                             [
        //                                 17,
        //                                 0
        //                             ],
        //                             [
        //                                 18,
        //                                 0
        //                             ],
        //                             [
        //                                 19,
        //                                 0
        //                             ],
        //                             [
        //                                 20,
        //                                 0
        //                             ],
        //                             [
        //                                 21,
        //                                 0
        //                             ],
        //                             [
        //                                 22,
        //                                 0
        //                             ],
        //                             [
        //                                 23,
        //                                 0
        //                             ]
        //                         ]
        //                     }
        //                 ],
        //                 'param_01': [
        //                     {
        //                         'hour': [
        //                             'ADSL_UP',
        //                             3
        //                         ]
        //                     },
        //                     {
        //                         'day': [
        //                             'ADSL_UP',
        //                             5
        //                         ]
        //                     }
        //                 ]
        //             },
        //             'host': 'localhost',
        //             'disk_data': {
        //                 'hour_data': [
        //                     {
        //                         'read_data': [
        //                             [
        //                                 0,
        //                                 0.0
        //                             ],
        //                             [
        //                                 1,
        //                                 0.5
        //                             ],
        //                             [
        //                                 2,
        //                                 0.7
        //                             ],
        //                             [
        //                                 3,
        //                                 0.0
        //                             ],
        //                             [
        //                                 4,
        //                                 0.0
        //                             ],
        //                             [
        //                                 5,
        //                                 0.0
        //                             ]
        //                         ]
        //                     },
        //                     {
        //                         'write_data': [
        //                             [
        //                                 0,
        //                                 0.9
        //                             ],
        //                             [
        //                                 1,
        //                                 0.0
        //                             ],
        //                             [
        //                                 2,
        //                                 0.0
        //                             ],
        //                             [
        //                                 3,
        //                                 10
        //                             ],
        //                             [
        //                                 4,
        //                                 0.0
        //                             ],
        //                             [
        //                                 5,
        //                                 0.0
        //                             ]
        //                         ]
        //                     }
        //                 ],
        //                 'param_02': [
        //                     {
        //                         'hour': [
        //                             'write_total',
        //                             0.0
        //                         ]
        //                     },
        //                     {
        //                         'day': [
        //                             'write_total',
        //                             0.0
        //                         ]
        //                     }
        //                 ],
        //                 'type': 'disk',
        //                 'day_data': [
        //                     {
        //                         'read_data': [
        //                             [
        //                                 0,
        //                                 0.0
        //                             ],
        //                             [
        //                                 1,
        //                                 0.0
        //                             ],
        //                             [
        //                                 2,
        //                                 0.0
        //                             ],
        //                             [
        //                                 3,
        //                                 0
        //                             ],
        //                             [
        //                                 4,
        //                                 0
        //                             ],
        //                             [
        //                                 5,
        //                                 0
        //                             ],
        //                             [
        //                                 6,
        //                                 0
        //                             ],
        //                             [
        //                                 7,
        //                                 0
        //                             ],
        //                             [
        //                                 8,
        //                                 0
        //                             ],
        //                             [
        //                                 9,
        //                                 0
        //                             ],
        //                             [
        //                                 10,
        //                                 0
        //                             ],
        //                             [
        //                                 11,
        //                                 0
        //                             ],
        //                             [
        //                                 12,
        //                                 0
        //                             ],
        //                             [
        //                                 13,
        //                                 0
        //                             ],
        //                             [
        //                                 14,
        //                                 0
        //                             ],
        //                             [
        //                                 15,
        //                                 0
        //                             ],
        //                             [
        //                                 16,
        //                                 0
        //                             ],
        //                             [
        //                                 17,
        //                                 0
        //                             ],
        //                             [
        //                                 18,
        //                                 0
        //                             ],
        //                             [
        //                                 19,
        //                                 0
        //                             ],
        //                             [
        //                                 20,
        //                                 0
        //                             ],
        //                             [
        //                                 21,
        //                                 0
        //                             ],
        //                             [
        //                                 22,
        //                                 0
        //                             ],
        //                             [
        //                                 23,
        //                                 0
        //                             ]
        //                         ]
        //                     },
        //                     {
        //                         'write_data': [
        //                             [
        //                                 0,
        //                                 0.0
        //                             ],
        //                             [
        //                                 1,
        //                                 0.0
        //                             ],
        //                             [
        //                                 2,
        //                                 0.0
        //                             ],
        //                             [
        //                                 3,
        //                                 0
        //                             ],
        //                             [
        //                                 4,
        //                                 0
        //                             ],
        //                             [
        //                                 5,
        //                                 0
        //                             ],
        //                             [
        //                                 6,
        //                                 0
        //                             ],
        //                             [
        //                                 7,
        //                                 0
        //                             ],
        //                             [
        //                                 8,
        //                                 0
        //                             ],
        //                             [
        //                                 9,
        //                                 0
        //                             ],
        //                             [
        //                                 10,
        //                                 0
        //                             ],
        //                             [
        //                                 11,
        //                                 0
        //                             ],
        //                             [
        //                                 12,
        //                                 0
        //                             ],
        //                             [
        //                                 13,
        //                                 0
        //                             ],
        //                             [
        //                                 14,
        //                                 0
        //                             ],
        //                             [
        //                                 15,
        //                                 0
        //                             ],
        //                             [
        //                                 16,
        //                                 0
        //                             ],
        //                             [
        //                                 17,
        //                                 0
        //                             ],
        //                             [
        //                                 18,
        //                                 0
        //                             ],
        //                             [
        //                                 19,
        //                                 0
        //                             ],
        //                             [
        //                                 20,
        //                                 0
        //                             ],
        //                             [
        //                                 21,
        //                                 0
        //                             ],
        //                             [
        //                                 22,
        //                                 0
        //                             ],
        //                             [
        //                                 23,
        //                                 0
        //                             ]
        //                         ]
        //                     }
        //                 ],
        //                 'param_01': [
        //                     {
        //                         'hour': [
        //                             'read_total',
        //                             1.0
        //                         ]
        //                     },
        //                     {
        //                         'day': [
        //                             'read_total',
        //                             0.0
        //                         ]
        //                     }
        //                 ]
        //             },
        //             'cloud_id':'6baa642f-529c-4e99-813b-5464b05d5436',
        //             'cpu_data': {
        //                 'hour_data': [
        //                     [
        //                         0,
        //                         4.209433560522372
        //                     ],
        //                     [
        //                         1,
        //                         4.38185458324851
        //                     ],
        //                     [
        //                         2,
        //                         7.2093578980613175
        //                     ],
        //                     [
        //                         3,
        //                         4.413223488200711
        //                     ],
        //                     [
        //                         4,
        //                         4.323602391110132
        //                     ],
        //                     [
        //                         5,
        //                         4.20569360234738
        //                     ]
        //                 ],
        //                 'param_02': [
        //                     'frequency',
        //                     '3.4'
        //                 ],
        //                 'type': 'CPU',
        //                 'day_data': [
        //                     [
        //                         0,
        //                         4.209433560522372
        //                     ],
        //                     [
        //                         1,
        //                         4.4283380716550695
        //                     ],
        //                     [
        //                         2,
        //                         4.432319924138686
        //                     ],
        //                     [
        //                         3,
        //                         0
        //                     ],
        //                     [
        //                         4,
        //                         0
        //                     ],
        //                     [
        //                         5,
        //                         0
        //                     ],
        //                     [
        //                         6,
        //                         0
        //                     ],
        //                     [
        //                         7,
        //                         0
        //                     ],
        //                     [
        //                         8,
        //                         0
        //                     ],
        //                     [
        //                         9,
        //                         0
        //                     ],
        //                     [
        //                         10,
        //                         0
        //                     ],
        //                     [
        //                         11,
        //                         0
        //                     ],
        //                     [
        //                         12,
        //                         0
        //                     ],
        //                     [
        //                         13,
        //                         0
        //                     ],
        //                     [
        //                         14,
        //                         0
        //                     ],
        //                     [
        //                         15,
        //                         0
        //                     ],
        //                     [
        //                         16,
        //                         0
        //                     ],
        //                     [
        //                         17,
        //                         0
        //                     ],
        //                     [
        //                         18,
        //                         0
        //                     ],
        //                     [
        //                         19,
        //                         0
        //                     ],
        //                     [
        //                         20,
        //                         0
        //                     ],
        //                     [
        //                         21,
        //                         0
        //                     ],
        //                     [
        //                         22,
        //                         0
        //                     ],
        //                     [
        //                         23,
        //                         0
        //                     ]
        //                 ],
        //                 'param_01': [
        //                     'kernal_nums',
        //                     '6'
        //                 ]
        //             }
        //         },
        //         'kkjjk': {
        //             'network_data': {
        //                 'hour_data': [
        //                     {
        //                         'ADSL_UP_DATA': [
        //                             [
        //                                 0,
        //                                 0
        //                             ],
        //                             [
        //                                 1,
        //                                 0
        //                             ],
        //                             [
        //                                 2,
        //                                 0
        //                             ],
        //                             [
        //                                 3,
        //                                 0
        //                             ],
        //                             [
        //                                 4,
        //                                 0
        //                             ],
        //                             [
        //                                 5,
        //                                 0
        //                             ]
        //                         ]
        //                     },
        //                     {
        //                         'ADSL_DOWN_DATA': [
        //                             [
        //                                 0,
        //                                 0
        //                             ],
        //                             [
        //                                 1,
        //                                 0
        //                             ],
        //                             [
        //                                 2,
        //                                 0
        //                             ],
        //                             [
        //                                 3,
        //                                 0
        //                             ],
        //                             [
        //                                 4,
        //                                 0
        //                             ],
        //                             [
        //                                 5,
        //                                 0
        //                             ]
        //                         ]
        //                     }
        //                 ],
        //                 'param_02': [
        //                     {
        //                         'hour': [
        //                             'ADSL_DOWN',
        //                             0
        //                         ]
        //                     },
        //                     {
        //                         'day': [
        //                             'ADSL_DOWN',
        //                             0
        //                         ]
        //                     }
        //                 ],
        //                 'type': 'network',
        //                 'day_data': [
        //                     {
        //                         'ADSL_UP_DATA': [
        //                             [
        //                                 0,
        //                                 0
        //                             ],
        //                             [
        //                                 1,
        //                                 0
        //                             ],
        //                             [
        //                                 2,
        //                                 0
        //                             ],
        //                             [
        //                                 3,
        //                                 0
        //                             ],
        //                             [
        //                                 4,
        //                                 0
        //                             ],
        //                             [
        //                                 5,
        //                                 0
        //                             ],
        //                             [
        //                                 6,
        //                                 0
        //                             ],
        //                             [
        //                                 7,
        //                                 0
        //                             ],
        //                             [
        //                                 8,
        //                                 0
        //                             ],
        //                             [
        //                                 9,
        //                                 0
        //                             ],
        //                             [
        //                                 10,
        //                                 0
        //                             ],
        //                             [
        //                                 11,
        //                                 0
        //                             ],
        //                             [
        //                                 12,
        //                                 0
        //                             ],
        //                             [
        //                                 13,
        //                                 0
        //                             ],
        //                             [
        //                                 14,
        //                                 0
        //                             ],
        //                             [
        //                                 15,
        //                                 0
        //                             ],
        //                             [
        //                                 16,
        //                                 0
        //                             ],
        //                             [
        //                                 17,
        //                                 0
        //                             ],
        //                             [
        //                                 18,
        //                                 0
        //                             ],
        //                             [
        //                                 19,
        //                                 0
        //                             ],
        //                             [
        //                                 20,
        //                                 0
        //                             ],
        //                             [
        //                                 21,
        //                                 0
        //                             ],
        //                             [
        //                                 22,
        //                                 0
        //                             ],
        //                             [
        //                                 23,
        //                                 0
        //                             ]
        //                         ]
        //                     },
        //                     {
        //                         'ADSL_DOWN_DATA': [
        //                             [
        //                                 0,
        //                                 0
        //                             ],
        //                             [
        //                                 1,
        //                                 0
        //                             ],
        //                             [
        //                                 2,
        //                                 0
        //                             ],
        //                             [
        //                                 3,
        //                                 0
        //                             ],
        //                             [
        //                                 4,
        //                                 0
        //                             ],
        //                             [
        //                                 5,
        //                                 0
        //                             ],
        //                             [
        //                                 6,
        //                                 0
        //                             ],
        //                             [
        //                                 7,
        //                                 0
        //                             ],
        //                             [
        //                                 8,
        //                                 0
        //                             ],
        //                             [
        //                                 9,
        //                                 0
        //                             ],
        //                             [
        //                                 10,
        //                                 0
        //                             ],
        //                             [
        //                                 11,
        //                                 0
        //                             ],
        //                             [
        //                                 12,
        //                                 0
        //                             ],
        //                             [
        //                                 13,
        //                                 0
        //                             ],
        //                             [
        //                                 14,
        //                                 0
        //                             ],
        //                             [
        //                                 15,
        //                                 0
        //                             ],
        //                             [
        //                                 16,
        //                                 0
        //                             ],
        //                             [
        //                                 17,
        //                                 0
        //                             ],
        //                             [
        //                                 18,
        //                                 0
        //                             ],
        //                             [
        //                                 19,
        //                                 0
        //                             ],
        //                             [
        //                                 20,
        //                                 0
        //                             ],
        //                             [
        //                                 21,
        //                                 0
        //                             ],
        //                             [
        //                                 22,
        //                                 0
        //                             ],
        //                             [
        //                                 23,
        //                                 0
        //                             ]
        //                         ]
        //                     }
        //                 ],
        //                 'param_01': [
        //                     {
        //                         'hour': [
        //                             'ADSL_UP',
        //                             2
        //                         ]
        //                     },
        //                     {
        //                         'day': [
        //                             'ADSL_UP',
        //                             5
        //                         ]
        //                     }
        //                 ]
        //             },
        //             'host':'localhost',
        //             'disk_data': {
        //                 'hour_data': [
        //                     {
        //                         'read_data': [
        //                             [
        //                                 0,
        //                                 0.0
        //                             ],
        //                             [
        //                                 1,
        //                                 0.0
        //                             ],
        //                             [
        //                                 2,
        //                                 0.0
        //                             ],
        //                             [
        //                                 3,
        //                                 0.0
        //                             ],
        //                             [
        //                                 4,
        //                                 0.0
        //                             ],
        //                             [
        //                                 5,
        //                                 0.0
        //                             ]
        //                         ]
        //                     },
        //                     {
        //                         'write_data': [
        //                             [
        //                                 0,
        //                                 0.0
        //                             ],
        //                             [
        //                                 1,
        //                                 0.0
        //                             ],
        //                             [
        //                                 2,
        //                                 0.0
        //                             ],
        //                             [
        //                                 3,
        //                                 0.0
        //                             ],
        //                             [
        //                                 4,
        //                                 0.0
        //                             ],
        //                             [
        //                                 5,
        //                                 0.0
        //                             ]
        //                         ]
        //                     }
        //                 ],
        //                 'param_02': [
        //                     {
        //                         'hour': [
        //                             'write_total',
        //                             0.0
        //                         ]
        //                     },
        //                     {
        //                         'day': [
        //                             'write_total',
        //                             0.0
        //                         ]
        //                     }
        //                 ],
        //                 'type': 'disk',
        //                 'day_data': [
        //                     {
        //                         'read_data': [
        //                             [
        //                                 0,
        //                                 0.0
        //                             ],
        //                             [
        //                                 1,
        //                                 0.0
        //                             ],
        //                             [
        //                                 2,
        //                                 0.0
        //                             ],
        //                             [
        //                                 3,
        //                                 0.0
        //                             ],
        //                             [
        //                                 4,
        //                                 0.0
        //                             ],
        //                             [
        //                                 5,
        //                                 0.0
        //                             ],
        //                             [
        //                                 6,
        //                                 0.0
        //                             ],
        //                             [
        //                                 7,
        //                                 0.0
        //                             ],
        //                             [
        //                                 8,
        //                                 0.0
        //                             ],
        //                             [
        //                                 9,
        //                                 0.0
        //                             ],
        //                             [
        //                                 10,
        //                                 0.0
        //                             ],
        //                             [
        //                                 11,
        //                                 0.0
        //                             ],
        //                             [
        //                                 12,
        //                                 0.0
        //                             ],
        //                             [
        //                                 13,
        //                                 0.0
        //                             ],
        //                             [
        //                                 14,
        //                                 0.0
        //                             ],
        //                             [
        //                                 15,
        //                                 0.0
        //                             ],
        //                             [
        //                                 16,
        //                                 0.0
        //                             ],
        //                             [
        //                                 17,
        //                                 0.0
        //                             ],
        //                             [
        //                                 18,
        //                                 0.0
        //                             ],
        //                             [
        //                                 19,
        //                                 0.0
        //                             ],
        //                             [
        //                                 20,
        //                                 0.0
        //                             ],
        //                             [
        //                                 21,
        //                                 0.0
        //                             ],
        //                             [
        //                                 22,
        //                                 0.0
        //                             ],
        //                             [
        //                                 23,
        //                                 0.0
        //                             ]
        //                         ]
        //                     },
        //                     {
        //                         'write_data': [
        //                             [
        //                                 0,
        //                                 0.0
        //                             ],
        //                             [
        //                                 1,
        //                                 0.0
        //                             ],
        //                             [
        //                                 2,
        //                                 0.0
        //                             ],
        //                             [
        //                                 3,
        //                                 0.0
        //                             ],
        //                             [
        //                                 4,
        //                                 0.0
        //                             ],
        //                             [
        //                                 5,
        //                                 0.0
        //                             ],
        //                             [
        //                                 6,
        //                                 0.0
        //                             ],
        //                             [
        //                                 7,
        //                                 0.0
        //                             ],
        //                             [
        //                                 8,
        //                                 0.0
        //                             ],
        //                             [
        //                                 9,
        //                                 0.0
        //                             ],
        //                             [
        //                                 10,
        //                                 0.0
        //                             ],
        //                             [
        //                                 11,
        //                                 0.0
        //                             ],
        //                             [
        //                                 12,
        //                                 0.0
        //                             ],
        //                             [
        //                                 13,
        //                                 0.0
        //                             ],
        //                             [
        //                                 14,
        //                                 0.0
        //                             ],
        //                             [
        //                                 15,
        //                                 0.0
        //                             ],
        //                             [
        //                                 16,
        //                                 0.0
        //                             ],
        //                             [
        //                                 17,
        //                                 0.0
        //                             ],
        //                             [
        //                                 18,
        //                                 0.0
        //                             ],
        //                             [
        //                                 19,
        //                                 0.0
        //                             ],
        //                             [
        //                                 20,
        //                                 0.0
        //                             ],
        //                             [
        //                                 21,
        //                                 0.0
        //                             ],
        //                             [
        //                                 22,
        //                                 0.0
        //                             ],
        //                             [
        //                                 23,
        //                                 0.0
        //                             ]
        //                         ]
        //                     }
        //                 ],
        //                 'param_01': [
        //                     {
        //                         'hour': [
        //                             'read_total',
        //                             0.5
        //                         ]
        //                     },
        //                     {
        //                         'day': [
        //                             'read_total',
        //                             1.0
        //                         ]
        //                     }
        //                 ]
        //             },
        //             'cloud_id': '9d226256-e401-4b20-9fcb-8a6faaf66292',
        //             'cpu_data': {
        //                 'hour_data': [
        //                     [
        //                         0,
        //                         4.204420403953293
        //                     ],
        //                     [
        //                         1,
        //                         4.368556181194232
        //                     ],
        //                     [
        //                         2,
        //                         4.189353720254463
        //                     ],
        //                     [
        //                         3,
        //                         4.398223993484855
        //                     ],
        //                     [
        //                         4,
        //                         4.30526596498043
        //                     ],
        //                     [
        //                         5,
        //                         4.184032574961405
        //                     ]
        //                 ],
        //                 'param_02': [
        //                     'frequency',
        //                     '3.4'
        //                 ],
        //                 'type': 'CPU',
        //                 'day_data': [
        //                     [
        //                         0,
        //                         4.204420403953293
        //                     ],
        //                     [
        //                         1,
        //                         4.405007143453251
        //                     ],
        //                     [
        //                         2,
        //                         4.393873677271919
        //                     ],
        //                     [
        //                         3,
        //                         0.0
        //                     ],
        //                     [
        //                         4,
        //                         4.259339382474963
        //                     ],
        //                     [
        //                         5,
        //                         4.2227048530929325
        //                     ],
        //                     [
        //                         6,
        //                         4.257761402297557
        //                     ],
        //                     [
        //                         7,
        //                         4.233484680410657
        //                     ],
        //                     [
        //                         8,
        //                         4.255011197604271
        //                     ],
        //                     [
        //                         9,
        //                         4.196980241197634
        //                     ],
        //                     [
        //                         10,
        //                         4.2101951756621565
        //                     ],
        //                     [
        //                         11,
        //                         4.204958767709467
        //                     ],
        //                     [
        //                         12,
        //                         4.188707175642681
        //                     ],
        //                     [
        //                         13,
        //                         4.2591034217953
        //                     ],
        //                     [
        //                         14,
        //                         4.282692214308851
        //                     ],
        //                     [
        //                         15,
        //                         4.264245712234308
        //                     ],
        //                     [
        //                         16,
        //                         4.276876283167301
        //                     ],
        //                     [
        //                         17,
        //                         4.217156067628315
        //                     ],
        //                     [
        //                         18,
        //                         4.286759058619735
        //                     ],
        //                     [
        //                         19,
        //                         4.240803579518715
        //                     ],
        //                     [
        //                         20,
        //                         4.2938571364163565
        //                     ],
        //                     [
        //                         21,
        //                         4.231540218165885
        //                     ],
        //                     [
        //                         22,
        //                         4.245786764267592
        //                     ],
        //                     [
        //                         23,
        //                         4.290998988476297
        //                     ]
        //                 ],
        //                 'param_01': [
        //                     'kernal_nums',
        //                     '5'
        //                 ]
        //             }
        //         }
        //     }
       

        // $scope.mechine_name = mechine_name.push();
        var plot_style = {
            colors: ['#23b7e5', '#7266ba'],
            series: { shadowSize: 3 },
            xaxis:{ font: { color: '#a1a7ac' },ticks:[]},
            yaxis:{ font: { color: '#a1a7ac' }, max:20,ticks:[]},
            grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#dce5ec' },
            tooltip: false,
            tooltipOpts: { content: 'Visits of %x.1 is %y.4',  defaultTheme: false, shifts: { x: 0, y: 0 } }
        };
        //跳转详情页
        $scope.transfer =function(id){
           urlParamsTrnasfer.set(id);
           window.location.href = "#/cloud_monitor_detail/"

        }
        $scope.cloud_monitors = _data;//数据
        //设置默认值 (物理主机/24小时内)
        $scope.defaultTimeRange = 'rday';
        $scope.plot_style = plot_style;//图标样式
        checkboxGroup.syncObjects($scope.cloud_monitors);
        
        //ng-repeat 渲染完执行脚本
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
             $scope.table_page();
        })
        //得到物理主机名称
        // for(var n in _data)
        // {
        //     console.log(_data[n].host);
        // }
        // 分页函数
        $scope.table_page = function(){
           
            var show_page = 5;
            var totalitem = $('.content .pageitem').length;
            var current_page=1;//当前页
            var page_num=Math.ceil(totalitem/show_page);//总页数
            var current_num=0;//用于生成页标的计数器 
            var li = "";//页标元素
            //循环生成页标元素
            while(page_num>current_num){
                li+='<li class="page_num"><a href="javasctip:#">'+(current_num+1)+'</a></li>';
                current_num++;
            }
            $('.content .pageitem').css('display','none');//设置隐藏
            $('.content .pageitem').slice(0, show_page).css('display', '');//设置显示
            // // 添加页标到页面
            $('#page_num_all').html(li);
            //显示当前页
            $("#current_page").html(" "+current_page+" ");//显示当前页
            $("#page_all").html(" "+page_num+" ");//显示总页数
            $('#page_num_all li:eq(0)').addClass('active');
            //点击上一页
            $('#previous').click(function(){
                var new_page = parseInt($('#current_page').text()) - 1; 
                // alert(new_page);
                if(new_page>0)
                {
                    $('#page_num_all li').removeClass('active');
                    $('#page_num_all li:eq('+(new_page-1)+')').addClass('active');
                    $("#current_page").html(" "+new_page+" "); 
                    tab_page(new_page);//切换新页
                }
               return false;
            });
            //点击下一页
            $("#next").click(function(){//下一页
                var new_page=parseInt($("#current_page").text())+1;//当前页标
                if(new_page<=page_num){//判断是否为最后或第一页
                    $('#page_num_all li').removeClass('active');
                    $('#page_num_all li:eq('+$("#current_page").text()+')').addClass('active');
                    $("#current_page").html(" "+new_page+" ");
                    tab_page(new_page);
                }
            });
            //页面跳转
            $(".page_num").click(function(){//页标跳转
                $('#page_num_all li').removeClass('active');
                $(this).addClass('active');
                var new_page=parseInt($(this).text());
                tab_page(new_page);
            });
            //切换页面
            function tab_page(index){
                var start=(index-1)*show_page;//开始截取的页标
                var end=start+show_page;//截取个数
                $('.content .pageitem').css('display','none').slice(start, end).css({'display':''});
                current_page=index;
                $("#current_page").html(" "+current_page+" ");
            }
        }
        //指定列查询
        //按时间查询  1周内/一个月内/一小时内
        $scope.setTimeRange = function(key){
            switch($scope.selected_2){
                case '0':
                {
                    
                    $scope.defaultTimeRange = 'rday'; 
                    break;
                }
                case '1':
                {
                    
                    $scope.defaultTimeRange = 'rday'; 
                    break;
                }
                case '2':
                {
                    
                    $scope.defaultTimeRange = 'rday';
                    break;
                } 
                case '3':
                {
                   
                    $scope.defaultTimeRange = 'rhouse'; 
                    break;
                }
                default:
                $scope.defaultTimeRange = 'rday'; 
               
            }
            // console.log($scope.defaultTimeRange);
        }
        //深度复制  
        function deepCopy(source) { 
            var result={};
            for (var key in source) {
                // console.log(typeof source[key]);
                //1.js 数组和对象区分
                result[key] = (typeof source[key]==='object' && !isArray(source[key]))? deepCopy(source[key]): source[key];
            } 
            return result; 
        }  
        //判断数组和对象
        function isArray(obj) {    
            return Object.prototype.toString.call(obj) === '[object Array]';     
        }
        $scope.sortname = '';
        //指定列筛选(显示数值由高到低从左到右排列) 
        $scope.sortbykey = function(keywords)
        {
            switch(keywords){
                case 'me-name':
                {
                    var me_data ={};
                    var me_arr = [];
                    angular.forEach($('.site'),function(v,i){
                        me_arr.push( eval('(' + $(v).data('mename')+ ')'))//字符串转为json对象
                    })
                    me_arr.sort(function(a,b){
                        return a.name.localeCompare(b.name)
                    })
                    for(var i=0;i<me_arr.length;i++)
                    {
                        var key = me_arr[i].name;//键值
                        me_data[key] = deepCopy($scope.cloud_monitors[key]);
                    }
                    $scope.cloud_monitors = me_data;
                    checkboxGroup.syncObjects($scope.cloud_monitors);
                    $scope.sortname = 'mechine';
                    break;
                }
                //cpu 排序
                case 'data_cpu':
                {
                    var c_data ={};
                    var cpu_arr = [];
                    angular.forEach($('.data_cpu'),function(v,i){
                        cpu_arr.push( eval('(' + $(v).data('kernal')+ ')'))//字符串转为json对象
                    })
                    // console.log(cpu_arr);
                    var scpu =  cpu_arr.sort(function(x,y){
                        return (y.knum - x.knum)
                    });//排序
                    for(var i=0;i<scpu.length;i++)
                    {
                        var key = scpu[i].name;//键值
                        c_data[key] = deepCopy($scope.cloud_monitors[key]);
                    }
                    $scope.cloud_monitors = c_data;
                    checkboxGroup.syncObjects($scope.cloud_monitors);
                    $scope.sortname = 'cpu';
                    break;
                }
                //磁盘  排序
                case 'data_disk':
                {
                    var d_data ={};
                    var disk_arr = [];
                    angular.forEach($('.data_disk'),function(v,i){
                        disk_arr.push( eval('(' + $(v).data('diskread')+ ')'))//字符串转为json对象
                    })
                    var sdisk =  disk_arr.sort(function(x,y){
                        return (y.read - x.read)
                    });//排序
                    for(var i=0;i<sdisk.length;i++)
                    {
                        var key = sdisk[i].name;//键值
                        d_data[key] = deepCopy($scope.cloud_monitors[key]);
                       
                    }
                    $scope.cloud_monitors = d_data;
                    checkboxGroup.syncObjects($scope.cloud_monitors);
                    $scope.sortname = 'disk';
                    break;
                }
                //内存 排序
                case 'data_network':
                {
                    var network_data ={};
                    var network_arr = [];
                    angular.forEach($('.data_network'),function(v,i){
                        network_arr.push( eval('(' + $(v).data('network')+ ')'))//字符串转为json对象
                    })
                    var sdisk =  network_arr.sort(function(x,y){
                        return (y.updata - x.updata)
                    });//排序
                    for(var i=0;i<sdisk.length;i++)
                    {
                        var key = sdisk[i].name;//键值
                        network_data[key] = deepCopy($scope.cloud_monitors[key]);
                       
                    }
                    $scope.cloud_monitors = network_data;
                    checkboxGroup.syncObjects($scope.cloud_monitors);
                    $scope.sortname = 'network';
                    break;
                }
                //网络 排序
                case 'data_network':
                {
                    var network_data ={};
                    var network_arr = [];
                    angular.forEach($('.data_network'),function(v,i){
                        network_arr.push( eval('(' + $(v).data('network')+ ')'))//字符串转为json对象
                    })
                    var sdisk =  network_arr.sort(function(x,y){
                        return (y.updata - x.updata)
                    });//排序
                    for(var i=0;i<sdisk.length;i++)
                    {
                        var key = sdisk[i].name;//键值
                        network_data[key] = deepCopy($scope.cloud_monitors[key]);
                       
                    }
                    $scope.cloud_monitors = network_data;
                    checkboxGroup.syncObjects($scope.cloud_monitors);
                    $scope.sortname = 'network';
                    break;
                }
            }
        };
        $scope.filter = function(){
            var v = $('.filter-status').find(':selected').text();
            console.log(v);
            // var runtime = [];
            // if(typeof $scope.cloud_monitors == 'object'){
            //     for (var o in $scope.cloud_monitors){
            //         runtime.push($scope.cloud_monitors[o][1][0].run_time);
            //     }
            // }
            // runtime.sort(function(a,b){
            //     console.log(this);
            //      return a-b;
            // })
            // console.log(runtime);
            // console.log($scope.cloud_monitors)
            //data-time-filter
            // 排序
          //   function sort(content){
          //       console.log(content)
          //       for(var i =1;i<content.length;++i)
          //       {
          //           var tmp = content[i];
          //           var j = i-1;
          //           while(j>=0 && content[j]>tmp){
          //               content[j+1] = content[j];
          //               --j;
          //           }
          //           console.log(tmp)
          //           console.log(j)
          //           content[j+1] = tmp;
          //           console.log(content)
          //       }
          //       console.log(content);
          //   }
          // sort(runtime);
          // console.log(runtime);
        }
       
       
        $scope.selected_1 = '';
        $scope.selected_2 = '';
        
        //filter过滤查询函数 
        // $scope.select = function()
        // { 
        //     var selected = $('.filter-status').find(':selected').text();
        //     console.log(selected);
        //     // console.log($scope.selected);
        // }
        var deleteCloud_Monitors = function(ids){

            $ngBootbox.confirm($i18next("cloud_monitor.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/cloud_monitor/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.cloud_monitor_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteCloud_Monitors(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Cloud_Monitor){
                    if(cloud_monitor.checked){
                        ids.push(cloud_monitor.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(cloud_monitor){
            deleteCloud_Monitors([cloud_monitor.id]);
        };


        $scope.edit = function(cloud_monitor){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Cloud_MonitorUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    cloud_monitor_table: function () {
                        return $scope.cloud_monitor_table;
                    },
                    cloud_monitor: function(){return cloud_monitor}
                }
            });
        };

        $scope.openNewCloud_MonitorModal = function(){
            $modal.open({
                templateUrl: 'new-cloud_monitor.html',
                backdrop: "static",
                controller: 'NewCloud_MonitorController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.cloud_monitor_table.reload();
            });
        };
    })
    .controller('NewCloud_MonitorController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Cloud_MonitorForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Cloud_MonitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.cloud_monitor = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/cloud_monitor/create/', $scope.cloud_monitor).then(function(result){
                    if(result.success){
                        ToastrService.success(result.msg, $i18next("success"));
                        $modalInstance.close();
                    } else {
                        ToastrService.error(result.msg, $i18next("op_failed"));
                    }
                    $scope.is_submitting = true;
                }).finally(function(){
                    $scope.is_submitting = false;
                });
            };
        }

   ).factory('Cloud_MonitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cloud_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/cloud_monitor/is-name-unique/",
                                    data: {
                                        cloud_monitorname: $("#cloud_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cloud_monitorname: {
                                remote: $i18next('cloud_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#cloud_monitorForm', config);
                }
            }
        }]).controller('Cloud_MonitorUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 cloud_monitor, cloud_monitor_table,
                 Cloud_Monitor, UserDataCenter, cloud_monitorForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.cloud_monitor = cloud_monitor = angular.copy(cloud_monitor);

            $modalInstance.rendered.then(cloud_monitorForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = cloud_monitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(cloud_monitor){

                if(!$("#Cloud_MonitorForm").validate().form()){
                    return;
                }

                cloud_monitor = ResourceTool.copy_only_data(cloud_monitor);


                CommonHttpService.post("/api/cloud_monitor/update/", cloud_monitor).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        cloud_monitor_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('cloud_monitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cloud_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/cloud_monitor/is-name-unique/",
                                    data: {
                                        cloud_monitorname: $("#cloud_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cloud_monitorname: {
                                remote: $i18next('cloud_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Cloud_MonitorForm', config);
                }
            }
        }]);
