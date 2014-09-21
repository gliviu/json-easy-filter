"use strict";

var fs = require('fs');
var Jef = require('../index');

var Tests3 = function () {
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
        var root = new Jef(d);
        var res1 = root.printHash();

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
        root.refresh()
        var res2 = root.printHash();
        if (false) {
            console.log(res1);
            console.log(res2);
        }
        var testResult1 = res1.toString() === [
                'root',
                'root.a1',
                'root.a1.b1',
                'root.a1.b2',
                'root.a1.b2.c1',
                'root.a1.b3',
                'root.a1.b3.0',
                'root.a1.b3.1',
                'root.a1.b3.1.c1',
                'root.a2',
                'root.a4',
                'root.a4.b2',
                'root.a4.b4',
                'root.a4.b4.c1'
        ].toString();
        var testResult2 = res2.toString() === [
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
        var testResult = testResult1 && testResult2;
        return testResult;
    };
};

module.exports = function () {
    return new Tests3();
};
