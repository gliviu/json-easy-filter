"use strict";

var fs = require('fs');
var JefNode = require('../index').JefNode;

var Tests3 = function () {
    // objects
    this.test1 = function () {
        var d = {
            a1 : {
                b1 : 'b1',
                b2 : {
                    c1 : 'c1'
                },
                b3 : [
                        'b3', {
                            c1 : 'c1'
                        }
                ]
            },
            a2 : {},
            a4 : {
                b2 : 'b2',
                b4 : {
                    c1 : 'c1'
                }
            }
        };
        var root = new JefNode(d);

        d.a5 = 'a5';
        delete d.a1.b1;
        delete d.a1.b2;
        d.a4.b4.c2 = {
            d1 : 'd1',
            d2 : {
                e1 : 'e1'
            }
        };
        delete d.a4.b2;
        root.refresh();
        var res = root.print();
        if (false) {
            console.log(res);
        }
        var testResult = res.toString() === [
                'root',
                'root.a1',
                'root.a1.b3',
                'root.a1.b3.0',
                'root.a1.b3.1',
                'root.a1.b3.1.c1',
                'root.a2',
                'root.a4',
                'root.a4.b4',
                'root.a4.b4.c1',
                'root.a4.b4.c2',
                'root.a4.b4.c2.d1',
                'root.a4.b4.c2.d2',
                'root.a4.b4.c2.d2.e1',
                'root.a5'
        ].toString();
        return testResult;
    };

    // arrays
    this.test2 = function () {
        var d = {
            a1 : {
                b1 : [
                        'c1', 'c2', {
                            d1 : 'd1',
                            d2 : [
                                    'e1', 'e2', 'e3'
                            ]
                        }, {
                            g1 : [
                                    'h1', 'h2'
                            ]
                        }, {
                            m1 : [
                                    'n1', 'n2'
                            ]
                        }
                ]
            }
        };
        var root = new JefNode(d);

        d.a1.b1.splice(1, 1); // remove a1.b1.c2
        delete d.a1.b1[1].d1;
        d.a1.b1[1].d2.push({
            e4 : [
                    'f1', 'f2', {
                        x1 : 'x1'
                    }
            ]
        });
        d.a1.b1.splice(2, 2);
        d.a1.b1.splice(3, 3);

        root.refresh();
        var res = root.print(true);
        if (false) {
            console.log(res);
        }
        var testResult = res.toString() === [
                'root - {"a1":{"b1":["c1",{"d2":["e1","e2","e3",{"e4":["f1","f2",{"x1":"x1"}]}]}]}}',
                'root.a1 - {"b1":["c1",{"d2":["e1","e2","e3",{"e4":["f1","f2",{"x1":"x1"}]}]}]}',
                'root.a1.b1 - ["c1",{"d2":["e1","e2","e3",{"e4":["f1","f2",{"x1":"x1"}]}]}]',
                'root.a1.b1.0 - "c1"',
                'root.a1.b1.1 - {"d2":["e1","e2","e3",{"e4":["f1","f2",{"x1":"x1"}]}]}',
                'root.a1.b1.1.d2 - ["e1","e2","e3",{"e4":["f1","f2",{"x1":"x1"}]}]',
                'root.a1.b1.1.d2.0 - "e1"',
                'root.a1.b1.1.d2.1 - "e2"',
                'root.a1.b1.1.d2.2 - "e3"',
                'root.a1.b1.1.d2.3 - {"e4":["f1","f2",{"x1":"x1"}]}',
                'root.a1.b1.1.d2.3.e4 - ["f1","f2",{"x1":"x1"}]',
                'root.a1.b1.1.d2.3.e4.0 - "f1"',
                'root.a1.b1.1.d2.3.e4.1 - "f2"',
                'root.a1.b1.1.d2.3.e4.2 - {"x1":"x1"}',
                'root.a1.b1.1.d2.3.e4.2.x1 - "x1"'
        ].toString();
        return testResult;
    };
    // empty object
    this.test3 = function () {
        var d = {
            a1 : {
                b1 : 'b1'
            }
        };
        var root = new JefNode(d);

        delete d.a1;

        root.refresh();
        var res = root.print(true);
        if (false) {
            console.log(res);
        }
        var testResult = res.toString() === [
            'root - {}'
        ].toString();
        return testResult;
    };

    // nested refresh
    this.test4 = function () {
        var d = {
            x1 : {
                a1 : {
                    b1 : 'b1',
                    b2 : {
                        c1 : 'c1'
                    },
                    b3 : [
                            'b3', {
                                c1 : 'c1'
                            }
                    ]
                },
                a2 : {},
                a4 : {
                    b2 : 'b2',
                    b4 : {
                        c1 : 'c1'
                    }
                }
            },
            x2 : 'x2',
            x3 : {
                y1 : 'y1'
            }
        };
        var root = new JefNode(d);

        d.x1.a5 = 'a5';
        delete d.x1.a1.b1;
        delete d.x1.a1.b2;
        d.x1.a4.b4.c2 = {
            d1 : 'd1',
            d2 : {
                e1 : 'e1'
            }
        };
        delete d.x1.a4.b2;
        root.get('x1').refresh();
        var res = root.print();
        if (false) {
            console.log(res);
        }
        var testResult = res.toString() === [
                'root',
                'root.x1',
                'root.x1.a1',
                'root.x1.a1.b3',
                'root.x1.a1.b3.0',
                'root.x1.a1.b3.1',
                'root.x1.a1.b3.1.c1',
                'root.x1.a2',
                'root.x1.a4',
                'root.x1.a4.b4',
                'root.x1.a4.b4.c1',
                'root.x1.a4.b4.c2',
                'root.x1.a4.b4.c2.d1',
                'root.x1.a4.b4.c2.d2',
                'root.x1.a4.b4.c2.d2.e1',
                'root.x1.a5',
                'root.x2',
                'root.x3',
                'root.x3.y1'
        ].toString();
        return testResult;
    };

    // nested refresh - arrays
    this.test5 = function () {
        var d = {
            x1 : {
                a1 : {
                    b1 : [
                            'c1', 'c2', {
                                d1 : 'd1',
                                d2 : [
                                        'e1', 'e2', 'e3'
                                ]
                            }, {
                                g1 : [
                                        'h1', 'h2'
                                ]
                            }, {
                                m1 : [
                                        'n1', 'n2'
                                ]
                            }
                    ]
                }
            }
        };
        var root = new JefNode(d);

        d.x1.a1.b1.splice(1, 1); // remove a1.x1.b1.c2
        delete d.x1.a1.b1[1].d1;
        d.x1.a1.b1[1].d2.push({
            e4 : [
                    'f1', 'f2', {
                        x1 : 'x1'
                    }
            ]
        });
        d.x1.a1.b1.splice(2, 2);
        d.x1.a1.b1.splice(3, 3);

        root.refresh();
        var res = root.print(true);
        if (false) {
            console.log(res);
        }
        var testResult = res.toString() === [
                'root - {"x1":{"a1":{"b1":["c1",{"d2":["e1","e2","e3",{"e4":["f1","f2",{"x1":"x1"}]}]}]}}}',
                'root.x1 - {"a1":{"b1":["c1",{"d2":["e1","e2","e3",{"e4":["f1","f2",{"x1":"x1"}]}]}]}}',
                'root.x1.a1 - {"b1":["c1",{"d2":["e1","e2","e3",{"e4":["f1","f2",{"x1":"x1"}]}]}]}',
                'root.x1.a1.b1 - ["c1",{"d2":["e1","e2","e3",{"e4":["f1","f2",{"x1":"x1"}]}]}]',
                'root.x1.a1.b1.0 - "c1"',
                'root.x1.a1.b1.1 - {"d2":["e1","e2","e3",{"e4":["f1","f2",{"x1":"x1"}]}]}',
                'root.x1.a1.b1.1.d2 - ["e1","e2","e3",{"e4":["f1","f2",{"x1":"x1"}]}]',
                'root.x1.a1.b1.1.d2.0 - "e1"',
                'root.x1.a1.b1.1.d2.1 - "e2"',
                'root.x1.a1.b1.1.d2.2 - "e3"',
                'root.x1.a1.b1.1.d2.3 - {"e4":["f1","f2",{"x1":"x1"}]}',
                'root.x1.a1.b1.1.d2.3.e4 - ["f1","f2",{"x1":"x1"}]',
                'root.x1.a1.b1.1.d2.3.e4.0 - "f1"',
                'root.x1.a1.b1.1.d2.3.e4.1 - "f2"',
                'root.x1.a1.b1.1.d2.3.e4.2 - {"x1":"x1"}',
                'root.x1.a1.b1.1.d2.3.e4.2.x1 - "x1"'
        ].toString();
        return testResult;
    };
    // fix bug: wrong refresh()
    this.test6 = function () {
        var root = new JefNode({
            "a1" : {
                "a2" : 1
            },
            "a2" : "conflict",
            "a3" : "conflict",
            "a5" : {
                "a6" : "a",
                "a8" : 2
            }
        });
        var node = root.get('a5');
        node.value.a6 = 'conflict';
        node.refresh();
        var res1 = root.print();
        var res2 = node.print();
        if (false) {
            console.log(res1);
            console.log(res2);
        }
        var testResult1 = res1.toString() === [
                'root', 'root.a1', 'root.a1.a2', 'root.a2', 'root.a3', 'root.a5', 'root.a5.a6', 'root.a5.a8'
        ].toString();
        var testResult2 = res2.toString() === [
                'root.a5', 'root.a5.a6', 'root.a5.a8'
        ].toString();
        return testResult1 && testResult2;
    };
    // bug fix: wrong iteration order after refresh()
    this.test7 = function () {
        var data = {
            a1 : 'a1',
            a2 : 'a2'
        };
        var jef = new JefNode(data);
        data.a1 = {
            a3 : 'a3'
        };
        jef.refresh();
        var res = [];
        jef.filter(function (node) {
            if(!node.isRoot)
            res.push(node.path);
        });
        if (false) {
            console.log(res);
        }
        var testResult = JSON.stringify(res) === JSON.stringify([ 'a1', 'a1.a3', 'a2' ]);
        return testResult;
    };

};

module.exports = function () {
    return new Tests3();
};
