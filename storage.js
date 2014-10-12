/*!
 * storage.js v1.0.0
 * https://github.com/Sevrahk/storage.js
 *
 * Copyright (c) 2014 Thomas BERTRAND
 * Released under the MIT license
 */
(function(){
    'use strict';

    function Storage(storageAreaName)
    {
        var _storageArea = (storageAreaName === 'session') ? window.sessionStorage : window.localStorage;

        /**
         * Check if you the storage is supported by the browser
         *
         * @returns {Boolean}
         */
        this.isSupported = function() {
            return typeof _storageArea !== 'undefined';
        };

        /**
         * Save variable in the storage.
         *
         * @param {String} key : Storage key
         * @param {Mixed} val : Value
         */
        this.set = function(key, val) {
            checkKey(key);

            if(val === undefined)
                return;

            if(typeof val === 'function')
                return;
            else if(typeof val === 'object')
                _storageArea[key] = JSON.stringify(val);
            else
                _storageArea[key] = val;
        };

        /**
         * Get the value of the entered key.
         *
         * @param {String} key : Stored key
         * @returns {String|Array|Object}
         */
        this.get = function(key) {
            checkKey(key);

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

        /**
         * Check if the key exists in the storage.
         *
         * @param {String} key : Stored key
         * @returns {Boolean}
         */
        this.exists = function(key) {
            checkKey(key);

            return _storageArea[key] !== undefined;
        };

        /**
        * Clear the storage or delete the keys.
        *
        * @example clear(); <- clear the storage
        * @example clear('key1', 'key2'); <- delete key1 and key2
        *
        * @param {String} [key] : Stored key(s)
        */
        this.clear = function() {
            if(arguments.length === 0)
                _storageArea.clear();
            else
            {
                for(var i=0; i<arguments.length; i++)
                    _storageArea.removeItem(arguments[i]);
            }
        };

        /**
         * Get all the stored keys.
         *
         * @returns {Array}
         */
        this.getKeys = function() {
            var list = [];
            for(var key in _storageArea)
                list.push(key);

            return list;
        };

        function checkKey(key)
        {
            if(typeof key !== 'string' && typeof key !== 'number')
                throw new TypeError('Key must be string or numeric');

            return true;
        }
    };

    window.storage = new Storage();
    window.storage.local = new Storage();
    window.storage.session = new Storage('session');

    return;
})();
