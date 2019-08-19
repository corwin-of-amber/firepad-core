var firepad = firepad || { };

if (!firepad.EditorClient) {
  throw new Error("Oops! It looks like you're trying to include lib/firepad.js directly.  " +
                  "This is actually one of many source files that make up firepad.  " + 
                  "You want dist/firepad.js instead.");
}

firepad.FirepadCore = (function(global) {

  const {EditorClient, EntityManager, RichTextCodeMirror, RichTextCodeMirrorAdapter,
         ServerAdapter, utils} = firepad;

  // Firepad *can* work in Browserify, but requires CodeMirror to be available globally
  if (!global.CodeMirror)
    global.CodeMirror = require('codemirror');



  const DEFAULT_OPTIONS = {userId: 'null-user', userColor: '#9999FF'};


  class FirepadCore extends EditorClient {

    constructor(editor, opts={}) {
      opts = Object.assign({}, DEFAULT_OPTIONS, opts);

      var serverAdapter = new TriggerAdapter(null, opts.userId, opts.userColor),
          editorAdapter = FirepadCore.createCodeMirrorAdapter(editor);

      super(serverAdapter, editorAdapter);
      serverAdapter.target = this; /* `this` is only available after super() */

      this.editor = editor;
    }

    setUserId(userId)   { this.serverAdapter.setUserId(userId); }
    setUserColor(color) { this.serverAdapter.setUserColor(color); }

    static createCodeMirrorAdapter(cm) {
      var entityManager_ = new EntityManager();
      var richTextCodeMirror_ = new RichTextCodeMirror(cm, entityManager_,
                                { cssPrefix: 'firepad-' }),
          editorAdapter_ = new RichTextCodeMirrorAdapter(richTextCodeMirror_);

      return editorAdapter_;
    }

    data(msg) {
      if (msg.operation)
        this.serverAdapter.trigger('operation', msg.operation);
      if (msg.cursor)
        this.serverAdapter.trigger('cursor',
          msg.cursor.user, msg.cursor.at, msg.cursor.color);
    }

    dispose() {
      this.destroyed = true;
      this.serverAdapter.dispose();
      this.editorAdapter.detach();
      if (this.editorAdapter.rtcm) this.editorAdapter.rtcm.detach();
    }
  }

  utils.makeEventEmitter(FirepadCore, ['data'].concat(
      EditorClient.prototype.allowedEvents_));


  class TriggerAdapter extends ServerAdapter {

    constructor(target, userId, userColor) {
      super(userId, userColor);
      this.target = target;
    }

    sendOperation(operation, callback) {
      this.target.trigger('data', {operation});
      process.nextTick(() => {
        this.trigger('ack');
        if (callback) callback();
      });
    }

    sendCursor(at) {
      var cursor = {at, user: this.userId_, color: this.userColor_};
      this.target.trigger('data', {cursor});
    }

  }

  return FirepadCore;

})(this);
