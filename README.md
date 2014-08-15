#length-prefixed-message

Reads and writes binary length prefixed messages.

Example

```js
var lengthPrefixedMessage = require('length-prefixed-message');
var lpm = lengthPrefixedMessage({length: 2}); // the length of the prefix

lpm.read(someStream, function(msgBuffer) {
    console.log(msgBuffer.toString());
});

lpm.write(someOtherStream, new Buffer('hello world'));
```