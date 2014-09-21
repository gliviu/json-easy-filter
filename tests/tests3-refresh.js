"use strict";

var fs = require('fs');
var Jef = require('../index');
var jsdiff = require('diff');

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
        var root = new Jef(d);
        var res1 = root.print();

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
        var res2 = root.print();
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
    // arrays
    this.test2 = function () {
        var d = {
            a1 : {
                b1 : [
                        'c1', 'c2', {
                            d1 : 'd1',
                            d2: ['e1', 'e2', 'e3']
                        },{
                            g1: ['h1', 'h2']
                        },{
                            m1: ['n1', 'n2']
                        }
                ]
            }
        };
        var root = new Jef(d);
        var res1 = root.print(true);

        delete d.a1.b1.splice(1, 1); // remove first element
        
        root.refresh()
        var res2 = root.print(true);
        if (true) {
            console.diff(res1, res2);
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

function diff(v1, v2){
    var d = jsdiff.diffChars(one, other);

    d.forEach(function(part){
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? 'green' :
        part.removed ? 'red' : 'grey';
      process.stderr.write(part.value[color]);
    });
    
}

module.exports = function () {
    return new Tests3();
};
