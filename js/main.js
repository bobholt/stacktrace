/*global require, requirejs*/
// Require.js allows us to configure shortcut alias

try {

// Throws 'require is not defined'
require.config();

} catch (ex) {

	new _STACK.Error(ex);

}