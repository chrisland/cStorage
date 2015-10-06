describe("storage", function() {
	
	var dbname = 'test';
	
	beforeEach(function() {
			
	});
	
/*
	it("init without param (db name)", function() {
		
		var storage = new cStorage();
		
		console.log(storage);
		
		expect(storage).toBe();
	});
*/
	
	it("init with param (dbname) return object", function() {
	
		var storage = new cStorage(dbname);
		
		//console.log(storage);
		
		expect(storage).toBeObject();
	
	});
	
	it("init with param (rootString) set root _foundParent", function() {
	
		var obj = {a:1, data:[{id:1,text:'a'},{id:2,text:'b'},{id:3,text:'c'}], b:3};
			
		new cStorage(dbname).save(obj);
		
		
		var storage = new cStorage(dbname,'data').get();
		
		//console.log(storage);
		
		expect(storage).toEqual(obj.data);
	
	});
	
	
	it("global storage should be set", function() {
	
		var storage = new cStorage(dbname);
		
		expect(storage._data).not.toBe(null);
	
	});
	
	
	it("global storage should be object", function() {
	
		var storage = new cStorage(dbname);
		//console.log(storage);
		expect(storage._data).toBeObject();
	
	});
	
	describe("toString()", function() {
	
		
		it("toString() should return string", function() {
		
			var back = new cStorage(dbname).toString();
			
			expect(back).toBeString();
		
		});
		
		
		it("toString() should return same String as in localStorage", function() {
			
			var back = new cStorage(dbname).toString();
			var ls = window.localStorage.getItem(dbname) || '{}';
			expect(back).toBe(ls);
		
		});
	
	});
	
	
	describe("save()", function() {
		
		beforeEach(function() {
			
			localStorage.removeItem(dbname);
			
		});
		
		
		it("save() should return false without param (obj)", function () {
			
			var storage = new cStorage(dbname).save();
			
			expect( storage ).not.toBe();
		});
		
		
		it("save() should set param (obj) to global _data variable", function () {
			var obj = {"test":"test"};
			var storage = new cStorage(dbname);
			storage.save(obj);
			
			//var ls = JSON.parse(window.localStorage.getItem(dbname));
			
			expect( storage._data ).toEqual( obj );
		});
		
		
		it("save() should set param (obj) to global _foundParent variable", function () {
			var obj = {"test":"test"};
			var storage = new cStorage(dbname);
			storage.save(obj);
			
			//var ls = JSON.parse(window.localStorage.getItem(dbname));
			
			expect( storage._foundParent ).toEqual( obj );
		});
		
		
		it("save() should save obj to localStorage", function () {
			var obj = {"test":"test"};
			var storage = new cStorage(dbname).save(obj);
			
			var ls = window.localStorage.getItem(dbname);
	
			expect( ls ).toBe( JSON.stringify(obj) );
		});
		
		
	
	});
	
	
	describe("encode/decode data", function() {
			
		beforeEach(function() {
			
			localStorage.removeItem(dbname);
			
		});
		
		it("save(obj, true) should encode value at root", function () {
			
			var obj = {"test":"te &#äü+.-,:}{[]!\"§$%&/()=? st"};
			var storage = new cStorage(dbname).save(obj, true);
			
			var ls = window.localStorage.getItem(dbname);
	
			expect( ls ).toBe( '{"test":"te%20%26%23%C3%A4%C3%BC%2B.-%2C%3A%7D%7B%5B%5D!%22%C2%A7%24%25%26%2F()%3D%3F%20st"}' );
		});
		
		it("save(obj, true) should NOT encode value if it is integer", function () {
			
			var obj = {"test":6};
			var storage = new cStorage(dbname).save(obj, true);
			
			var ls = window.localStorage.getItem(dbname);
	
			expect( ls ).not.toBe( '{"test":"6"}' );
		});
		
		
		it("save(obj, true) should encode deeper value", function () {
			
			var obj = {"data":{"test":"te &#äü+.-,:}{[]!\"§$%&/()=? st"}};
			var storage = new cStorage(dbname).save(obj, true, true);
			
			var ls = window.localStorage.getItem(dbname);
	
			expect( ls ).toBe( '{"data":{"test":"te%20%26%23%C3%A4%C3%BC%2B.-%2C%3A%7D%7B%5B%5D!%22%C2%A7%24%25%26%2F()%3D%3F%20st"}}' );
		});
		
		it("save(obj, true) should encode ALL deeper values", function () {
			
			var obj = {"data":[{id:1,text:"%&/"},{id:2,text:"-#+"},{id:3,text:" kh*!^\"§$"}]};
			var storage = new cStorage(dbname).save(obj, true, true);
			
			var ls = window.localStorage.getItem(dbname);
	
			expect( ls ).toBe( '{"data":[{"id":1,"text":"%25%26%2F"},{"id":2,"text":"-%23%2B"},{"id":3,"text":"%20kh*!%5E%22%C2%A7%24"}]}' );
		});
		
		
		
		
		it("get(obj, true) should encode value at root", function () {
			
			var obj = {"test":"te%20%26%23%C3%A4%C3%BC%2B.-%2C%3A%7D%7B%5B%5D!%22%C2%A7%24%25%26%2F()%3D%3F%20st"};
			var storage = new cStorage(dbname).save(obj);
			
			var get = storage.get(null,true);
			
			//var ls = window.localStorage.getItem(dbname);
	
			expect( get ).toEqual( { test: 'te &#äü+.-,:}{[]!"§$%&/()=? st' } );
		});
		
		
		it("get(obj, true) should NOT encode value at root if integer", function () {
			
			var obj = {"test":2};
			var storage = new cStorage(dbname).save(obj);
			
			var get = storage.get(null,true);
			
			//var ls = window.localStorage.getItem(dbname);
	
			expect( get ).toEqual( { test: 2 } );
		});
		
		
		it("get(obj, true) should encode deeper value at root", function () {
			
			var obj = {"data":{"test":"te%20%26%23%C3%A4%C3%BC%2B.-%2C%3A%7D%7B%5B%5D!%22%C2%A7%24%25%26%2F()%3D%3F%20st"}};
			var storage = new cStorage(dbname).save(obj);
			
			var get = storage.root('data').get(null,true);
			
			//var ls = window.localStorage.getItem(dbname);
	
			expect( get ).toEqual( {test: 'te &#äü+.-,:}{[]!"§$%&/()=? st'} );
		});
		
		
		it("get(obj, true) should encode ALL deeper value", function () {
			
			var obj = {
					"test":"te &#äü+.-,:}{[]!\"§$%&/()=? st"
					,"data":{
						"loop":[
							{id:")(/&%$"},
							{id:"'",a:"§$%&"},
							{id:" fsdÄÜPÖ)(/&%$§+#*'"}
						]
					}
				};
			
			//console.log(JSON.stringify(obj));
			var storage = new cStorage(dbname).save(obj,true);
			
			var get = storage.toString('data', true);
			
			//console.log(obj);
			//console.log(get);
			//var ls = window.localStorage.getItem(dbname);
		
			expect( get ).toEqual( JSON.stringify(obj.data) );
		});
		
		
		
		
	});
	

	describe("root()", function() {
		
		beforeEach(function() {
			
			localStorage.removeItem(dbname);
			
		});
		
		
		it("root() should set all found object back to root", function () {
			
			var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			var storage = new cStorage(dbname).save(obj);
			
			var back = storage.root();
			
			expect( back._foundParent ).toBe(storage._data);
		});
		
		

		it("root() should return this", function () {
			
			var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			var storage = new cStorage(dbname).save(obj);
			
			var back = storage.root();
			
			expect( back ).toBe(storage);
		});
		
		
		it("root() should set global _foundParent", function () {
			
			var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			var storage = new cStorage(dbname).save(obj);
			
			var back = storage.root('data').get();
			
			expect( back ).toBe(obj.data);
		});
		
		
		
		it("root() should set global _foundParent on deeper", function () {
			
			var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			var storage = new cStorage(dbname).save(obj);
			
			var back = storage.root('data.test.1.text');
			
			//console.log(back);
			
			expect( back._foundParent ).toBe('there is 5');
		});
		

		
		
	
	});
	
	
	
	describe("get()", function() {
		
		beforeEach(function() {
			
			localStorage.removeItem(dbname);
			
		});
		
		
		it("get() should return active found object", function () {
			
			var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			var storage = new cStorage(dbname).save(obj);
			
			var back = storage.get();
			
			expect( storage._foundParent ).toBe(back);
		});
		
		

		it("get() should return NOT this", function () {
			
			var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			var storage = new cStorage(dbname).save(obj);
			
			var back = storage.get();
			
			expect( back ).not.toBe(storage);
		});
		
		
		it("get() should return deeper object", function () {
			
			var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			var storage = new cStorage(dbname).save(obj);
			
			var back = storage.get('data');
			
			expect( back ).toBe(obj.data);
		});
		
		
		it("get() should return deeper/deeper array", function () {
			
			var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			var storage = new cStorage(dbname).save(obj);
			
			var back = storage.get('data.test');
			
			expect( back ).toBe(obj.data.test);
		});
		
		
		
		it("get() should return from array", function () {
			
			var obj = {"data": {"test":[ 1,2,3,4 ]} };
			var storage = new cStorage(dbname).save(obj);
			
			var back = storage.get('data.test.1');
			
			expect( back ).toBe(2);
		});
		
		
		
		
		it("get() should NOT set global _foundParent", function () {
			
			var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			var storage = new cStorage(dbname).save(obj);
			
			var back = storage.get('data');
			
			expect( storage._foundParent ).not.toBe(back);
		});
		
		
	/*	
		it("root() should set global _foundParent on deeper", function () {
			
			var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			var storage = new cStorage(dbname).save(obj);
			
			var back = storage.root('data.test.1.text');
			
			console.log(back);
			
			expect( back._foundParent ).toBe('there is 5');
		});
		

		
*/
		
	
	});
		
	
	describe("find()", function() {
		
		beforeEach(function() {
				
			localStorage.removeItem(dbname);
			
		});
		
		it("find() without param (obj) should return false", function () {
			
			var storage = new cStorage(dbname).find();
			
			expect(storage).toBe(false);
			
		});
		
		
		it("find() should return object on _data root, param is integer", function () {
			
			var obj = {"test":"test","id":4,"text":"there is content"};
			//var obj = [3,4,5,'a','b'];
			
			var storage = new cStorage(dbname).save(obj);
			var found = storage.find({id:4});
			
			//console.log(found);
			
			expect(storage._foundChild).toBe(obj.id);
			
		});
		
		
		
		it("find() should set Global _foundParent", function () {
			
			var obj = {"data": [ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ] };
			//var obj = [3,4,5,'a','b'];
			
			var storage = new cStorage(dbname).save(obj);
			var found = storage.find({id:5});
			
			//console.log(storage);
			
			expect(storage._foundParent).toBe(obj.data[1]);
			
		});
		
		
		it("find() should set Global _foundChild", function () {
			
			var obj = {"data": [ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ] };
			//var obj = [3,4,5,'a','b'];
			
			var storage = new cStorage(dbname).save(obj);
			var found = storage.find({id:5});
			
			//console.log(storage._foundChild);
			//console.log(obj.data[1].id);
			
			expect(storage._foundChild).toBe(obj.data[1].id);
			
		});
		
		
		
		
		it("find() should return this if NOT found item on _data root, param is integer", function () {
			
			var obj = {"test":"test","id":4,"text":"there is content"};
			//var obj = [3,4,5,'a','b'];
			
			var storage = new cStorage(dbname).save(obj);
			var found = storage.find({id:5});
			
			//console.log(found);
			
			expect(found).toBe(storage);
			
		});
		

		
		it("find() should return object on _data root, param is string", function () {
			
			var obj = {"test":"test","id":4,"text":"there is content"};
			//var obj = [3,4,5,'a','b'];
			
			var storage = new cStorage(dbname).save(obj);
			var found = storage.find({test:"test"});
			
			//console.log(found);
			
			expect(storage._foundChild).toBe(obj.test);
			
		});
		
		
		it("find() should return false if NOT found item on _data root, param is string", function () {
			
			var obj = {"test":"test","id":4,"text":"there is content"};
			//var obj = [3,4,5,'a','b'];
			
			var storage = new cStorage(dbname).save(obj);
			var found = storage.find({"text":"there is content"});
			
			//console.log(found);
			
			expect(storage._foundChild).toBe(obj.text);
			
		});
		
		
		
		it("find() should return array on _data root, root is array, param is integer", function () {
			
			//console.log('.arrays 1');
			
			//var obj = {"test":"test","id":4,"text":"there is content"};
			var obj = [3,4,5,'a','b'];
			
			var storage = new cStorage(dbname).save(obj);
			var found = storage.find(3);
			
			//console.log(found);
			
			expect(storage._foundChild).toBe(obj[0]);
			
		});
		
		it("find() should return array on _data root, root is array, param is string", function () {
			
			//console.log('.arrays 1.1');
			
			//var obj = {"test":"test","id":4,"text":"there is content"};
			var obj = [3,4,5,'a','b'];
			
			var storage = new cStorage(dbname).save(obj);
			var found = storage.find('b');
			
			//console.log(found);
			
			expect(storage._foundChild).toBe(obj[4]);
			
		});
		
		it("find() should return false if NOT found item on _data root, root is array, param is string", function () {
			
			//console.log('.arrays 2');
			
			//var obj = {"test":"test","id":4,"text":"there is content"};
			var obj = [3,4,5,'a','b'];
			
			var storage = new cStorage(dbname).save(obj);
			var found = storage.find('c');
			
			//console.log(found);
			
			expect(found).toBe(found);
			
		});
		
		
		
		describe("find() -> deeper", function() {
		
			beforeEach(function() {
					
				localStorage.removeItem(dbname);
				
			});
			
			it("find() should return object on deeper root, param is string", function () {
				
				var obj = {"id":4,"text":"there is content", "data":{"test":"test","found":true}};
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				var found = storage.find({test:"test"});
				
				//console.log(found);
				
				expect(storage._foundParent).toBe(obj.data);
				
			});
			
			
			it("find() should return object on deeper/deeper root, param is integer", function () {
				
				var obj = {"id":2,"text":"there is content", "data":{"test":"test","found":true,"deep":[1,2,3],"find":6}};
				//var obj = [3,4,5,'a','b'];
				//console.log(obj);
				var storage = new cStorage(dbname).save(obj);
				var found = storage.find({find:6});
				
				//console.log(found);
				
				expect(storage._foundParent).toBe(obj.data);
				
			});
			
			
			
			it("find() should return object on deeper SET root, param is integer", function () {
				
				
				//console.log('----- hier!!!');
				
				var obj = {"data": [ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ] };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				var found = storage.root('data').find({id:5});
				
				//console.log(storage);
				
				expect(storage._foundChild).toBe(obj.data[1].id);
				
				//console.log('----- ENDE!!!');
				
			});
			
			
			
			it("find() should return object on deeper/deeper SET root, param is integer", function () {
				
				
				
				
				var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				var found = storage.root('data.test').find({id:4});
				
				//console.log(storage);
				
				expect(storage._foundChild).toBe(obj.data.test[0].id);
				
			});
			
			it("find() should return object on deeper/deeper/array SET root, param is integer", function () {
				
				
				
				
				var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				var found = storage.root('data.test.2').find({text:'there is 6'}, false);
				
				//console.log(storage);
				
				expect(storage._foundChild).toBe(obj.data.test[2].text);
				
			});
			
		});	
		

		
		
		
		
		
		describe("return find() obj", function() {
			
			
			beforeEach(function() {
				
				localStorage.removeItem(dbname);
				
			});
			
			
			it("get() should return referensz to found object", function () {
				
				
				
				
				var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
							
				var get = storage.root('data.test.1').find({id:5}, false).get();
				
				
				//console.log(get);
				
				expect(get).toBe(obj.data.test[1]);
				
			});
			
			it("get() should return value from found object", function () {
				
				
				
				
				var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
							
				var get = storage.find({id:5}).getValue();
				
				
				//console.log(get);
				
				expect(get).toBe(5);
				
			});
			
			
			it("getValue() should return child value from found object", function () {
				
				
				
				
				var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
							
				var get = storage.find({id:5}).getValue();
				
				
				//console.log(get);
				
				expect(get).toBe(5);
				
			});
			
			
			it("getValue() should return encode child value from found object", function () {
				
				
				
				
				var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"ther % is 5"},{id:6,"text":"there is 6"} ]} };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj,true);
				
				var find = {text:'ther % is 5'};
				find.text = encodeURIComponent(find.text);
				
				//console.log(find);
				
				var get = storage.root('data.test').find(find).getValue(true);
				
				
				//console.log(get);
				
				expect(get).toBe('ther % is 5');
				
			});
			
			
			it("clone() should return clone found object", function () {
				
				
				
				
				var obj = {"data": [{id:1},{id:2},{id:3}] };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				
				var clone = storage.find({id:2}).clone();
				
				var get = storage.find({id:2}).get();
				
				//console.log(get);
				//console.log(clone);
				
				expect(clone).toEqual(get);
				
			});
			
			
			it("clone() should return clone AND NOT referenz found object", function () {
				
				
				
				
				var obj = {"data": [{id:1},{id:2},{id:3}] };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				
				var clone = storage.find({id:2}).clone();
				
				var get = storage.find({id:2}).get();
				
				//console.log(get);
				//console.log(clone);
				
				expect(clone).not.toBe(get);
				
			});
			
			
		});	
		
		
		
		
		describe("find() combinine", function() {
					
			it("find() should return object edit with js and save() at the end", function () {
				
				
				
				
				var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				var found = storage.find({id:5}).get();
				
				found.text = 'HERE IS AN NEW WORLD';
				
				storage.save();
				
				
				var after = new cStorage(dbname).find({id:5}).get();
				
				var ls = JSON.parse(window.localStorage.getItem(dbname));
				
				//console.log(found);
				
				expect(after).toEqual(ls.data.test[1]);
				
			});
		});
		
		
	});	
	
	describe("map()", function() {
			
		beforeEach(function() {
				
			localStorage.removeItem(dbname);
			
		});
		
		
		it("map() should loop x times, x = obj.lenght", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = {a:1, b:2, b:3};
			
			var storage = new cStorage(dbname).save(obj);
				
			var count = 0;		
			var get = storage.map(function () {
				count++;
			});

			//console.log(get);
			
			expect(count).toBe(2);
			
		});
		
		
		
		it("map() should loop x times, x = array.lenght", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = [1,2,4,5,7,9];
			
			var storage = new cStorage(dbname).save(obj);
				
			var count = 0;		
			var get = storage.map(function () {
				count++;
			});

			//console.log(get);
			
			expect(count).toBe(obj.length);
			
		});
		
		
		
		it("map() should loop x times and dont touch data", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = {a:1, b:2, c:3};
			
			var storage = new cStorage(dbname).save(obj);
				

			
			var get = storage.map(function (root, key, value) {});
			

			var after = new cStorage(dbname).get();
			

			//console.log(get);
			
			expect(after).toEqual(obj);
			
		});
		
		
		
		
		
		
		it("map() should loop x times and edit data", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = {a:1, b:2, c:3};
			
			var storage = new cStorage(dbname).save(obj);
				

			
			var get = storage.map(function (root, key, value) {
				//console.log(root, key, value);
				
				if (key == 'b') {
					return value+' change';
				}
				
			}); //.get();
			

			var after = new cStorage(dbname).get();
			

			//console.log(after);
			
			expect(after.b).not.toEqual(obj.b);
			
		});
		
		
		
		it("map() should loop x times and edit data and save() at the end", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = {a:1, b:2, c:3};
			
			var storage = new cStorage(dbname).save(obj);
				

			
			var get = storage.map(function (root, key, value) {
				
				//console.log(root, key, value);
				
				if (key == 'b') {
					return value+' change';
				}
				
			}).save();
			

			var ls = JSON.parse(window.localStorage.getItem(dbname));
			

			//console.log(ls);
			
			expect(ls.b).toEqual(obj.b);
			
		});
		
		
		

		it("map() should loop x times with set root", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = {a:1, data:[{id:1},{id:2}], c:3};
			
			var storage = new cStorage(dbname).save(obj);
				

			var count = 0;
			var get = storage.root('data').map(function (root, key, value) {
				//console.log(root, key, value);
				
				count++;
				
				
			}); //.get();
			

			//var after = new cStorage(dbname).get();
			

			//console.log(after);
			
			expect(count).toBe(obj.data.length + 2); 
			
		});
		

		
		
		it("map() should loop x times with set root, not deeper", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = {a:1, data:[{id:1},{id:2}], c:3};
			
			var storage = new cStorage(dbname).save(obj);
				

			var count = 0;
			var get = storage.root('data').map(function (root, key, value) {
				//console.log(root, key, value);
				
				count++;
				
				
			}, false); //.get();
			

			//var after = new cStorage(dbname).get();
			

			//console.log(after);
			
			expect(count).toBe(obj.data.length);
			
		});
		
		
		describe("get deep count", function() {
			
			
			beforeEach(function() {
				
				localStorage.removeItem(dbname);
				
			});
		
			
			it("map() / find() should loop only root", function () {
				
				var obj = {"data": 3, "a":{a:1,b:2}, "b":2 };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				
				var count = 0;
				var found = storage.map(function (root, key, value) {
					count++;
				},false);
				
				//console.log(storage);
				
				expect(count).toBe(3);
				
			});
			
			
			it("map() / find() should loop throw deep object on root", function () {
				
				var obj = {"a": {"deep":[1,2,3]}, "b":1, "c":{a:1,b:2} };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				
				var count = 0;
				var found = storage.map(function (root, key, value) {
					count++;
					
					//console.log(root, key, value);
				});
				
				//console.log(storage);
				
				expect(count).toBe(9);
				
			});
			
			it("map() / find() should loop throw deep object on SET root", function () {
				
				var obj = {"a": {"deep":[1,2,3]}, "b":1, "c":{a:1,b:2}, "d":[{id:1},{id:2},{id:3}] };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				
				var count = 0;
				var found = storage.root('d').map(function (root, key, value) {
					count++;
					
					//console.log(root, key, value);
				});
				
				//console.log(storage);
				
				expect(count).toBe(6);
				
			});
			
			
			it("map() / find() should loop NOT throw deep object on SET root", function () {
				
				var obj = {"a": {"deep":[1,2,3]}, "b":1, "c":{a:1,b:2}, "d":[{id:1},{id:2,d:[1,2,3]},{id:3}] };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				
				var count = 0;
				var found = storage.root('d').map(function (root, key, value) {
					count++;
					
					//console.log(root, key, value);
				}, false);
				
				//console.log(storage);
				
				expect(count).toBe(3);
				
			});
			
			it("map() / find() should loop NOT throw deep object on SET root", function () {
				
				var obj = {"a": {"deep":[1,2,3]}, "b":1, "c":{a:1,b:2} };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				
				var count = 0;
				var found = storage.root('a').map(function (root, key, value) {
					count++;
					
					//console.log(root, key, value);
				}, false);
				
				//console.log(storage);
				
				expect(count).toBe(1);
				
			});
			
			
			it("map() / find() should loop throw array without deep", function () {
				
				var obj = {"a": {"deep":[1,2,3]}, "b":1, "c":{a:1,b:2} };
				//var obj = [3,4,5,'a','b'];
				
				var storage = new cStorage(dbname).save(obj);
				
				var count = 0;
				var found = storage.root('a.deep').map(function (root, key, value) {
					count++;
					
					//console.log(root, key, value);
				}, false);
				
				//console.log(storage);
				
				expect(count).toBe(3);
				
			});
			
		
		});
		
	});
	

	
	describe("edit()", function() {
			
		beforeEach(function() {
				
			localStorage.removeItem(dbname);
			
		});
		
		
		
		it("edit() should return false without param", function () {
			
			var storage = new cStorage(dbname).edit().get();
			//var back = storage.edit();
			//console.log(back);
			
			expect(storage).toBe(storage);
		});
		
		
		it("edit() should edit data from object, with save to localSorage", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = {a:1, data:[{id:1,text:'a'},{id:2,text:'b'},{id:3,text:'c'}], b:3};
			
			var storage = new cStorage(dbname).save(obj);
				
			
			storage.root('data').find({id:2}).edit({text:'HERE IS AN NEW WORLD'});

			
			
			var ls = JSON.parse(window.localStorage.getItem(dbname));
			
			expect(ls.data[1].text).toBe('HERE IS AN NEW WORLD');
			
		});
		
		
		
		it("edit() should INSERT data from object, because the key was not set", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = {a:1, data:[{id:1,text:'a'},{id:2,text:'b'},{id:3,text:'c'}], b:3};
			
			var storage = new cStorage(dbname).save(obj);
				
			
			storage.root('data').find({id:2}).edit({error:'error'});

			
			
			var ls = JSON.parse(window.localStorage.getItem(dbname));
			
			expect(ls.data[1].error).toBe('error');
			
		});
		
		
		
		
		
		it("edit with js and save() to localSorage", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = {a:1, data:[1,2,3,4], b:3};
			
			var storage = new cStorage(dbname).save(obj);
				
			
			var get = storage.root('data').find(2, false).get();
			get[1] = 5;
			storage.save();
			
			//console.log(get);
			
	//		.edit(5);

			//console.log(window.localStorage.getItem(dbname));
			
			var ls = JSON.parse(window.localStorage.getItem(dbname));
			
			expect(ls.data[1]).toBe(5);
			
		});
		
		
		it("edit() should do nothing if edit-object is array", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = {a:1, data:[1,2,3,4], b:3};
			
			var storage = new cStorage(dbname).save(obj);
				
			
			var get = storage.find(2).edit();
	
	

			//console.log(get);
			
			//var ls = JSON.parse(window.localStorage.getItem(dbname));
			
			expect(get._data).toBe(obj);
			
		});
		
		
		
		it("edit() should MULTI edit", function () {
			
			//var obj = {"data": {"test":[ {id:4,"text":"there is 4"},{id:5,"text":"there is 5"},{id:6,"text":"there is 6"} ]} };
			//var obj = [3,4,5,'a','b'];
			var obj = {a:1, data:[{id:1,text:'a',lang:'de'},{id:2,text:'b',lang:'en'},{id:3,text:'c',lang:'it'}], b:3};
			
			var storage = new cStorage(dbname).save(obj);
				
			
			storage.find({id:2}).edit({
				text:'HERE IS AN NEW WORLD',
				lang: 'The new World'
			});

			
			
			var ls = JSON.parse(window.localStorage.getItem(dbname));
			
			expect(ls.data[1].text).toBe('HERE IS AN NEW WORLD');
			
		});
		
	});


	describe("getUid()", function() {
			
		beforeEach(function() {
				
			localStorage.removeItem(dbname);
			
		});
		
		
		/*

		it("getUid() should return false without root obj", function () {
			
			var storage = new cStorage(dbname);
			var uid = storage.getUid();
			//var back = storage.edit();
			//console.log(uid);
			
			expect(uid).toBe(false);
		});
		
*/
		
		it("getUid() should return next uid on root as number", function () {
			
			var obj = {id:2};
			
			var storage = new cStorage(dbname).save(obj);
			
			//console.log('storage',storage);
			
			var uid = storage.getUid('id');
			//var back = storage.edit();
			//console.log(uid);
			
			expect(uid).toBeNumber();
		});
		
		
		it("getUid() should return next uid on root", function () {
			
			var obj = {id:2};
			
			var storage = new cStorage(dbname).save(obj);
			
			//console.log('storage',storage);
			
			var uid = storage.getUid('id');
			//var back = storage.edit();
			//console.log(uid);
			
			expect(uid).toBe(3);
		});
		
		
		it("getUid() should return 1 as uid because key was never set", function () {
			
			var obj = {id:2};
			
			var storage = new cStorage(dbname).save(obj);
			
			//console.log('storage',storage);
			
			var uid = storage.getUid('nix');
			//var back = storage.edit();
			//console.log(uid);
			
			expect(uid).toBe(1);
		});
		
		
		it("getUid() should return 1 as uid because value is no integer", function () {
			
			var obj = {id:'dd'};
			
			var storage = new cStorage(dbname).save(obj);
			
			//console.log('storage',storage);
			
			var uid = storage.getUid('id');
			//var back = storage.edit();
			//console.log(uid);
			
			expect(uid).toBe(1);
		});
		
		
		
		
		it("getUid() should return next uid-number after find() an array", function () {
			
			
			//console.log('####   TEST 1');
			
			var obj = {a:1, data:[{id:5,text:'a',lang:'de'}], b:3};
			
			var storage = new cStorage(dbname).save(obj);
			
			
			var uid = storage.find({id:1}).getUid('id');
			//var back = storage.edit();
			//console.log(uid);
			
			expect(uid).toBe(6);
		});
		
		
		
		
		it("getUid() should return next uid-number after root() to array", function () {
			
			
			//console.log('####   TEST 2');
			
			
			var obj = {a:1, data:[{id:1,text:'a',lang:'de'},{id:2,text:'b',lang:'en'},{id:3,text:'c',lang:'it'}], b:3};
			
			var storage = new cStorage(dbname).save(obj);
			
			
			var uid = storage.root('data').getUid('id');
			//var back = storage.edit();
			//console.log(uid);
			
			expect(uid).toBe(4);
		});
		
		
		
		it("getUid() should return 1 because no deep search", function () {
			
			
			//console.log('####   TEST 2');
			
			
			var obj = {a:1, data:[{id:1,text:'a',lang:'de'},{id:2,text:'b',lang:'en'},{id:3,text:'c',lang:'it'}], b:3};
			
			var storage = new cStorage(dbname).save(obj);
			
			
			var uid = storage.root('data').getUid('id', false);
			//var back = storage.edit();
			//console.log(uid);
			
			expect(uid).toBe(1);
		});
		
		
		
		
	
	});

	
	describe("js array push", function() {
		
		
		beforeEach(function() {
				
			localStorage.removeItem(dbname);
			
		});
		
		
		it("should add and save the manual pushes element, with root() get() and save()",function() {
			
			var obj = {a:1, data:[{id:1,text:'a',lang:'de'},{id:2,text:'b',lang:'en'},{id:3,text:'c',lang:'it'}], b:3};
			
			var storage = new cStorage(dbname).save(obj);
			
			var get = storage.root('data').get().push({id:66})
			storage.save();
	
			var newobj = {a:1, data:[{id:1,text:'a',lang:'de'},{id:2,text:'b',lang:'en'},{id:3,text:'c',lang:'it'},{id:66}], b:3};
			
			expect(storage._foundParent).toEqual(newobj);
			
		});
	
	
		
	});
	
	describe("add()", function() {
		
		
		beforeEach(function() {
				
			localStorage.removeItem(dbname);
			
		});
		
		
		it("add() should do nothing if param is empty",function() {
			
			var obj = {a:1, data:[{id:1,text:'a',lang:'de'},{id:2,text:'b',lang:'en'},{id:3,text:'c',lang:'it'}], b:3};
			
			var storage = new cStorage(dbname).save(obj);
			
			var get = storage.root('data').add().get();
			

			expect(storage._data).toEqual(obj);
			
		});
		
		
		
		it("add() should add obj to array",function() {
			
			
			//console.log('------- hier');
			
			var obj = {a:1, data:[{id:1,text:'a',lang:'de'},{id:2,text:'b',lang:'en'},{id:3,text:'c',lang:'it'}], b:3};
			
			var storage = new cStorage(dbname).save(obj);
			
			var get = storage.root('data').add({id:66}).get('data');
			
			var newobj = [{id:1,text:'a',lang:'de'},{id:2,text:'b',lang:'en'},{id:3,text:'c',lang:'it'},{id:66}];
			
			//console.log(get);
			//console.log(newobj);


			expect(get).toEqual(newobj);
			
		});
		
		
		it("add() should add obj to array and save()",function() {
			
			
			//console.log('------- hier');
			
			var obj = {a:1, data:[{id:1,text:'a',lang:'de'},{id:2,text:'b',lang:'en'},{id:3,text:'c',lang:'it'}], b:3};
			
			var storage = new cStorage(dbname).save(obj);
			
			storage.root('data').add({id:66});
			
			var get = new cStorage(dbname,'data').get();
			
			var ls = JSON.parse(window.localStorage.getItem(dbname));

			expect(get).toEqual(ls.data);
			
		});
		
		
		
		it("add() should add obj to object",function() {
			
			
			//console.log('------- hier');
			
			var obj = {a:1, data:{a:1,b:2,c:3}, b:3};
			
			var storage = new cStorage(dbname).save(obj);
			
			var get = storage.root('data').add({d:8}).get('data');
			
			var newobj = {a:1,b:2,c:3,d:8};
			
			//console.log(get);
			//console.log(newobj);


			expect(get).toEqual(newobj);
			
		});
		
		
		
		it("add() should add complex obj to object",function() {
			
			
			//console.log('------- hier');
			
			var obj = {a:1, data:{a:1,b:2,c:3}, b:3};
			
			var storage = new cStorage(dbname).save(obj);
			
			var get = storage.root('data').add({d:8, my: [1,2,6]}).get('data');
			
			var newobj = {a:1,b:2,c:3,d:8, my: [1,2,6]};
			
			//console.log(get);
			//console.log(newobj);


			expect(get).toEqual(newobj);
			
		});
		
		
		
		
		it("add() should add multiple obj to object",function() {
			
			
			//console.log('------- hier');
			
			var obj = {a:1, data:{a:1,b:2,c:3}, b:3};
			
			var storage = new cStorage(dbname).save(obj);
			
			var get = storage.root('data').add([{d:8}, {e:9}]).toString();
			
			//console.log(get);
			
			//console.log( storage.root('data').toString() );
			
			var newobj = '{"a":1,"data":{"a":1,"b":2,"c":3,"d":8,"e":9},"b":3}';

			expect(get).toEqual(newobj);
			
		});
		
		
		
		it("add() should add multiple obj to array",function() {
			
			
			//console.log('------- hier');
			
			var obj = {a:1, data:[{id:1},{id:2},{id:3}], b:3};
			
			var storage = new cStorage(dbname).save(obj);
			
			var get = storage.root('data').add([{id:11},{id:12}]).toString('data');
			
			//console.log( storage.root('data').toString() );
			
			//console.log(get);
			var newobj = '[{"id":1},{"id":2},{"id":3},{"id":11},{"id":12}]';

			expect(get).toEqual(newobj);
			
		});
		
		
	});
	

});
