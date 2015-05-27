/*!
 * storage.js v1.1.0
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
                for(var i in arguments)
                    _storageArea.removeItem(arguments[i]);
            }
        };

        /**
         * Rename the selected key
         *
         * @param {String} key : Stored key
         * @param {String} newKey : new name of your key
         * @param {Boolean} [overwrite] : (Default false) if set to false the function will throw an error if the newKey already exists in the storage
         */
        this.rename = function(key, newKey, overwrite) {
            overwrite = (overwrite !== undefined) ? overwrite : false;
            if(key === newKey)
                return;

            checkKey(newKey);
            if(overwrite === false && this.exists(newKey))
                throw new TypeError('The new key name already exists in the storage. If you want to replace it set overwrite parameter to true.');

            if(this.exists(key))
            {
                _storageArea[newKey] = _storageArea[key];
                _storageArea.removeItem(key);
            }
        };

        /**
         * Copy the keys to the other storage. (localStorage -> sessionStorage or sessionStorage -> localStorage)
         *
         * @example copyToOtherStorage(); <- copy all the keys to the other storage
         * @example copyToOtherStorage('key1', 'key2'); <- copy key1 and key2 to the other storage
         *
         * @param {String} [key] : Stored key(s)
         */
        this.copyToOtherStorage = function() {
            var storageToCopy = (_storageArea === window.localStorage) ? window.sessionStorage : window.localStorage;
            if(arguments.length === 0)
            {
                for(var key in _storageArea)
                    storageToCopy[key] = _storageArea[key];
            }
            else
            {
                for(var i in arguments)
                {
                    if(this.exists(arguments[i]))
                        storageToCopy[arguments[i]] = _storageArea[arguments[i]];
                }
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
            if((typeof key !== 'string' && typeof key !== 'number') || key.length === 0)
                throw new TypeError('Key must be string or numeric.');

            return true;
        }
    };

    window.storage = new Storage();
    window.storage.session = new Storage('session');

    return;
})();
