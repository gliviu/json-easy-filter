"use strict";

var traverse = require("traverse");

var ROOT_KEY = '$root_4285190851';


var _getPathStr = function(path, delimiter){
	if(!delimiter){
		delimiter = '.';
	}
	var res = '';
	for(var i = 0; i<path.length; i++){
		if(i!==0){
			res+=delimiter;
		}
		res+=path[i];
	}
	return res;
};

var JefLocalContext = function(localNode, globalNode){
	this.isRoot = false;
	if(globalNode.path === localNode.path){
		this.isRoot = true;
	}
	this.level = localNode.pathArray.length - globalNode.pathArray.length;
	this.pathArray = localNode.pathArray.slice(globalNode.pathArray.length, localNode.pathArray.length);
	this.path = _getPathStr(this.pathArray);
};


var JefNode = function(){
	this.key = null;
	this.value = null;
	this.parent = null;
	this.isRoot = null;
	this.pathArray = [];
	this.path = null;
	this.isLeaf = null;
	this.isCircular = null;
	this.level = null;
	this.get = function(relPathStr){
		var absolutePath;
		if(this.isRoot){
			absolutePath = relPathStr;
		} else{
			absolutePath = this.path+'.'+relPathStr;
		}
		return this._nodeHash[ROOT_KEY+'.'+absolutePath];
	};
	this.filter = function(callback){
		var result = [];
		for(var absolutePath in this._nodeHash){
			if(absolutePath.indexOf(this._internalPath)===0){
				var node = this._nodeHash[absolutePath];
				
				var resCallBack = callback(node, new JefLocalContext(node, this));
				if(resCallBack!==undefined){
					result.push(resCallBack);
				}
			}
		}
		return result;
	};

	this.validate = function(callback){
		var result = true;
		this.filter(function(node, localContext){
            var resCallBack = callback(node, localContext);
            if(resCallBack===false){
                result = false;
            }
		});
		return result;
	};

    this.remove = function(callback){
        var toDelete = this.filter(function(node, localContext){
            return callback(node, localContext);
        });
        var successful = true;
        // one toDelete element may be a JefNode or an array of JefNodes
        // recurses into result and removes nodes. 
        var removeNodes = function(node){
            if(node instanceof Array){
                node.forEach(function(arrayElem){
                    removeNodes(arrayElem);
                });
            } else if(node instanceof JefNode){
                if(node.isRoot){
                    console.log("Root node cannot be deleted.");
                    successful = false;
                } else if(node.parent.getType()==='array'){
                    var array = node.parent.value;
                    var index = array.indexOf(node.value);
                    array.splice(index, 1);
                } else{
                    delete node.parent.value[node.key]; 
                }
            } else{ 
                console.log("Only JefNode objects must be returned from delete callback.");
                successful = false;
            }
        };
        removeNodes(toDelete);
        
        return successful;
    };
	
	
	this.has = function(key){
		if(!this.value){
			return false;
		}
		if(key instanceof RegExp){
			if(this.getType()==='object'){
				for(var k in this.value){
					if(key.test(k)){
						return true;
					}
				}
				return false;
			} else{
				return false;
			}
		} else{
			if(this.value[key]!==undefined){
				return true;
			} else{
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

	//////////////////////////
	// Private stuff
	//////////////////////////
	this._nodeHash = null;
	this._internalPath = null; // Just like this.path only it starts with ROOT_KEY.

	this._debugNodeHash = function(){
		for(var absolutePath in this._nodeHash){
			if(absolutePath.indexOf(this._internalPath)===0){
				console.log(absolutePath);
			}
		}
	};
};


var Jef = function(obj){
	this._traverse = function(obj){
		var nodeHash = {};
		traverse(obj).forEach(function(val){
			// console.log(val);
			var node = new JefNode();
			node._nodeHash = nodeHash;
			node.pathArray = this.path;
			node.path = _getPathStr(node.pathArray);
			node.key = this.key;
			node.value = this.node;
			node.level = this.level;
			node.isRoot = this.isRoot;
			node.isLeaf = this.isLeaf;
			node.isCircular = this.circular;

			// Internal path
			if(this.level===0){
				node._internalPath = ROOT_KEY;
			} else{
				node._internalPath = ROOT_KEY+'.'+_getPathStr(node.pathArray);
			}
			
			// Hash
			if(node.isRoot){
				nodeHash[ROOT_KEY] = node;
			} else{
				nodeHash[ROOT_KEY+'.'+node.path] = node;
			}
			
			// Parent
			var parentPath = node.pathArray.slice(0, node.pathArray.length - 1);
			var parentNode;
			if(parentPath.length === 0){
				parentNode = nodeHash[ROOT_KEY];
			} else{
				parentNode = nodeHash[ROOT_KEY+'.'+_getPathStr(parentPath)];
			}
			if(parentNode){
				node.parent = parentNode;
			}
		});
		return nodeHash;
	};
	this._build = function(obj){
		var nodeHash = this._traverse(obj);
		
		return nodeHash[ROOT_KEY];
	};
	
	return this._build(obj);
};

module.exports = Jef;