/** #################################
	Project		 : Ebloomapi
	Module		 : Node Server
    Created		 : 2021-11-14
	Developed By : Ashwani Kumar 
    Description	 : Mysql configuration file.
*/


var path	= require('path'),
	_root	  = path.resolve(__dirname, '..')

function root(args) {
  args = Array.prototype.slice.call(arguments, 0)
  return path.join.apply(path, [_root].concat(args))
}

exports.root = root