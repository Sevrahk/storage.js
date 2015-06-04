# storage.js

storage.js is a library to easily manage data storage of key/value pair in browsers.

With storage.js can manage:
* **localStorage** to store data and retrieve them even if you closed your browser.
* **sessionStorage** to store data only for the current session.
* **cookies** if the localStorage is not available.

storage.js is a standalone library, it works well with any other JavaScript library like jQuery, jQueryMobile, Prototype, MooTools...

Installation
-----
To use storage.js library you just need to include it in your html documents.

``` html
<script src='storage-1.2.0.min.js'></script>
```

Usage
-----
To manage the **localStorage**/**cookies** you need to call the object `storage`.  
To manage the **sessionStorage** you need to call `storage.session`.

###Example
```javascript
storage.set(key, value); //set a new value in the localStorage (or cookies)
storage.session.set(key, value); //set a new value in the sessionStorage
```

Function reference
-----

### set(key, value)

Saves a value to localStorage/sessionStorage.  
`key` needs to be string or a number otherwise an exception is raised.  
`value` can be any JavaScript type.

```javascript
storage.set(key, value);
```

### get(key)

Get the value from the localStorage/sessionStorage.  
`key` needs to be string or a number otherwise an exception is raised.

```javascript
value = storage.get(key);
```

### exists(key)

Check if the key is existing in the localStorage/sessionStorage.  
`key` needs to be string or a number otherwise an exception is raised.

```javascript
storage.exists(key);
```

### remove(keys)

Remove the selected key or array of keys from the storage.  
`keys` needs to be string or a number or and Array of strings otherwise an exception is raised.

```javascript
storage.remove(key);
storage.remove([key1, key2, ...]);
```

### clear()

Clear the localStorage/sessionStorage.  

```javascript
storage.clear();
```

### rename(key, newKey[, overwrite])

Rename the selected key by the newKey name.  
If the newKey exists an exception will be raised except if the overwrite parameter is set to true.  
`key` needs to be string or a number otherwise an exception is raised.  
`newKey` needs to be string or a number otherwise an exception is raised.  
`key` (optional) Boolean.

```javascript
storage.rename(key1, key2);
storage.rename(key1, key2, true);
```

### copyToOtherStorage(key, newKey[, overwrite])

Copy the keys to the other storage.  
localStorage -> sessionStorage or sessionStorage -> localStorage  
`key` (optional) needs to be string or a number otherwise an exception is raised.

```javascript
storage.copyToOtherStorage();
storage.copyToOtherStorage(key1, key2);
```

### getKeys()

Get all the stored keys.

```javascript
storage.getKeys();
```

## Browser support

storage.js supports all major browsers:

* Internet Explorer 8+
* Firefox 3.5+
* Safari 4+
* Chrome 4+
* Opera 10.5+

## License

This library is released under the [MIT License].

[MIT License]: http://mit-license.org/