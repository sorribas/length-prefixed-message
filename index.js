var readFn = function(byteLen) {
  switch(byteLen) {
    case 1:
      return Buffer.prototype.readUInt8
    case 2:
      return Buffer.prototype.readUInt16LE
    case 4:
      return Buffer.prototype.readUInt32LE
    default:
      return null;
  }
};

var writeFn = function(byteLen) {
  switch(byteLen) {
    case 1:
      return Buffer.prototype.writeUInt8
    case 2:
      return Buffer.prototype.writeUInt16LE
    case 4:
      return Buffer.prototype.writeUInt32LE
    default:
      return null;
  }
};

var create = function(opts) {
  opts = opts || {};
  opts.length = opts.length || 2;
  if ([1,2,4].indexOf(opts.length) === -1) throw new Error('Invalid message length.');

  var that = {};

  that.read = function(stream, cb) {
    var msglen = 0;
    var readable = function() {
      if (!msglen) {
        msglen = stream.read(opts.length);
        if (!msglen) return;
        msglen = readFn(opts.length).call(msglen, 0);
      }

      var chunk = stream.read(msglen);
      if (!chunk) return;

      stream.removeListener('readable', readable);
      cb(chunk)
    };

    stream.on('readable', readable);
    readable();
  };

  that.write = function(stream, buffer) {
    var buf = new Buffer(buffer.length + opts.length);
    writeFn(opts.length).call(buf, buffer.length, 0);
    buffer.copy(buf, opts.length);
    stream.write(buf);
  };

  return that;
};

module.exports = create;
