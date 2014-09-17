Jef = function () {
    "use strict";


    var _getPathStr = function (path, delimiter) {
        if (!delimiter) {
            delimiter = '.';
        }
        var res = '';
        for (var i = 0; i < path.length; i++) {
            if (i !== 0) {
                res += delimiter;
            }
            res += path[i];
        }
        return res;
    };

    var JefLocalContext = function (localNode, globalNode) {
        this.isRoot = false;
        if (globalNode.path === localNode.path) {
            this.isRoot = true;
        }
        this.level = localNode.pathArray.length - globalNode.pathArray.length;
        this.pathArray = localNode.pathArray.slice(globalNode.pathArray.length, localNode.pathArray.length);
        this.path = _getPathStr(this.pathArray);
    };

    var JefNode = function () {
        this.key = null;
        this.value = null;
        this.parent = null;
        this.isRoot = null;
        this.pathArray = [];
        this.path = null;
        this.isLeaf = null;
        this.isCircular = null;
        this.level = null;
        this.count = 0;
        this.isEmpty = function(){
            return this.count===0;
        };
        this.get = function (relPathStr) {
            var absolutePath;
            if (this.isRoot) {
                absolutePath = relPathStr;
            } else {
                absolutePath = this.path + '.' + relPathStr;
            }
            return this._nodeHash[rootkey + '.' + absolutePath];
        };
        this.filter = function (callback) {
            var result = [];
            for ( var absolutePath in this._nodeHash) {
                if (absolutePath.indexOf(this._internalPath) === 0) {
                    var node = this._nodeHash[absolutePath];

                    var resCallBack = callback(node, new JefLocalContext(node, this));
                    if (resCallBack !== undefined) {
                        result.push(resCallBack);
                    }
                }
            }
            return result;
        };

        this.validate = function (callback) {
            var result = true;
            this.filter(function (node, localContext) {
                var resCallBack = callback(node, localContext);
                if (resCallBack === false) {
                    result = false;
                }
            });
            return result;
        };

        this.remove = function (callback) {
            var toDelete = this.filter(function (node, localContext) {
                return callback(node, localContext);
            });
            var successful = true;
            // one toDelete element may be a JefNode or an array of JefNodes
            // recurses into result and removes nodes.
            var removeNodes = function (node) {
                if (node instanceof Array) {
                    node.forEach(function (arrayElem) {
                        removeNodes(arrayElem);
                    });
                } else if (node instanceof JefNode) {
                    if (node.isRoot) {
                        console.log("Root node cannot be deleted.");
                        successful = false;
                    } else if (node.parent.getType() === 'array') {
                        var array = node.parent.value;
                        var index = array.indexOf(node.value);
                        array.splice(index, 1);
                    } else {
                        delete node.parent.value[node.key];
                    }
                } else {
                    console.log("Only JefNode objects must be returned from delete callback.");
                    successful = false;
                }
            };
            removeNodes(toDelete);

            return successful;
        };

        this.has = function (key) {
            if (!this.value) {
                return false;
            }
            if (key instanceof RegExp) {
                if (this.getType() === 'object') {
                    for ( var k in this.value) {
                        if (key.test(k)) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    return false;
                }
            } else {
                if (this.value[key] !== undefined) {
                    return true;
                } else {
                    return false;
                }
            }
        };

        /**
         * Returns one of string, array, object, function, undefined, number
         */
        this.getType = function () {
            return ({}).toString.call(this.value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        };

        // ////////////////////////
        // Private stuff
        // ////////////////////////
        this._nodeHash = null;
        this._internalPath = null; // Just like this.path only it starts with
        // rootkey.

        this._debugNodeHash = function () {
            for ( var absolutePath in this._nodeHash) {
                if (absolutePath.indexOf(this._internalPath) === 0) {
                    console.log(absolutePath);
                }
            }
        };
    };

    var traverse = function (obj, callback) {
        var seenObjects = [];

        var recurse = function (key, val, parent, isRoot, path, level) {
            // if(key==='d') debugger;
            var isArray = val instanceof Array;
            var isObject = typeof val === 'object' && !isArray;
            var isNull = val === null;

            // Leaf
            var notLeaf = (isObject && !isNull) || isArray;
            var isLeaf = !notLeaf;

            // Circular
            var isCircular = false;
            if (seenObjects.indexOf(val) !== -1) {
                isCircular = true;
            } else {
                seenObjects.push(val);
            }

            // console.log('key: ' + key + ', isRoot: ' + isRoot + ', isLeaf: '
            // +
            // isLeaf + ', level: ' + level + ', isCircular: ' + isCircular + ',
            // path: ' + path);
            callback(key, val, path, parent, level, isRoot, isLeaf, isCircular);
            if (!isCircular) {
                var childKey, newPath;
                if (isObject) {
                    for (childKey in val) {
                        newPath = path.concat([
                            childKey
                        ]);
                        recurse(childKey, val[childKey], val, false, newPath, level + 1);
                    }
                }
                if (isArray) {
                    for (var i = 0; i < val.length; i++) {
                        childKey = '' + i;
                        newPath = path.concat([
                            childKey
                        ]);
                        recurse(childKey, val[i], val, false, newPath, level + 1);
                    }
                }
            }
        };
        recurse(undefined, obj, undefined, true, [], 0);
    };

    var rootkey = '$root_4285190851';
    var Jef = function (obj) {
        this._traverse = function (obj) {
            var nodeHash = {};
            traverse(obj, function (key, val, path, parent, level, isRoot, isLeaf, isCircular) {
                var node = new JefNode();
                node._nodeHash = nodeHash;
                node.pathArray = path;
                node.path = _getPathStr(node.pathArray);
                node.key = key;
                node.value = val;
                node.level = level;
                node.isRoot = isRoot;
                node.isLeaf = isLeaf;
                node.isCircular = isCircular;

                // internal path
                if (node.level === 0) {
                    node._internalPath = rootkey;
                } else {
                    node._internalPath = rootkey + '.' + _getPathStr(node.pathArray);
                }

                // hash
                if (node.isRoot) {
                    nodeHash[rootkey] = node;
                } else {
                    nodeHash[rootkey + '.' + node.path] = node;
                }

                // parent
                var parentPath = node.pathArray.slice(0, node.pathArray.length - 1);
                var parentNode;
                if (parentPath.length === 0) {
                    // root node
                    parentNode = nodeHash[rootkey];
                } else {
                    parentNode = nodeHash[rootkey + '.' + _getPathStr(parentPath)];
                }
                if (parentNode) {
                    node.parent = parentNode;
                }
                
                // count
                if(!node.isRoot){
                    node.parent.count++;
                }
            });
            return nodeHash;
        };
        this._build = function (obj) {
            var nodeHash = this._traverse(obj);

            return nodeHash[rootkey];
        };

        return this._build(obj);
    };

    return Jef;
}();
