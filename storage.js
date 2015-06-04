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
            case 'cookie':
                this._storageArea = document.cookie;
                this._cookieValidityTime = 365*24*60*60;
                break;
            default:
                this._storageArea = window.localStorage;
                break;
        }
    }

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
     * WindowStorageManager - localStorage and sessionStorage manager
     *
     * @param {String} storageAreaName
     */
    function WindowStorageManager(storageAreaName)
    {
        StorageManager.call(this, storageAreaName);
    }
    WindowStorageManager.prototype = Object.create(StorageManager.prototype);

    /**
     * Save variable in the storage.
     *
     * @param {String} key : Storage key
     * @param {Mixed} val : Value
     */
    WindowStorageManager.prototype.set = function(key, val) {
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
    WindowStorageManager.prototype.get = function(key) {
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
    WindowStorageManager.prototype.exists = function(key) {
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
    WindowStorageManager.prototype.remove = function(keys) {
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
    WindowStorageManager.prototype.clear = function() {
        this._storageArea.clear();
    };

    /**
     * Get all the stored keys.
     *
     * @returns {Array}
     */
    WindowStorageManager.prototype.getKeys = function() {
        var list = [];
        for(var key in this._storageArea)
            list.push(key);

        return list;
    };

    /**
     * Copy the keys to the other storage. (localStorage -> sessionStorage or sessionStorage -> localStorage)
     *
     * @example copyToOtherStorage(); <- copy all the keys to the other storage
     * @example copyToOtherStorage('key1', 'key2'); <- copy key1 and key2 to the other storage
     *
     * @param {String} [key] : Stored key(s)
     */
    WindowStorageManager.prototype.copyToOtherStorage = function() {
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
     * CookieStorageManager - Cookies storage manager
     */
    function CookieStorageManager()
    {
        StorageManager.call(this, 'cookie');
    }
    CookieStorageManager.prototype = Object.create(StorageManager.prototype);

    /**
     * Save variable in the storage.
     *
     * @param {String} key : Storage key
     * @param {Mixed} val : Value
     */
    CookieStorageManager.prototype.set = function(key, val, isCreated) {
        isCreated = (typeof isCreated === 'undefined') ? true : isCreated;
        this.checkKey(key);

        if(val === undefined || typeof val === 'function')
            return;

        if(typeof val === 'object')
            val = JSON.stringify(val);

        var cookieValidityTime = isCreated ? this._cookieValidityTime : -1,
            expires;
        //expires for IE
        if(window.ActiveXObject)
        {
            var expireDate = new Date(new Date().getTime() + cookieValidityTime * 1000);
            expires = '; expires=' + expireDate.toGMTString();
        }
        else
            expires = '; max-age=' + cookieValidityTime;

        this._storageArea = key + '=' + encodeURIComponent(val) + expires;
    };

    /**
     * Get the value of the entered key.
     *
     * @param {String} key : Stored key
     * @returns {String|Array|Object}
     */
    CookieStorageManager.prototype.get = function(key) {
        this.checkKey(key);

        key = key + '=';
        var index = -1,
            cookies = this._storageArea.split(';');

        for(var i=0; i<cookies.length; i++)
        {
            var cookie = cookies[i];
            if(cookie.trim().indexOf(key) === 0)
            {
                index = i;
                break;
            }
        }

        if(index === -1)
            return undefined;

        var result = decodeURIComponent(cookies[index].trim().substring(key.length));
        try {
            return JSON.parse(result);
        }
        catch(ex) {
            return result;
        }
        return result;
    };

    /**
     * Check if the key exists in the storage.
     *
     * @param {String} key : Stored key
     * @returns {Boolean}
     */
    CookieStorageManager.prototype.exists = function(key) {
        return this.get(key) !== undefined;
    };

    /**
     * Remove the selected key(s)
     *
     * @example remove('key1');
     * @example remove(['key1', 'key2']); <- delete key1 and key2
     *
     * @param {String|Array} [keys] : Stored key(s)
     */
    CookieStorageManager.prototype.remove = function(keys) {
        if(keys instanceof Array)
        {
            for(var i in keys)
            {
                if(keys[i] !== '')
                    this.set(keys[i], '', false);
            }
        }
        else
            this.set(keys, '', false);
    };

    /**
     * Clear the storage.
     *
     * @example clear();
     */
    CookieStorageManager.prototype.clear = function() {
        this.remove(this.getKeys());
    };

    /**
     * Get all the stored keys.
     *
     * @returns {Array}
     */
    CookieStorageManager.prototype.getKeys = function() {
        var cookies = this._storageArea.split(';'),
            list = [];

        for(var i=0; i<cookies.length; i++)
        {
            var cookie = cookies[i];
            cookie = cookie.substring(0, cookie.indexOf('='));
            list.push(cookie.trim());
        }

        return list;
    };

    //Initialization
    window.storage = Object;
    if(typeof window.localStorage !== 'undefined')
        window.storage = new WindowStorageManager('local');
    else
        window.storage = new CookieStorageManager();

    if(typeof window.sessionStorage !== 'undefined')
        window.storage.session = new WindowStorageManager('session');

    return;
})();
