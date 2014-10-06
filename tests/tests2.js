"use strict";

var fs = require('fs');
var JefNode = require('../index').JefNode;
var traverse = require('../index').traverse;
var sample1 = require('./sampleData1.js');

var Tests2 = function () {
    this.test1 = function (printResult) {
        var res = new JefNode(sample1).get('departments.admin').filter(function (node) {
            if (node.value.manager === 'john') {
                return node.value.manager;
            }
        });
        if (printResult) {
            console.log(res);
        }
        var testResult = res.toString() === [
            'john'
        ].toString();
        return testResult;
    };
    this.test2 = function (printResult) {
        var res = new JefNode(sample1).get('employees').parent.isRoot;
        if (printResult) {
            console.log(res);
        }
        var testResult = res.toString() === true.toString();
        return testResult;
    };
    this.test3 = function () {
        var res = new JefNode(sample1).filter(function (node) {
            if (node.isRoot) {
                return 'Root node - level=' + node.level + ', path: ' + node.path + ', pathLength=' + node.pathArray.length;
            }
            if (node.key === 'departments') {
                return 'Departments node - level=' + node.level + ', path: ' + node.path + ', pathLength=' + node.pathArray.length;
            }
            if (node.has('username') && node.value.username === 'john') {
                var email = node.get('contact.1.email');
                return 'Email node - level=' + email.level + ', path: ' + email.path + ', pathLength=' + email.pathArray.length;
            }
        });
        if (false) {
            console.log(res);
        }
        var testResult = res.toString() === [
                'Root node - level=0, path: , pathLength=0',
                'Departments node - level=1, path: departments, pathLength=1',
                'Email node - level=5, path: employees.0.contact.1.email, pathLength=5'
        ].toString();
        return testResult;
    };
    this.test4 = function (printResult) {
        var res = new JefNode(sample1).filter(function (node) {
            if (node.isLeaf && node.level > 3) {
                return node.path;
            }
        });
        if (printResult) {
            console.log(res);
        }
        var testResult = res.toString() === [
                'departments.admin.employees.0',
                'departments.admin.employees.1',
                'departments.it.employees.0',
                'departments.it.employees.1',
                'departments.it.employees.2',
                'departments.finance.employees.0',
                'departments.finance.employees.1',
                'departments.finance.employees.2',
                'employees.0.contact.0.phone',
                'employees.0.contact.1.email',
                'employees.0.contact.2.type',
                'employees.0.contact.2.address.city',
                'employees.0.contact.2.address.country'
        ].toString();
        return testResult;
    };

    // isLeaf
    this.test5 = function () {
        var res = new JefNode({
            x : {
                y : 'z'
            },
            A : {},
            b : [
                    'b', {}, undefined, null, {
                        b1 : 'ba',
                        b2 : {
                            b11 : {},
                            b12 : null
                        }
                    }
            ],
            c : undefined,
            d : null
        }).filter(function (node) {
            if (node.isLeaf) {
                return node.path;
            }
        });
        if (false) {
            console.log(res);
        }
        var testResult = res.toString() === [
                'x.y', 'b.0', 'b.2', 'b.3', 'b.4.b1', 'b.4.b2.b12', 'c', 'd'
        ].toString();
        return testResult;
    };

    // http://stackoverflow.com/questions/25678022/how-to-use-jquery-grep-to-filter-extremely-nested-json
    this.test6 = function () {
        var data = require('./tests2-test6-input');
        var start = new Date('2015-01-03');
        var end = new Date('2015-01-07');
        var success = new JefNode(data).remove(function (node) {
            if (node.has('requests')) {
                var requests = node.value.requests;
                for (var i = 0; i < requests.length; i++) {
                    var request = requests[i];
                    var pick = new Date(request.pickupdate);
                    var ret = new Date(request.returndate);
                    if (!((pick < start && ret < start) || (pick > end && ret > end))) {
                        // pickupdate-returndate overlaps with start-end
                        return node;
                    }
                }
            }
        });

        if (false) {
            console.log(JSON.stringify(data, null, 4));
            console.log(success);
        }
        var expected = JSON.parse(fs.readFileSync(__dirname + '/tests2-test6-expected.json', 'utf8'));
        var testResult = JSON.stringify(data, null, 4) === JSON.stringify(expected, null, 4) && success;
        return testResult;
    };

    /**
     * Circular references
     */
    this.test7 = function () {
        var data = {
            x : {
                a : {
                    b : 'b'
                },
                y : undefined,
                c : 'c',
                arr : [
                        'd', undefined, undefined
                ]
            },
            z : undefined,
            t : undefined
        };
        data.z = data.x;
        data.x.y = data.z;
        data.t = data.z;
        data.x.arr[1] = data.t;
        var res = new JefNode(data).filter(function (node) {
            if (node.isRoot) {
                return 'root';
            } else if (node.isCircular) {
                return 'circular key: ' + node.key + ', path: ' + node.path;
            } else {
                return 'key: ' + node.key + ', path: ' + node.path;
            }
        });
        if (false) {
            console.log(res);
        }
        var testResult = res.toString() === [
                'root',
                'key: x, path: x',
                'key: a, path: x.a',
                'key: b, path: x.a.b',
                'circular key: y, path: x.y',
                'key: c, path: x.c',
                'key: arr, path: x.arr',
                'key: 0, path: x.arr.0',
                'circular key: 1, path: x.arr.1',
                'key: 2, path: x.arr.2',
                'circular key: z, path: z',
                'circular key: t, path: t'
        ].toString();
        return testResult;
    };
    // isEmpty() and count
    this.test8 = function () {
        var res = new JefNode({
            x : {
                y : 'z',
                t : {}
            },
            a : [],
            b : [
                    'p1', {}, {
                        p4 : 'p4'
                    }
            ]
        }).filter(function (node) {
            return node.path + ' ' + node.count + ' ' + node.isEmpty();
        });
        var res2 = new JefNode({}).filter(function (node) {
            return node.path + ' ' + node.count + ' ' + node.isEmpty();
        });
        if (false) {
            console.log(res);
            console.log(res2);
        }
        var testResult = res.toString() === [
                ' 3 false', 'x 2 false', 'x.y 0 true', 'x.t 0 true', 'a 0 true', 'b 3 false', 'b.0 0 true', 'b.1 0 true', 'b.2 1 false', 'b.2.p4 0 true'
        ].toString() && res2.toString() === [
            ' 0 true'
        ].toString();
        return testResult;
    };

    // get('')
    this.test9 = function () {
        var jef = new JefNode({
            x : {
                y : 'z',
                t : {}
            },
            a : [
                    'a', 'b'
            ]
        });
        var res1 = jef.get('');
        var res2 = jef.get('x').get('');
        var res3 = jef.get('a.1').get('');
        var res4 = jef.get('a.1').get();
        if (false) {
            // A
            console.log(res1.isRoot);
            console.log(JSON.stringify(res1.value));
            // B
            console.log(res2.isRoot);
            console.log(JSON.stringify(res2.value));
            // C
            console.log(res3.isRoot);
            console.log(JSON.stringify(res3.value));
            // D
            console.log(res4.isRoot);
            console.log(JSON.stringify(res4.value));
        }
        var resA = res1.isRoot && JSON.stringify(res1.value) === JSON.stringify(JSON.parse('{"x":{"y":"z","t":{}},"a":["a","b"]}'));
        var resB = !res2.isRoot && JSON.stringify(res2.value) === JSON.stringify(JSON.parse('{"y":"z","t":{}}'));
        var resC = !res3.isRoot && JSON.stringify(res3.value) === JSON.stringify(JSON.parse('"b"'));
        var resD = !res4.isRoot && JSON.stringify(res4.value) === JSON.stringify(JSON.parse('"b"'));
        var testResult = resA && resB && resC && resD;
        return testResult;
    };

    // fix bug: path name clash. root.a1 is considered the same as root.a12
    this.test10 = function () {
        var jef = new JefNode({
            a1 : {
                b1 : 'b1'
            },
            a12 : null,
            a13 : null,
        });
        var res = jef.get('a1').filter(function (node) {
            return node.path;
        });
        if (false) {
            console.log(res);
        }
        var testResult = res.toString() === [
                'a1', 'a1.b1'
        ].toString();
        return testResult;
    };
    // hasType()
    this.test11 = function () {
        var jef = new JefNode({
            a1 : {},
            a2 : null,
            a3 : 3,
            a4 : [],
            a5 : 'a5'
        });
        var res = {};
        res.res01 = jef.get('a1').hasType();
        res.res02 = jef.get('a1').hasType('number');
        res.res03 = jef.get('a1').hasType('object');
        res.res04 = jef.get('a1').hasType('number', 'object');
        res.res05 = jef.get('a1').hasType('dummy');
        res.res06 = jef.get('a1').hasType('dummy', 'object');
        res.res07 = jef.get('a2').hasType('object', 'array');
        res.res08 = jef.get('a2').hasType('number', 'null');
        res.res09 = jef.get('a2').hasType('object', 'number', 'null');
        res.res10 = jef.get('a3').hasType('string', 'object');
        res.res11 = jef.get('a3').hasType('number');
        res.res12 = jef.get('a3').hasType('null', 'number', 'string');
        res.res13 = jef.get('a4').hasType('array', 'null');
        res.res14 = jef.get('a4').hasType('null', 'number', 'string');
        res.res15 = jef.get('a5').hasType('null', 'number', 'string');
        res.res16 = jef.get('a5').hasType('null', 'string', 'string');
        res.res17 = jef.get('a5').hasType('null', 'array');
        res.res18 = jef.get('a5').hasType('string', 'number');
        if (false) {
            console.log(JSON.stringify(res, null, 4));
        }
        var testResult = JSON.stringify(res) === JSON.stringify({
            "res01" : false,
            "res02" : false,
            "res03" : true,
            "res04" : true,
            "res05" : false,
            "res06" : true,
            "res07" : false,
            "res08" : true,
            "res09" : true,
            "res10" : false,
            "res11" : true,
            "res12" : true,
            "res13" : true,
            "res14" : false,
            "res15" : true,
            "res16" : true,
            "res17" : false,
            "res18" : true
        });
        return testResult;
    };
    // traverse
    this.test12 = function () {
        var res = [];
        traverse({
            a : 'b',
            c : 'd'
        }, function (key, val) {
            res.push(key);
        });
        if (false) {
            console.log(JSON.stringify(res, null, 4));
        }
        var testResult = JSON.stringify(res) === JSON.stringify([
                null, "a", "c"
        ]);
        return testResult;
    };

    // node.root, localContext.root
    this.test13 = function () {
        var res = new JefNode(sample1).get('employees.5').filter(function (node, localContext) {
            return 'path: ' + node.path + ', root: ' + (node.root.value === sample1) + ', local root: ' + localContext.root.path;
        });
        if (false) {
            console.log(JSON.stringify(res, null, 4));
        }
        var testResult = JSON.stringify(res) === JSON.stringify([
                "path: employees.5, root: true, local root: employees.5",
                "path: employees.5.firstName, root: true, local root: employees.5",
                "path: employees.5.lastName, root: true, local root: employees.5"
        ]);
        return testResult;
    };

    // filterFirst()
    this.test14 = function () {
        var res1 = new JefNode(sample1).filterFirst(function (node, localContext) {
            return 'path: ' + node.path + ', level: ' + node.level + ', local level: ' + localContext.level;
        });
        var res2 = new JefNode(sample1).get('departments').filterFirst(function (node, localContext) {
            return 'path: ' + node.path + ', level: ' + node.level + ', local level: ' + localContext.level;
        });
        var res3 = new JefNode(sample1).filterLevel(2, function (node, localContext) {
            return 'path: ' + node.path + ', level: ' + node.level + ', local level: ' + localContext.level;
        });
        var res4 = new JefNode(sample1).get('departments').filterLevel(2, function (node, localContext) {
            return 'path: ' + node.path + ', level: ' + node.level + ', local level: ' + localContext.level;
        });
        if (false) {
            console.log('res1:');
            console.log(JSON.stringify(res1, null, 4));
            console.log('res2:');
            console.log(JSON.stringify(res2, null, 4));
            console.log('res3:');
            console.log(JSON.stringify(res3, null, 4));
            console.log('res4:');
            console.log(JSON.stringify(res4, null, 4));
        }
        var testResult1 =JSON.stringify(res1) === JSON.stringify([
                                                                  "path: departments, level: 1, local level: 1",
                                                                  "path: employees, level: 1, local level: 1"
                                                              ]); 
        var testResult2 =JSON.stringify(res2) === JSON.stringify([
                                                                  "path: departments.admin, level: 2, local level: 1",
                                                                  "path: departments.it, level: 2, local level: 1",
                                                                  "path: departments.finance, level: 2, local level: 1",
                                                                  "path: departments.marketing, level: 2, local level: 1",
                                                                  "path: departments.hr, level: 2, local level: 1",
                                                                  "path: departments.supply, level: 2, local level: 1"
                                                              ]); 
        var testResult3 =JSON.stringify(res3) === JSON.stringify([
                                                                  "path: departments.admin, level: 2, local level: 2",
                                                                  "path: departments.it, level: 2, local level: 2",
                                                                  "path: departments.finance, level: 2, local level: 2",
                                                                  "path: departments.marketing, level: 2, local level: 2",
                                                                  "path: departments.hr, level: 2, local level: 2",
                                                                  "path: departments.supply, level: 2, local level: 2",
                                                                  "path: employees.0, level: 2, local level: 2",
                                                                  "path: employees.1, level: 2, local level: 2",
                                                                  "path: employees.2, level: 2, local level: 2",
                                                                  "path: employees.3, level: 2, local level: 2",
                                                                  "path: employees.4, level: 2, local level: 2",
                                                                  "path: employees.5, level: 2, local level: 2"
                                                              ]); 
        var testResult4 =JSON.stringify(res4) === JSON.stringify([
                                                                  "path: departments.admin.name, level: 3, local level: 2",
                                                                  "path: departments.admin.manager, level: 3, local level: 2",
                                                                  "path: departments.admin.employees, level: 3, local level: 2",
                                                                  "path: departments.it.name, level: 3, local level: 2",
                                                                  "path: departments.it.manager, level: 3, local level: 2",
                                                                  "path: departments.it.employees, level: 3, local level: 2",
                                                                  "path: departments.finance.name, level: 3, local level: 2",
                                                                  "path: departments.finance.manager, level: 3, local level: 2",
                                                                  "path: departments.finance.employees, level: 3, local level: 2",
                                                                  "path: departments.marketing.name, level: 3, local level: 2",
                                                                  "path: departments.marketing.employees, level: 3, local level: 2",
                                                                  "path: departments.hr.name, level: 3, local level: 2",
                                                                  "path: departments.supply.employees, level: 3, local level: 2"
                                                              ]); 
        var testResult = testResult1 && testResult2 && testResult3 && testResult4;
        return testResult;
    };
};

module.exports = function () {
    return new Tests2();
};
