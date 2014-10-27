var c = require('casper').create();

c.start('http://f-list.net/c/' + c.cli.args[0], function() {
	if(this.exists('#SplashWarningYes')) {
		this.click('#SplashWarningYes');
	}
});

var json = {};
c.then(function() {
	json.fave = this.evaluate(function() {
		var elements = __utils__.findAll('#Character_FetishlistFave a');
		return elements.map(function(e) {
			return {
				hover: e.getAttribute('rel')
			,	name: e.innerHTML.trim()
			};
		});
	});
	json.yes = this.evaluate(function() {
		var elements = __utils__.findAll('#Character_FetishlistYes a');
		return elements.map(function(e) {
			return {
				hover: e.getAttribute('rel')
			,	name: e.innerHTML.trim()
			};
		});
	});
	json.maybe = this.evaluate(function() {
		var elements = __utils__.findAll('#Character_FetishlistMaybe a');
		return elements.map(function(e) {
			return {
				hover: e.getAttribute('rel')
			,	name: e.innerHTML.trim()
			};
		});
	});
	json.no = this.evaluate(function() {
		var elements = __utils__.findAll('#Character_FetishlistNo a');
		return elements.map(function(e) {
			return {
				hover: e.getAttribute('rel')
			,	name: e.innerHTML.trim()
			};
		});
	});
});

c.run(function() {
	this.echo(JSON.stringify({kinks:json})).exit();
});
