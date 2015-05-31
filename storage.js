/*!
 * storage.js v1.1.0
 * https://github.com/Sevrahk/storage.js
 *
 * Copyright (c) 2014 Thomas BERTRAND
 * Released under the MIT license
 */
(function(){
    'use strict';

    /**
     * StorageManager
     *
     * @param {String} storageAreaName
     */
    function StorageManager(storageAreaName)
    {
        this._storageArea;
        switch(storageAreaName)
        {
            case 'session':
                this._storageArea = window.sessionStorage;
                break;
            default:
                this._storageArea = window.localStorage;
                break;
        }
    }

    /**
     * Save variable in the storage.
     *
     * @param {String} key : Storage key
     * @param {Mixed} val : Value
     */
    StorageManager.prototype.set = function(key, val) {
        this.checkKey(key);

        if(val === undefined || typeof val === 'function')
            return;

        if(typeof val === 'object')
            val = JSON.stringify(val);

        this._storageArea[key] = val;
    };

    /**
     * Get the value of the entered key.
     *
     * @param {String} key : Stored key
     * @returns {String|Array|Object}
     */
    StorageManager.prototype.get = function(key) {
        this.checkKey(key);

        if(this._storageArea[key] === undefined)
            return undefined;

        try {
            return JSON.parse(this._storageArea[key]);
        }
        catch(ex) {
            return this._storageArea[key];
        }
        return this._storageArea[key];
    };

    /**
     * Check if the key exists in the storage.
     *
     * @param {String} key : Stored key
     * @returns {Boolean}
     */
    StorageManager.prototype.exists = function(key) {
        this.checkKey(key);

        return this._storageArea[key] !== undefined;
    };

    /**
     * Remove the selected key(s)
     *
     * @example remove('key1');
     * @example remove(['key1', 'key2']); <- delete key1 and key2
     *
     * @param {String|Array} [keys] : Stored key(s)
     */
    StorageManager.prototype.remove = function(keys) {
        if(keys instanceof Array)
        {
            for(var i in keys)
               this._storageArea.removeItem(keys[i]);
        }
        else
            this._storageArea.removeItem(keys);
    };

    /**
     * Clear the storage.
     *
     * @example clear();
     */
    StorageManager.prototype.clear = function() {
        this._storageArea.clear();
    };

    /**
     * Rename the selected key
     *
     * @param {String} key : Stored key
     * @param {String} newKey : new name of your key
     * @param {Boolean} [overwrite] : (Default false) if set to false the function will throw an error if the newKey already exists in the storage
     */
    StorageManager.prototype.rename = function(key, newKey, overwrite) {
        overwrite = (overwrite !== undefined) ? overwrite : false;
        if(key === newKey)
            return;

        this.checkKey(newKey);
        if(overwrite === false && this.exists(newKey))
            throw new TypeError('The new key name already exists in the storage. If you want to replace it set overwrite parameter to true.');

        if(this.exists(key))
        {
            this.set(newKey, this.get(key));
            this.remove(key);
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
    StorageManager.prototype.copyToOtherStorage = function() {
        var targetedStorage = (this._storageArea === window.localStorage) ? window.sessionStorage : window.localStorage;

        if(typeof targetedStorage === 'undefined')
        {
            console.error('The other storage is not available.');
            return;
        }

        if(arguments.length === 0)
        {
            for(var key in this._storageArea)
                targetedStorage[key] = this._storageArea[key];
        }
        else
        {
            for(var i in arguments)
            {
                if(this.exists(arguments[i]))
                    targetedStorage[arguments[i]] = this._storageArea[arguments[i]];
            }
        }
    };

    /**
     * Get all the stored keys.
     *
     * @returns {Array}
     */
    StorageManager.prototype.getKeys = function() {
        var list = [];
        for(var key in this._storageArea)
            list.push(key);

        return list;
    };

    /**
     * Check if the entered key can be used in the storage
     *
     * @example checkKey('key1');
     */
    StorageManager.prototype.checkKey = function(key)
    {
        if((typeof key !== 'string' && typeof key !== 'number') || key.length === 0)
            throw new TypeError('Key must be string or numeric.');

        return true;
    };

    //Initialization
    window.storage = Object;
    if(typeof window.localStorage !== 'undefined')
        window.storage = new WindowStorageManager('local');

    if(typeof window.sessionStorage !== 'undefined')
        window.storage.session = new WindowStorageManager('session');

    return;
})();
