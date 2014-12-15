var path = require('path');
var rootPath = path.normalize (__dirname);

module.exports = {
	development : {

		rootPath:rootPath,
		db: 'mongodb://localhost/BookMonster',
		port:process.env.port || 3000,
		filePath:rootPath + "/public/books"
	},
	production : {

		rootPath:rootPath,
		db:'mongodb://localhost/BookMonster',
		port:process.env.port || 80,
		filePath:rootPath + "/public/books"
	}
};