/**
 * Easy JS Framework to get / edit localStorage
 *
 * @class cStorage
 * @version 0.2.3
 * @license MIT
 *
 * @author Christian Marienfeld post@chrisand.de
 *
 * ### Examples:
 *
*	var obj = {"data":[{id:1},{id:2},{id:3}]};
*	var storage = new cStorage('test').save(obj);
*
*	var item = storage.root('data').find({id:2});
*
*	var myItemObject = item.get();
*
*	item.edit({name:"Hello World"});
*
*	var json = storage.toString();
*	// json = {"data":[{"id":1},{"id":2,"name":"Hello World"},{"id":3}]}
*
*
 *
 * @param {String} dbname Name of localStorage
 * @param {String} [rootString] Dot seperated path to get deeper into the object or array
 *
 * @return {Object} cStorage Object

 * @api public
 */


function cStorage(dbname, rootString) {

	if (!dbname) {
		throw new Error('missing function params');
		return false;
	} else {

		this._dbname = dbname;
		this._data = _helper.getStorage(this._dbname);

		//console.log(Object.keys(this._data).length);



		this._foundParent = this.root(rootString)._foundParent;
		this._foundChild = false;
    this._foundPath = false;

		this._isFound = false;



		return this;
	}

}





/**
* Save the Main-Data-Object to the localStorage
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	storage.save({my:"test"});
*
* @function save
* @version 0.1.0
*
* @param {Object} [obj=global data] The object to save to localStorage
* @param {Boolean} [encode=false] Encode the value for a conflict free json string
* @param {Boolean} [deeper=true] Encode deep values
*
* @return {Object} cStorage object
*
* @api public
*/


cStorage.prototype.save = function(obj, encode, deeper) {
	if (!obj || typeof obj !== 'object') {
		obj = this._data;
	}
	if (deeper == undefined) {
		deeper = true;
	}
	if (encode){
		_helper.loop(obj, function (root, k) {
			return _helper.encode(root[k]);
		}, null, null, null, deeper);
	}
	this._data = this._foundParent = obj;
	this._isFound = false;
	window.localStorage.setItem(this._dbname, this.toString());

	return this;
};




/**
* Navigate into the Main-Data-Object
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	storage.root('data');
*	storage.root('data.user');
*	storage.root('data.user.4');
*
* @function root
* @version 0.1.0
*
* @param {String} [root=rootObject] Dot seperated path to get deeper into the object or array
*
* @return {Object} cStorage Object
*
* @api public
*/


cStorage.prototype.root = function(root){
	this._isFound = false;
	if (!root) {
		this._foundParent = this._data;
	} else {

		var loopRoot = _helper.getRootObjFromString(this._data, root);
		if (loopRoot) {
			this._foundParent = loopRoot;
			this._foundPath = root.split('.');
			this._isFound = true;
		}
	}
	return this;
};



/**
* Find Note from Selected-Data-Object
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	storage.find({id:3});
*
*	storage.root('data').find({id:3}, true);
*
*	storage.root('json').find({name:"erde"}, false);
*
*	storage.find({text:"find this value"});
*
* @function find
* @version 0.1.0
*
* @param {String} param Selector Object
* @param {Boolean} [deeper=true] Search deeper into the object
*
* @return {Object} cStorage Object
*
* @api public
*/


cStorage.prototype.find = function(param, deeper) {

	if (!param) {
		return false;
	}

	if (deeper == undefined) {
		deeper = true;
	}
	var findKey, findValue;

	if (typeof param === 'string' || typeof param === 'number' ) {
		findValue = findKey = param;
	} else {

		for(var i in param){
		  findKey = i;
		  findValue = param[i];
		}
	}

	var root = this._foundParent;
	var that = this;

	that._isFound = false;

	// var path = [];
	// var alwaysFound = function (a,b,c) {
	// 	console.log('LOOP!', a, b, c);
	// 	//###path.push(b);
	// };

	_helper.loop(root, null, {key:findKey, value:findValue}, function (parent, child, path) {

    console.log('callback','parent',parent, 'child',child, 'path',path);
		that._foundParent = parent;
		that._foundChild = child;
    	that._foundPath = path;

		that._isFound = true;

		//console.log(that);
		//return that;
	}, that, deeper);

	return this;

};



/**
* Return the Selected-Data-Object
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	var get = storage.get();
*
*	var get = storage.root('data').get();
*	var get = storage.get('data');
*
*	var get = storage.root('data').find({id:4}).get();
*	var get = storage.root('data').find({id:4}).get(null,true); //decode values
*
*	var get = storage.get('data',true,false); //decode values but not deep
*
*
* @function get
* @version 0.1.0
*
* @param {String} [root=rootObject] Dot seperated path to get deeper into the object or array
* @param {Boolean} [decode=false] Decode the value for humanreadable text
* @param {Boolean} [deeper=true] Encode all deeper values from object
*
* @return {Object} Note object
*
* @api public
*/


cStorage.prototype.get = function(root, decode, deeper) {

	var obj = this._foundParent;
	if (root) {
		obj = _helper.getRootObjFromString(this._data, root);
	}
	if (decode){
		if (deeper == undefined) {
			deeper = true;
		}
		_helper.loop(obj, function (root, k) {
			return _helper.decode(root[k]);
		}, null, null, null, deeper);
	}
	return obj;
};



/**
* Return a clone of the Selected-Data-Object
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	var clone = storage.clone();
*
*	var clone = storage.root('data').clone();
*
*	var clone = storage.root('data').find({id:6}).clone();
*
*
* @function clone
* @version 0.1.0
*
* @return {Object} Cloned note object
*
* @api public
*/


cStorage.prototype.clone = function() {
	return JSON.parse(JSON.stringify(this._foundParent));
};



/**
* Edit the Selected-Data-Object value
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	storage.root('data').edit({value:6});
*
*	storage.find({id:1}).edit({data:'new Data'});
*
*	storage.find({id:2}).edit({
*		text:'HERE IS AN NEW WORLD',
*		lang: 'The new World'
*	});
*
* @function edit
* @version 0.1.0
*
* @param {Object} obj Object with key and new value
*
* @return {Object} cStorage Object
*
* @api public
*/



cStorage.prototype.edit = function(obj) {

	if (Object.prototype.toString.call( this._foundParent ) === '[object Array]') {
		return this;
	}
	if (!obj) {
		return this;
	}
	var findKey, findKey;
	for(var i in obj){
		findKey = i || '';
		findValue = obj[i] || '';
		if (findKey) {
			this._foundParent[findKey] = findValue;
		}
	}
	this.save();

	return this;
};


/**
* Add to the Selected-Data-Object
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	storage.root('data').add({value:6});
*
*	storage.find({id:1}).add({data:'new Data'});
*
*	storage.root('data').add({
*		id: 5,
*		text:'HERE IS AN NEW WORLD',
*		lang: 'The new World'
*	});
*
*	storage.root('data').add([{id:4},{id:5}]);
*
*
* @function add
* @version 0.1.0
*
* @param {Object} obj Object to insert
*
* @return {Object} cStorage Object
*
* @api public
*/


cStorage.prototype.add = function(obj) {
	if (!obj) {
		return this;
	}
	var root = this._foundParent;
	var that = this;

	var doit = function (r,p) {
		if (Object.prototype.toString.call( r ) === '[object Object]') {
			var findKey, findKey;
			for(var i in p){
				findKey = i || '';
				findValue = p[i] || '';
				if (findKey) {
					r[findKey] = findValue;
				}
			}
		} else if (Object.prototype.toString.call( r ) === '[object Array]') {
			r.push(p);
		}
	};

	if (Object.prototype.toString.call( obj ) === '[object Array]') {
		for(var i in obj){
			doit(root, obj[i]);
		}
	} else {
		doit(root, obj);
	}
	this.save();

	return this;
};






/**
* Remove the Selected-Data-Object value
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	storage.root('data').edit({value:6});
*
*	storage.find({id:1}).edit({data:'new Data'});
*
*	storage.find({id:2}).edit({
*		text:'HERE IS AN NEW WORLD',
*		lang: 'The new World'
*	});
*
* @function remove
* @version 0.2.3
*
*
* @return {Object} cStorage Object
*
* @api public
*/



cStorage.prototype.remove = function() {

	console.log('REMOVE --------------------!');


    //delete this._foundParent;
    //alert(this._foundParent.indexOf);
    //delete this._data.data[0];
	if (!this._foundPath && this._foundParent) {
		return false;
	}
	var root = JSON.parse(JSON.stringify(this._foundPath));
	var first = root.pop();
	//var second = root.pop();
	root = root.join('.');

	console.log('_foundPath',this._foundPath);
	console.log('_foundParent',this._foundParent);
	console.log('first',first);
	//console.log('second', second);
	console.log('root', root);

	console.log('1: data',JSON.parse(JSON.stringify(this._data)));

	var loopRoot = _helper.getRootObjFromString(this._data, root);
	if (loopRoot) {
		console.log('loopRoot',loopRoot);

		if (Object.prototype.toString.call( loopRoot ) === '[object Array]') {
			console.log('array!', loopRoot, first);
			//console.log(this._foundParent.indexOf());
			loopRoot.splice(first,1);

			//return this;
		} else if (Object.prototype.toString.call( loopRoot ) === '[object Object]') {
			console.log('object!',loopRoot);
			delete loopRoot[first];
		} else {
			console.log('nothing!');
			//return this;
		}



		console.log('2: data',this._data);
	} else {
		return false;
	}
	return this;



  //
	// if (!obj) {
	// 	return this;
	// }
	// var findKey, findKey;
	// for(var i in obj){
	// 	findKey = i || '';
	// 	findValue = obj[i] || '';
	// 	if (findKey) {
	// 		this._foundParent[findKey] = findValue;
	// 	}
	// }
	// this.save();
  //this.save();
	//return this;
};





/**
* Loop to the Selected-Data-Object
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	storage.map(function (obj, key, value) {
*		console.log(obj, key, value);
*	});
*
*	storage.root('data').map(function (obj, key, value) {
*		console.log(obj, key, value);
*	});
*
*	storage.root('data').map(function (obj, key, value) {
*		console.log(obj, key, value);
*	}, false);
*
*
* @function map
* @version 0.1.0
*
* @param {Function} callback Call this function each note
* @param {Boolean} [deeper=true] Search deeper into the object
*
* @return {Object} cStorage Object
*
* @api public
*/



cStorage.prototype.map = function(callback, deeper) {
	if (!callback && typeof callback !== 'function') {
		throw new Error('missing function params');
		return false;
	}
	if (deeper == undefined) {
		deeper = true;
	}
	return _helper.loop(this._foundParent, callback, null,null, this, deeper);
};








/**
* Return the Selected-Data-Value
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	var json = storage.getValue();
*
*	var json = storage.getValue(true); //decode values
*
*
* @function getValue
* @version 0.1.0
*
* @param {Boolean} [decode=false] Decode the value for humanreadable text
*
* @return {Object} Value Object
*
* @api public
*/


cStorage.prototype.getValue = function(decode) {
	if (decode) {
		return _helper.decode(this._foundChild);
	} else {
		return this._foundChild;
	}
};














/**
* Return a unique identifier of the Selected-Data-Object
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	var nextId = storage.getUid();
*
*	var nextId = storage.root('data').getUid();
*
*	var nextId = storage.root('json.data.users').getUid();
*
*
* @function getUid
* @version 0.2.2
*
* @param {String} key Name of the unique identifier
*
* @return {Number} a unique identifier as integer
*
* @api public
*/


cStorage.prototype.getUid = function(key, deeper) {

	if (!key) {
		throw new Error('missing function params');
		return false;
	}
	var root = this._foundParent;
	if (deeper == undefined) {
		deeper = true;
	}
	var ret = false;
	var set = function (value) {
		if (!ret) {
			ret = parseInt(value);
		} else {
			if (ret < value) {
				ret = parseInt(value);
			}
		}
	};
	var allways = function (root, k, value) {
		if (key == k) {
			set(value);
		}
	};
	_helper.loop(root, allways, null, null, null, deeper);
	if (!ret || isNaN(ret)) {
		ret = 0
	}

	return parseInt(ret)+1;
};




/**
* Return the Selected-Data-Object as JSON-String
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	var json = storage.toString();
*
*	var json = storage.root('data').toString();
*
*	var json = storage.toString('data');
*	var json = storage.toString('data', true, false); //decode values but not deep
*
*	var json = storage.root('data').find({id:4}).toString();
*	var json = storage.root('data').find({id:4}).toString(null,true); //decode values
*
*
* @function toString
* @version 0.1.0
*
* @param {String} [root=rootObject] Dot seperated path to get deeper into the object or array
* @param {Boolean} [decode=false] Decode the value for humanreadable text
* @param {Boolean} [deeper=true] Encode all deeper values from object
*
* @return {String} Note Object as JSON-String
*
* @api public
*/



cStorage.prototype.toString = function(root, decode, deeper) {
	return JSON.stringify( this.get(root, decode, deeper) );
};



/**
* Return true if Main-Data-Object is empty
*
* ### Examples:
*
*	var storage = new cStorage('emptyDb');
*
*	var check = storage.isEmpty();
*
*
* @function isEmpty
* @version 0.2.0
*
* @return {Boolean} filled (false) or not filled (true)
*
* @api public
*/


cStorage.prototype.isEmpty = function() {
	var root = this._foundParent;
	if (JSON.stringify(root).replace(/[{}\[\]]/g, "") == '') {
		return true;
	} else {
		return false;
	}
};



/**
* Return true if last Search was successful
* ( functions: root(), find() )
*
* ### Examples:
*
*	var storage = new cStorage('test');
*
*	var check = storage.root('data').isFound();
*
*	var check = storage.find({id:4}).isFound();
*
*
*
* @function isFound
* @version 0.2.0
*
* @return {Boolean} true if last root() or find() was successful
*
* @api public
*/


cStorage.prototype.isFound = function() {
	return this._isFound;
};









var _helper = {

	getStorage: function(name) {

		var localDb = window.localStorage.getItem(name) || '{}';
		var obj = {};

		try{
			obj = JSON.parse(localDb);
			if (typeof obj === 'object') {
				return obj;
			}
			return {};

		} catch(e){
	        throw new Error('non well formed json string');
	        return {};
	    }
	},

	encode: function (str) {
		if (str && typeof str === 'string') {
			return encodeURIComponent(str);
		}
		return str;
	},
	decode: function (str) {
		if (str && typeof str === 'string') {
			return decodeURIComponent(str.replace(/\+/g, " "));
		}
		return str;
	},

	getRootObjFromString: function (obj, root) {
		if (!obj) {
			return false;
		}
		var loopRoot = obj;
		if (root) {
			root = root.split('.');
			for(var i in root){
				loopRoot = loopRoot[root[i]];
			}
		}
		//console.log('_helper.getRootObjFromString');
		//console.log(loopRoot);
		return loopRoot;
	},

	loop: function (root, allways, foundSelector, found, returnThat, deeper, getRootKey, lastPath) {

    //console.log('lastPath',lastPath);

		//console.log('alwaysFound', alwaysFound);

		var rootTyp;
		if (Object.prototype.toString.call( root ) === '[object Object]') {
			rootTyp = 'object';
		} else if (Object.prototype.toString.call( root ) === '[object Array]') {
			rootTyp = 'array';
		} else {
			return false;
		}


		var rootKey = false;

    	var path = lastPath || [];

		var i = 0;
		for (var k in root) {
			if (i == 0 && !rootKey) {
				rootKey = getRootKey || k;
			}
			if (root.hasOwnProperty(k)) {

				//console.log(key + " -> " + root[k]);

				if(allways){
					//console.log('allways',allways);
					var back = allways(root, k, root[k]);
					if (back) {
						root[k] = back;
					}
				}



				if(found){
          //console.log(lastPath);

					if (rootTyp == 'object') {
						if (foundSelector.key && foundSelector.value && k == foundSelector.key && root[k] == foundSelector.value) {

							console.log('found',k,'=',foundSelector.key, ' - ',root[k],'=',foundSelector.value);
							console.log('set FOUND object !!!', rootKey, k , lastPath);
							//myFound = true;
							//found(root, root[k], k);
							if (lastPath) {
								return [true,root, root[k], k];
							} else {
								return found(root, root[k], k);
							}
						}
					} else if (rootTyp == 'array') {
						if (foundSelector.value && root[k] == foundSelector.value) {

							console.log('set FOUND array !!!');
							//myFound = true;
							//found(root, root[k], k);
							if (lastPath) {
								return [true,root, root[k], k];
							} else {
								return found(root, root[k], k);
							}

						}
					}
				}

				if (typeof root[k] === 'object') {

					if (deeper) {
						console.log('--- get deeper ', k, root[k]);
						var retDeep = _helper.loop(root[k],allways, foundSelector , found, null, deeper, rootKey, path);
						if (retDeep && retDeep[0] && retDeep[1]) {

              				path.push(k);
              //console.log('found',k, path.reverse().join('.'), retDeep);
						//	gpath = path.reverse();

							console.log('--- get higher ', k, root[k], path);
							console.log(retDeep);
							//console.log('myFound',myFound);
							//if (myFound) {

							//}

							if (rootKey == k) {
								//path = path.reverse();
								console.log('####   FOUND!!!', rootKey );
								found(retDeep[1], retDeep[2], path.reverse());
							}

							return retDeep;
						}
					}

				}


			}
		}

		if (returnThat) {
			return returnThat;
		} else {
			return false;
		}



	}

};
