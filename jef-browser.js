var Jef = function () {
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

    var JefLocalContext = function (localNode, rootNode) {
        this.isRoot = false;
        this.root = rootNode;
        if (rootNode.path === localNode.path) {
            this.isRoot = true;
        }
        this.level = localNode.pathArray.length - rootNode.pathArray.length;
        this.pathArray = localNode.pathArray.slice(rootNode.pathArray.length, localNode.pathArray.length);
        this.path = _getPathStr(this.pathArray);
    };

    var JefNode = function (obj) {
        this.isEmpty = function () {
            return this.count === 0;
        };
        this.get = function (relPathStr) {
            if (!relPathStr) {
                return this;
            }
            var absolutePath;
            if (this.isRoot) {
                absolutePath = relPathStr;
            } else {
                absolutePath = this.path + '.' + relPathStr;
            }
            return this._nodeHash[rootkey + '.' + absolutePath];
        };

        /**
         * Internal method for iterating 'this' and its children.
         */
        this._iterate = function (iterCallback) {
            var that = this;
            traverse(this.value, function (key, val, pathArr, parentKey, parentVal, level, isRoot) {
                var pathStr = that._internalPath + (isRoot ? '' : '.' + _getPathStr(pathArr));
                var node = that._nodeHash[pathStr];
                iterCallback(node);
            });
        };

        this._filter = function (callback, level) {
            var result = [];
            var that = this;

            this._iterate(function (node) {
                var localContext = new JefLocalContext(node, that)
                if(!level || (level && localContext.level === level)){
                    var resCallBack = callback(node, localContext);
                    if (resCallBack !== undefined) {
                        result.push(resCallBack);
                    }
                }
            });
            return result;
        };

        this.filter = function (callback) {
            return this._filter(callback);
        };
        
        this.filterFirst = function(callback){
            return this._filter(callback, 1);
        }

        this.filterLevel = function(level, callback){
            return this._filter(callback, level);
        }

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
                    } else if (node.parent.type() === 'array') {
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
                if (this.type() === 'object') {
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
         * Deprecated.
         */
        this.getType = function () {
            return this.type();
        };

        /**
         * Returns one of 'string', 'array', 'object', 'function', 'number',
         * 'boolean', 'undefined', 'null'
         */
        this.type = function () {
            return ({}).toString.call(this.value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        };
        /**
         * Returns true if current value has any of the types given as
         * arguments.
         */
        this.hasType = function () {
            if (arguments.length === 1) {
                return this.type() === arguments[0];
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    if (this.type() === arguments[i]) {
                        return true;
                    }
                }
                return false;
            }
        };

        this.refresh = function () {

            // mark all children to be deleted. later they will be unmarked if
            // necessary
            var toDelete = {};
            var internalPath = this._internalPath + '.';
            for ( var absolutePath in this._nodeHash) {
                if (absolutePath.indexOf(internalPath) === 0) {
                    toDelete[absolutePath] = true;
                }
            }

            var that = this;
            traverse(this.value, function (key, val, path, parentKey, parentVal, level, isRoot, isLeaf, isCircular) {
                if (isRoot) {
                    return;
                }
                var internalPath = that._internalPath + '.' + _getPathStr(path);
                toDelete[internalPath] = false;

                // create or get existing node
                var node;
                if (!that._nodeHash[internalPath]) {
                    node = new JefNode();
                    node._nodeHash = that._nodeHash;
                    node.root = that._nodeHash[rootkey];
                    node._internalPath = internalPath;
                    node.pathArray = that.pathArray.concat(path);
                    node.path = that.isRoot ? _getPathStr(node.pathArray) : that.path + '.' + _getPathStr(node.pathArray);
                    node.key = key;
                    that._nodeHash[internalPath] = node;

                    // parent
                    var parentPath = node.pathArray.slice(0, node.pathArray.length - 1);
                    var parentNode;
                    if (parentPath.length === 0) {
                        // parent is root node
                        parentNode = that._nodeHash[rootkey];
                    } else {
                        parentNode = that._nodeHash[rootkey + '.' + _getPathStr(parentPath)];
                    }
                    if (parentNode) {
                        node.parent = parentNode;
                    }

                    // count
                    node.parent.count++;
                } else {
                    node = that._nodeHash[internalPath];
                }

                // update node
                node.value = val;
                node.level = that.level + level;
                node.isRoot = false;
                node.isLeaf = isLeaf;
                node.isCircular = isCircular;

            });

            // remove nodes that no longer exist
            for ( var internalPath in toDelete) {
                if (toDelete[internalPath] === true) {
                    delete this._nodeHash[internalPath];
                }
            }
        };

        // ////////////////////////
        // Private stuff
        // ////////////////////////
        this._nodeHash = null;
        this._internalPath = null; // Just like this.path only it starts with

        this.print = function (showContent) {
            var res = [];
            var that = this;

            this._iterate(function (node) {
                if (showContent) {
                    res.push(node._internalPath.replace(rootkey, 'root') + ' - ' + JSON.stringify(that._nodeHash[node._internalPath].value));
                } else {
                    res.push(node._internalPath.replace(rootkey, 'root'));
                }
            });
            return res;
        };

        // ////////////////////////
        // Constructor
        // ////////////////////////
        this.count = 0;
        if (obj) {
            this.root = this;
            this._nodeHash = {};
            this.pathArray = [];
            this.path = '';
            this.value = obj;
            this.level = 0;
            this.isRoot = true;
            this.isLeaf = isItLeaf(obj);
            this.isCircular = false;
            this._internalPath = rootkey;
            this._nodeHash[rootkey] = this;
            this.parent = this;
            this.refresh();
        }
    };

    var isItLeaf = function (val) {
        var isArray = val instanceof Array;
        var isObject = typeof val === 'object' && !isArray;

        // Leaf
        var notLeaf = (isObject && val !== null) || isArray;
        return !notLeaf;
    };

    var traverse = function (obj, callback) {
        var seenObjects = [];

        var recurse = function (key, val, parentKey, parentVal, isRoot, path, level) {
            var isArray = val instanceof Array;
            var isObject = typeof val === 'object' && !isArray;

            // Leaf
            var isLeaf = isItLeaf(val);

            // Circular
            var isCircular = false;
            if (seenObjects.indexOf(val) !== -1) {
                isCircular = true;
            } else {
                seenObjects.push(val);
            }

            callback(key, val, path, parentKey, parentVal, level, isRoot, isLeaf, isCircular);
            if (!isCircular) {
                var childKey, newPath;
                if (isObject) {
                    for (childKey in val) {
                        newPath = path.concat([
                            childKey
                        ]);
                        recurse(childKey, val[childKey], key, val, false, newPath, level + 1);
                    }
                }
                if (isArray) {
                    for (var i = 0; i < val.length; i++) {
                        childKey = '' + i;
                        newPath = path.concat([
                            childKey
                        ]);
                        recurse(childKey, val[i], key, val, false, newPath, level + 1);
                    }
                }
            }
        };
        recurse(undefined, obj, undefined, undefined, true, [], 0);
    };

    var rootkey = '$root_4285190851';

    return {
        'JefNode' : JefNode,
        'traverse' : traverse
    };
}();
var JefNode = Jef.JefNode;
var traverse = Jef.traverse;