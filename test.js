var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');
var lengthPrefixed = require('./');

test('.read', function(t) {
  var lpm = lengthPrefixed({length: 2});
  lpm.read(fs.createReadStream('./fixtures'), function(buf) {
    t.equal(buf.toString(), 'When Gregor Samsa woke up one morning from unsettling dreams, he found himself changed \n');
    t.end();
  });
});

test('.write', function(t) {
  var lpm = lengthPrefixed({length: 2});
  var stream = concat(function(buff) {
    var len = buff.readUInt16LE(0);
    t.equal(len, 11);

    var str = buff.slice(2, 13).toString();
    t.equal(str, 'Hello world');
    t.end();
  });
  lpm.write(stream, new Buffer('Hello world'));
  stream.end();
});
