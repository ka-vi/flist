#!/usr/local/bin/node

var opt = require('optimist')
  , argv = opt.argv
  , spawn = require('child_process').spawn
  ;

var height = process.stdout.getWindowSize()[1];

var CATEGORIES = ['fave', 'yes', 'maybe', 'no'];

var echo = function(o) {
	console.log(o.toString());
	return o;
}

function fill(kink, widest, c) {
	c = c || ' ';
	kink = typeof kink === 'string' ? kink : kink.name;
	var s = kink.slice();
	for(var i = kink.length; i < widest; i++) {
		s += c;
	}
	return s + c + c + c + c;
}

function formatKink(kinks, i, widest) {
	return i < kinks.length ? fill(kinks[i], widest) : fill('', widest);
}

function checkWidest(docs) {
	docs.widest = {};
	CATEGORIES.map(function(c) {
		docs.widest[c] = Math.max.apply(null, docs.kinks[c].map(function(k) {
			return k.name.length;
		}));
	});
}

function checkHeight(docs, cats) {
	var h = height - 3;
	var m = cats.length;
	for(var i = 0; i < m; i++) {
		var c = cats[i];
		if(docs.kinks[c].length > h) {
			var k = docs.kinks[c];
			var newKink = c + ' ' + i;
			docs.widest[newKink] = docs.widest[c];
			docs.kinks[c] = k.slice(0, h);
			docs.kinks[newKink] = k.slice(h);
			cats.splice(i + 1, 0, newKink);
			m++;
		}
	}
	return cats;
}

function sortCols(docs) {
	CATEGORIES.map(function(c) {
		docs.kinks[c] = docs.kinks[c].sort();
	});
}

function kinkName(kinkName) {
	return kinkName.split(' ')[0];
}

function printColumns(docs) {
	checkWidest(docs);
	sortCols(docs);
	var max = Math.max.apply(null, CATEGORIES.map(function(c) { return docs.kinks[c].length; }));
	max = max < height ? max : height - 3;
	var line = '';
	var CATS = checkHeight(docs, CATEGORIES.slice());
	for(var i in CATS) {
		line += fill(kinkName(CATS[i]), docs.widest[CATS[i]]);
	}
	console.log(line);
	line = '';
	for(var i = 0; i < CATS.length; i++) {
		line += fill('', docs.widest[CATS[i]], '-');
	}
	console.log(line);
	for(var cnt = 0; cnt < max; cnt++) {
		line = '';
		for(var i in CATS) {
			line += formatKink(docs.kinks[CATS[i]], cnt, docs.widest[CATS[i]]);
		}
		console.log(line);
	}
}

function main(character) {
	var c = spawn('casperjs', ['casperjs_flist.js', character]);
	var jsonStr = '';
	c.stdout.on('data', function(data) {
		jsonStr += data;
	});
	c.on('close', function(code) {
		printColumns(JSON.parse(jsonStr));
	});
//	printColumns(result.body);
}

if(require.main.filename === __filename) {
	if(argv._.length > 0) {
		main.apply(null, argv._);
	} else {
		console.log('Need to provide a character name yo!');
	}
} else {
	echo = function(){};
}
