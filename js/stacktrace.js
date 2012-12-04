// Include JSON2
// 2012-10-08
// Public Domain.
"object"!==typeof JSON&&(JSON={});
(function(){function k(a){return 10>a?"0"+a:a}function p(a){q.lastIndex=0;return q.test(a)?'"'+a.replace(q,function(a){var c=s[a];return"string"===typeof c?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function m(a,j){var c,d,h,n,g=e,f,b=j[a];b&&("object"===typeof b&&"function"===typeof b.toJSON)&&(b=b.toJSON(a));"function"===typeof i&&(b=i.call(j,a,b));switch(typeof b){case "string":return p(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);
case "object":if(!b)return"null";e+=l;f=[];if("[object Array]"===Object.prototype.toString.apply(b)){n=b.length;for(c=0;c<n;c+=1)f[c]=m(c,b)||"null";h=0===f.length?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(i&&"object"===typeof i){n=i.length;for(c=0;c<n;c+=1)"string"===typeof i[c]&&(d=i[c],(h=m(d,b))&&f.push(p(d)+(e?": ":":")+h))}else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=m(d,b))&&f.push(p(d)+(e?": ":":")+h);h=0===f.length?"{}":e?"{\n"+e+f.join(",\n"+
e)+"\n"+g+"}":"{"+f.join(",")+"}";e=g;return h}}"function"!==typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var r=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
q=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,l,s={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;"function"!==typeof JSON.stringify&&(JSON.stringify=function(a,j,c){var d;l=e="";if("number"===typeof c)for(d=0;d<c;d+=1)l+=" ";else"string"===typeof c&&(l=c);if((i=j)&&"function"!==typeof j&&("object"!==typeof j||"number"!==typeof j.length))throw Error("JSON.stringify");return m("",{"":a})});
"function"!==typeof JSON.parse&&(JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&"object"===typeof b)for(g in b)Object.prototype.hasOwnProperty.call(b,g)&&(f=c(b,g),void 0!==f?b[g]=f:delete b[g]);return e.call(a,d,b)}var d,a=String(a);r.lastIndex=0;r.test(a)&&(a=a.replace(r,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),"function"===typeof e?c({"":d},""):d;throw new SyntaxError("JSON.parse");})})();

// IIFE to run immediately - passing local window, undefined, and JSON vars
(function(window, undefined, JSON){

  // The URL the error should be posted to
  var postURL = "http://sample.url";

  // Create Namespace
	window._STACK = window._STACK || {};

  // Attach error function
	window._STACK.Error = function(){

    // Hoist variables we'll define later
		var ex = null;
    var msg = null;
    var file = null;
    var line = null;

    // The object that will hold as much information about the error as we can find
		var errorObj = this._errorObj = {};

    // Information about the browser state we'll be parsing to pass to our errorObj
		var loc = window.location;
		var nav = window.navigator;

    // If the first argument passed to Error() is an exception object, treat it like a JS exception object
    // Send as much as possible to the errorObj
		if (typeof arguments[0] === "object") {

      // set ex to the exception object
			ex = arguments[0];

      // If any of the things we expect to be there are there, add them to our errorObj
			if (ex.stack || ex.message || (ex.fileName && ex.lineNumber)) {

				errorObj.stack = ex.stack;

				if (ex.message) {

					errorObj.message = ex.message;

				}

				if (ex.fileName) {

					errorObj.file = ex.fileName;

				}

				if (ex.lineNumber) {

					errorObj.line = ex.lineNumber;

				}

      // Otherwise, we can't do anything with the exception, so go ahead and throw it
      // TODO: May want to swallow this and die silently
			} else {

				throw(ex);

			}

    // Otherwise, if this is a string, we expect the arguments to be (message, file, line)
		} else if (typeof arguments[0] === "string") {

			errorObj.message = arguments[0];

			errorObj.file = arguments[1];

			errorObj.line = arguments[2];

		}

    // Save the URL where the error occurred
		errorObj.url = loc.href;

    // Add information we'd like to know about the system affected
		errorObj.system = {
			cookieEnabled: nav.cookieEnabled,
			language: nav.language,
			onLine: nav.online,
			platform: nav.platform,
			plugins: nav.plugins,
			userAgent: nav.userAgent,
			vendor: nav.vendor,
			vendorSub: nav.vendorSub
		};

    // List all of the user's plugins
		if (errorObj.system.plugins) {

      // Convert the array of plugin objects into an array of names only
      // We only care about the names and want to reduce filesize
			var plugins = [];

			for (var i = 0; i < errorObj.system.plugins.length; i++) {

				plugins[i] = errorObj.system.plugins[i].name;

			}

			// replace errorObj.plugins with the array of just names
			errorObj.system.plugins = plugins;
		}

    // If there's performance data, include it on our errorObj
		if (window.performance) {

			errorObj.performance = window.performance;

		}

    // If there's data about the screen size, include it
		if (window.screen) {

			errorObj.screen = window.screen;

    // Otherwise, try to calculate as much as possible
		} else {

			errorObj.screen = {

				availHeight: window.outerHeight,
				availLeft: window.screenLeft,
				availTop: window.screenTop,
				availWidth: window.outerWidth,
				height: window.outerHeight + 40,
				width: window.outerWidth

			};

		}

    // Stringify our errorObj for transmission to the server
		window._errorString = this._errorString = JSON.stringify(errorObj);

    // TODO: Use standard JS XHR request (NOT jQuery) to post to the server stored in the postURL variable
		console.log(this._errorObj);

	};

  // On an error, create a new errorObj and send it to the server
  // Return true so the application can continue
	window.onerror = function(msg, file, line) {

		new _STACK.Error(msg, file, line);

		return true;

	};

}(window, undefined, JSON));