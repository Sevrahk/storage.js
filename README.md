# storage.js

storage.js is library to easily manage data storage of key/value pair data in browsers.

With storage.js can manage both:
* **localStorage** to store data and retreve them even if you closed your browser
* **sessionStorage** to store data only for the current session.

storage.js is a standalone library, it works well with any other JavaScript library like jQuery, jQueryMobile, Prototype, MooTools...

Installation
-----
To use storage.js library you just need to include it in your html documents.

``` html
<script src='storage.min.js'></script>
```

Usage
-----
To manage the **localStorage** you need to call `storage.local` or directly and simply `storage`.  
To manage the **sessionStorage** you need to call `storage.session`.

###Example
```javascript
storage.set(key, value); //set a new value in the localStorage
storage.local.set(key, value); //similar as storage.set() function
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

### clear([key])

Clear the localStorage/sessionStorage or delete the selected keys.  
`key` (optional) needs to be string or a number otherwise an exception is raised.

```javascript
storage.clear();
storage.clear(key);
storage.clear(key1, key2, ...);
```

### getKeys()

Get all the stored keys.

```javascript
storage.getKeys();
```

### isSupported()

Check if you the storage is supported by the browser

```javascript
storage.isSupported();
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