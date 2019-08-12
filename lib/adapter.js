var firepad = firepad || { };

firepad.ServerAdapter = (function(global) {

  var utils = firepad.utils;

  function ServerAdapter(userId, userColor) {
    this.userId_ = userId;
    this.userColor_ = userColor;
  }
  utils.makeEventEmitter(ServerAdapter, ['ready', 'cursor', 'operation', 'ack', 'retry']);

  ServerAdapter.prototype.dispose = function() {
  };

  ServerAdapter.prototype.setUserId = function(userId) {
    this.userId_ = userId;
  };

  ServerAdapter.prototype.setUserColor = function(userColor) {
    this.userColor_ = userColor;
  };

  /*
   * Send operation, retrying on connection failure. Takes an optional callback with signature:
   * function(error, committed).
   * An exception will be thrown on transaction failure, which should only happen on
   * catastrophic failure like a security rule violation.
   */
  ServerAdapter.prototype.sendOperation = function(operation, callback) {
    console.warn("not implemented: sendOperation(operation, callback)");
  };
    
  ServerAdapter.prototype.sendCursor = function(obj) {
    console.warn("not implemented: sendCursor(obj)");
  };

  ServerAdapter.prototype.registerCallbacks = function(callbacks) {
    for (var eventType in callbacks) {
      this.on(eventType, callbacks[eventType]);
    }
  };
  
  return ServerAdapter;
})(this);
