(function(){
    'use strict';

    function Storage(storageAreaName)
    {
        var _storageArea = (storageAreaName === 'session') ? window.sessionStorage : window.localStorage;

        this.isSupported = function() {
            return typeof _storageArea !== 'undefined';
        };
        this.set = function(key, val) {
            if(val === undefined)
                return;

            if(typeof val === 'function')
                return;
            else if(typeof val === 'object')
                _storageArea[key] = JSON.stringify(val);
            else
                _storageArea[key] = val;
        };
        this.get = function(key) {
            if(_storageArea[key] === undefined)
                return null;

            try {
                return JSON.parse(_storageArea[key]);
            }
            catch(ex) {
                return _storageArea[key];
            }
            return _storageArea[key];
        };
        this.exists = function(key) {
            return _storageArea[key] !== undefined;
        };
        this.clear = function() {
            if(arguments.length === 0)
                _storageArea.clear();
            else
            {
                for(var i=0; i<arguments.length; i++)
                    _storageArea.removeItem(arguments[i]);
            }
        };
        this.getKeys = function() {
            var list = [];
            for(var i in _storageArea)
            {
                if(_storageArea.hasOwnProperty(i))
                    list.push(i);
            }
            return list;
        };
    };

    window.storage = new Storage();
    window.storage.local = new Storage();
    window.storage.session = new Storage('session');

    return;
})();
