

<!-- Start src/cStorage.js -->

## cStorage

Easy JS Framework to get / edit localStorage

Version: 0.2.0

Author: Christian Marienfeld post@chrisand.de 


### Examples:

	var obj = {"data":[{id:1},{id:2},{id:3}]};
    var storage = new cStorage('test').save(obj);

	var item = storage.root('data').find({id:2});
	
	var myItemObject = item.get();
	
	item.edit({name:"Hello World"});
	
	var json = storage.toString();
	// json = {"data":[{"id":1},{"id":2,"name":"Hello World"},{"id":3}]}
	

### Params:

* **String** *dbname* Name of localStorage
* **String** *[rootString]* Dot seperated path to get deeper into the object or array

### Return:

* **Object** cStorage Object






## save([obj=global, [encode=false], [deeper=true])

Save the Main-Data-Object to the localStorage

### Examples:

	var storage = new cStorage('test');

	storage.save({my:"test"});

Version: 0.1.0

### Params:

* **Object** *[obj=global* data] The object to save to localStorage
* **Boolean** *[encode=false]* Encode the value for a conflict free json string
* **Boolean** *[deeper=true]* Encode deep values

### Return:

* **Object** cStorage object

## root([root=rootObject])

Navigate into the Main-Data-Object

### Examples:

	var storage = new cStorage('test');

	storage.root('data');
	storage.root('data.user');
	storage.root('data.user.4');

Version: 0.1.0

### Params:

* **String** *[root=rootObject]* Dot seperated path to get deeper into the object or array

### Return:

* **Object** cStorage Object

## find(param, [deeper=true])

Find Note from Selected-Data-Object

### Examples:

	var storage = new cStorage('test');

	storage.find({id:3});

	storage.root('data').find({id:3}, true);

	storage.root('json').find({name:"erde"}, false);

	storage.find({text:"find this value"});

Version: 0.1.0

### Params:

* **String** *param* Selector Object
* **Boolean** *[deeper=true]* Search deeper into the object

### Return:

* **Object** cStorage Object

## get([root=rootObject], [decode=false], [deeper=true])

Return the Selected-Data-Object

### Examples:

	var storage = new cStorage('test');

	var get = storage.get();

	var get = storage.root('data').get();
	var get = storage.get('data');

	var get = storage.root('data').find({id:4}).get();
	var get = storage.root('data').find({id:4}).get(null,true); //decode values

	var get = storage.get('data',true,false); //decode values but not deep

Version: 0.1.0

### Params:

* **String** *[root=rootObject]* Dot seperated path to get deeper into the object or array
* **Boolean** *[decode=false]* Decode the value for humanreadable text
* **Boolean** *[deeper=true]* Encode all deeper values from object

### Return:

* **Object** Note object

## clone()

Return a clone of the Selected-Data-Object

### Examples:

	var storage = new cStorage('test');

	var clone = storage.clone();

	var clone = storage.root('data').clone();

	var clone = storage.root('data').find({id:6}).clone();

Version: 0.1.0

### Return:

* **Object** Cloned note object

## edit(obj)

Edit the Selected-Data-Object value

### Examples:

	var storage = new cStorage('test');

	storage.root('data').edit({value:6});

	storage.find({id:1}).edit({data:'new Data'});

	storage.find({id:2}).edit({
		text:'HERE IS AN NEW WORLD',
		lang: 'The new World'
	});

Version: 0.1.0

### Params:

* **Object** *obj* Object with key and new value

### Return:

* **Object** cStorage Object

## add(obj)

Add to the Selected-Data-Object

### Examples:

	var storage = new cStorage('test');

	storage.root('data').add({value:6});

	storage.find({id:1}).add({data:'new Data'});

	storage.root('data').add({
		id: 5,
		text:'HERE IS AN NEW WORLD',
		lang: 'The new World'
	});

	storage.root('data').add([{id:4},{id:5}]);

Version: 0.1.0

### Params:

* **Object** *obj* Object to insert

### Return:

* **Object** cStorage Object

## map(callback, [deeper=true])

Loop to the Selected-Data-Object

### Examples:

	var storage = new cStorage('test');

	storage.map(function (obj, key, value) {
		console.log(obj, key, value);
	});

	storage.root('data').map(function (obj, key, value) {
		console.log(obj, key, value);
	});

	storage.root('data').map(function (obj, key, value) {
		console.log(obj, key, value);
	}, false);

Version: 0.1.0

### Params:

* **Function** *callback* Call this function each note
* **Boolean** *[deeper=true]* Search deeper into the object

### Return:

* **Object** cStorage Object

## getValue([decode=false])

Return the Selected-Data-Value

### Examples:

	var storage = new cStorage('test');

	var json = storage.getValue();

	var json = storage.getValue(true); //decode values

Version: 0.1.0

### Params:

* **Boolean** *[decode=false]* Decode the value for humanreadable text

### Return:

* **Object** Value Object

## getUid()

Return a unique identifier of the Selected-Data-Object

### Examples:

	var storage = new cStorage('test');

	var nextId = storage.getUid();

	var nextId = storage.root('data').getUid();

	var nextId = storage.root('json.data.users').getUid();

Version: 0.1.0

### Return:

* **Number** a unique identifier as integer

## toString([root=rootObject], [decode=false], [deeper=true])

Return the Selected-Data-Object as JSON-String

### Examples:

	var storage = new cStorage('test');

	var json = storage.toString();

	var json = storage.root('data').toString();

	var json = storage.toString('data');
	var json = storage.toString('data', true, false); //decode values but not deep

	var json = storage.root('data').find({id:4}).toString();
	var json = storage.root('data').find({id:4}).toString(null,true); //decode values

Version: 0.1.0

### Params:

* **String** *[root=rootObject]* Dot seperated path to get deeper into the object or array
* **Boolean** *[decode=false]* Decode the value for humanreadable text
* **Boolean** *[deeper=true]* Encode all deeper values from object

### Return:

* **String** Note Object as JSON-String

## isEmpty()

Return true if Main-Data-Object is empty

### Examples:

	var storage = new cStorage('emptyDb');

	var check = storage.isEmpty();

Version: 0.2.0

### Return:

* **Boolean** filled (false) or not filled (true)

## isFound()

Return true if last Search was successful
( functions: root(), find() ) 

### Examples:

	var storage = new cStorage('test');

	var check = storage.root('data').isFound();

	var check = storage.find({id:4}).isFound();

Version: 0.2.0

### Return:

* **Boolean** true if last root() or find() was successful

<!-- End src/cStorage.js -->

