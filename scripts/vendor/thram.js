/**
 * ThramJS
 *
 * Micro front-end framework
 *
 * Created by thram on 17/06/15.
 */
var thram = (function () {

    /**
     * object.watch polyfill
     *
     * 2012-04-03
     *
     * By Eli Grey, http://eligrey.com
     * Public Domain.
     *
     * Modified by Nenad Damnjanović
     * Nov 9, 2014
     *
     * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
     */

    // object.watch
    if (!Object.prototype.watch) {
        Object.defineProperty(Object.prototype, "watch", {
            enumerable: false
            , configurable: true
            , writable: false
            , value: function (prop, handler) {
                var
                    oldval = this[prop]
                    , getter = function () {
                        return oldval;
                    }
                    , setter = function (newval) {
                        if (oldval !== newval) {
                            handler.call(this, prop, oldval, newval);
                            oldval = newval;
                        }
                        else {
                            return false
                        }
                    }
                    ;

                if (delete this[prop]) { // can't watch constants
                    Object.defineProperty(this, prop, {
                        get: getter
                        , set: setter
                        , enumerable: true
                        , configurable: true
                    });
                }
            }
        });
    }

    // object.unwatch
    if (!Object.prototype.unwatch) {
        Object.defineProperty(Object.prototype, "unwatch", {
            enumerable: false
            , configurable: true
            , writable: false
            , value: function (prop) {
                var val = this[prop];
                delete this[prop]; // remove accessors
                this[prop] = val;
            }
        });
    }

    /**
     *
     * Example usage:
     *
     *
     var o = {p: 1};

     o.watch("p", function (id, oldval, newval) {
	    console.log( "o." + id + " changed from " + oldval + " to " + newval );
	    return newval;
	});

     o.p = 2; // should log the change
     o.p = 2; // should do nothing
     *
     *
     */

    /**
     * Based on domready by Dustin Diaz: https://github.com/ded/domready
     *
     * @returns {Function}
     * @private
     */
    function _ready() {
        var fns = [], listener
            , doc = document
            , hack = doc.documentElement.doScroll
            , domContentLoaded = 'DOMContentLoaded'
            , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);


        if (!loaded)
            doc.addEventListener(domContentLoaded, listener = function () {
                doc.removeEventListener(domContentLoaded, listener);
                loaded = 1;
                while (listener = fns.shift()) listener();
            });

        return function (fn) {
            loaded ? setTimeout(fn, 0) : fns.push(fn);
        }

    }

    var storage = (function () {
        // Store.js
        var store = {},
            win = window,
            doc = win.document,
            localStorageName = 'localStorage',
            scriptTag = 'script',
            storage;

        store.disabled = false;
        store.version = '1.3.17';
        store.set = function (key, value) {
        };
        store.get = function (key, defaultVal) {
        };
        store.has = function (key) {
            return store.get(key) !== undefined
        };
        store.remove = function (key) {
        };
        store.clear = function () {
        };
        store.transact = function (key, defaultVal, transactionFn) {
            if (transactionFn == null) {
                transactionFn = defaultVal;
                defaultVal = null;
            }
            if (defaultVal == null) {
                defaultVal = {};
            }
            var val = store.get(key, defaultVal);
            transactionFn(val);
            store.set(key, val);
        };
        store.getAll = function () {
        };
        store.forEach = function () {
        };

        store.serialize = function (value) {
            return JSON.stringify(value);
        };
        store.deserialize = function (value) {
            if (typeof value != 'string') {
                return undefined;
            }
            try {
                return JSON.parse(value);
            }
            catch (e) {
                return value || undefined;
            }
        };

        // Functions to encapsulate questionable FireFox 3.6.13 behavior
        // when about.config::dom.storage.enabled === false
        // See https://github.com/marcuswestin/store.js/issues#issue/13
        function isLocalStorageNameSupported() {
            try {
                return (localStorageName in win && win[localStorageName]);
            }
            catch (err) {
                return false;
            }
        }

        if (isLocalStorageNameSupported()) {
            storage = win[localStorageName];
            store.set = function (key, val) {
                if (val === undefined) {
                    return store.remove(key);
                }
                storage.setItem(key, store.serialize(val));
                return val;
            };
            store.get = function (key, defaultVal) {
                var val = store.deserialize(storage.getItem(key));
                return (val === undefined ? defaultVal : val)
            };
            store.remove = function (key) {
                storage.removeItem(key);
            };
            store.clear = function () {
                storage.clear()
            };
            store.getAll = function () {
                var ret = {};
                store.forEach(function (key, val) {
                    ret[key] = val;
                });
                return ret;
            };
            store.forEach = function (callback) {
                for (var i = 0; i < storage.length; i++) {
                    var key = storage.key(i);
                    callback(key, store.get(key));
                }
            }
        } else if (doc.documentElement.addBehavior) {
            var storageOwner,
                storageContainer;
            // Since #userData storage applies only to specific paths, we need to
            // somehow link our data to a specific path.  We choose /favicon.ico
            // as a pretty safe option, since all browsers already make a request to
            // this URL anyway and being a 404 will not hurt us here.  We wrap an
            // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
            // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
            // since the iframe access rules appear to allow direct access and
            // manipulation of the document element, even for a 404 page.  This
            // document can be used instead of the current document (which would
            // have been limited to the current path) to perform #userData storage.
            try {
                storageContainer = new ActiveXObject('htmlfile');
                storageContainer.open();
                storageContainer.write('<' + scriptTag + '>document.w=window</' + scriptTag + '><iframe src="/favicon.ico"></iframe>');
                storageContainer.close();
                storageOwner = storageContainer.w.frames[0].document;
                storage = storageOwner.createElement('div');
            } catch (e) {
                // somehow ActiveXObject instantiation failed (perhaps some special
                // security settings or otherwse), fall back to per-path storage
                storage = doc.createElement('div');
                storageOwner = doc.body;
            }
            var withIEStorage = function (storeFunction) {
                return function () {
                    var args = Array.prototype.slice.call(arguments, 0);
                    args.unshift(storage);
                    // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
                    // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
                    storageOwner.appendChild(storage);
                    storage.addBehavior('#default#userData');
                    storage.load(localStorageName);
                    var result = storeFunction.apply(store, args);
                    storageOwner.removeChild(storage);
                    return result;
                }
            };

            // In IE7, keys cannot start with a digit or contain certain chars.
            // See https://github.com/marcuswestin/store.js/issues/40
            // See https://github.com/marcuswestin/store.js/issues/83
            var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
            var ieKeyFix = function (key) {
                return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___');
            };
            store.set = withIEStorage(function (storage, key, val) {
                key = ieKeyFix(key);
                if (val === undefined) {
                    return store.remove(key);
                }
                storage.setAttribute(key, store.serialize(val));
                storage.save(localStorageName);
                return val;
            });
            store.get = withIEStorage(function (storage, key, defaultVal) {
                key = ieKeyFix(key);
                var val = store.deserialize(storage.getAttribute(key));
                return (val === undefined ? defaultVal : val);
            });
            store.remove = withIEStorage(function (storage, key) {
                key = ieKeyFix(key);
                storage.removeAttribute(key);
                storage.save(localStorageName);
            });
            store.clear = withIEStorage(function (storage) {
                var attributes = storage.XMLDocument.documentElement.attributes;
                storage.load(localStorageName);
                while (attributes.length) {
                    storage.removeAttribute(attributes[0].name);
                }
                storage.save(localStorageName);
            });
            store.getAll = function (storage) {
                var ret = {};
                store.forEach(function (key, val) {
                    ret[key] = val;
                });
                return ret;
            };
            store.forEach = withIEStorage(function (storage, callback) {
                var attributes = storage.XMLDocument.documentElement.attributes;
                for (var i = 0, attr; attr = attributes[i]; ++i) {
                    callback(attr.name, store.deserialize(storage.getAttribute(attr.name)));
                }
            })
        }

        try {
            var testKey = '__storejs__';
            store.set(testKey, testKey);
            if (store.get(testKey) != testKey) {
                store.disabled = true;
            }
            store.remove(testKey);
        } catch (e) {
            store.disabled = true;
        }
        store.enabled = !store.disabled;

        return store;
    })();

    var controllers = (function () {
        var _controllers = {};

        function get(key) {
            return _controllers[key];
        }

        function add(key, controller) {
            _controllers[key] = controller;
        }

        return {
            get: get,
            add: add
        }
    })();

    var templates = (function () {
        function process(id, data) {
            var html = document.querySelector('script#' + id + '[type=template]').innerHTML;
            var re = /\{\{(.+?)}}/g,
                reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
                code = 'with(obj) { var r=[];\n',
                cursor = 0,
                result;
            var add = function (line, js) {
                js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                    (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                return add;
            };
            while (match = re.exec(html)) {
                add(html.slice(cursor, match.index))(match[1], true);
                cursor = match.index + match[0].length;
            }
            add(html.substr(cursor, html.length - cursor));
            code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');
            try {
                result = new Function('obj', code).apply(data, [data]);
            }
            catch (err) {
                console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n");
            }
            return result;
        }

        return {
            process: process
        }
    })();

    var views = (function () {
        var _views = {};

        function enter() {
            events.trigger('view:enter');
        }

        function leave() {
            events.trigger('view:leave');
        }

        window.onbeforeunload = function () {
            leave();
        };

        function get(key) {
            return _views[key];
        }

        function add(key, view) {
            _views[key] = view;
        }

        return {
            enter: enter,
            leave: leave,
            get: get,
            add: add
        }
    })();

    var components = (function () {
        var _components = {};

        function get(key) {
            return _components[key];
        }

        function add(key, component) {
            _components[key] = component;
        }

        return {
            get: get,
            add: add
        }
    })();

    var modules = (function () {

        var _modules = {};

        function get(key) {
            return _modules[key];
        }

        function add(key, module) {
            _modules[key] = module;
        }

        return {
            get: get,
            add: add
        }
    })();
    var models = (function () {

        var _modules = {};

        function get(key) {
            return _modules[key];
        }

        function add(key, model) {
            _modules[key] = model;
        }

        return {
            get: get,
            add: add
        }
    })();

    var router = (function () {
        function go(route) {
            window.location.href = route;
        }

        function process() {
            var BreakException = {};
            try {
                thram.routes.forEach(function (route) {
                    var routeMatcher = new RegExp(route.route.replace(/:[^\s/]+/g, '([\\w-]+)'));
                    var url = window.location.pathname;
                    var match = url.match(routeMatcher);
                    if (match && match.length > 0 && match[0] === url) {
                        var params = {};
                        if (route.route.indexOf(':') >= 0) {
                            var keys = route.route.match(/:(.+?)(\/|\?|$)/g);
                            if (keys) {
                                keys = keys.join('&').replace(/:/g, '').replace(/\//g, '').split('&');
                                var values = match;
                                keys.forEach(function (key, i) {
                                    params[key] = values[i];
                                });
                            }
                        }

                        function initView() {
                            var base = thram.views.get('base');
                            base && base.init(url, params);
                            thram.views.get(route.view).init(url, params);
                        }

                        route.validate ?
                            (route.validate.validation() ? initView() : route.validate.onValidationFail())
                            : initView();

                        throw BreakException;
                    }
                });
            } catch (e) {
                if (e !== BreakException) throw e;
            }
        }

        return {
            go: go,
            process: process
        }
    })();

    var events = (function () {

        function trigger(event, data) {
            var ev = new Event('thram:' + event, data);
            dispatchEvent(ev);
        }

        function on(event, func) {
            addEventListener("thram:" + event, func);
        }

        function off(event, func) {
            removeEventListener("thram:" + event, func);
        }

        return {
            off: off,
            on: on,
            trigger: trigger
        }
    })();

    var toolbox = (function () {

        var _tools = {};

        function get(key) {
            return _tools[key];
        }

        function add(key, tool) {
            _tools[key] = tool;
        }

        return {
            get: get,
            add: add
        }
    })();


    function start() {
        _ready()(function () {
            views.enter();
            router.process();
        });
    }

    return {
        routes: [],
        examples: {},
        storage: storage,
        templates: templates,
        toolbox: toolbox,
        events: events,
        router: router,
        models: models,
        modules: modules,
        components: components,
        controllers: controllers,
        views: views,
        start: start
    }
})();

thram.examples.view = function () {

    // View Example
    function init(url, params) {
        // Initialize View
    }

    return {
        init: init
    }
};

// Route Example
thram.examples.route = {
    route: '/test/:id',
    view: 'test'
};
