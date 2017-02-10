//todo: To get rid of the duplication of code, you should try to use a constructor function
//todo: needs to mutch best visual separation blocks in the interface window

// return code alternative character(s) used while editting
var RETURN_CODE_ALT         = "\n";
// return code that used in regexp (escape the characters if it needs)
var RETURN_CODE_ALT_FOR_REX = RETURN_CODE_ALT;

function getContents() {
  try {
    _checkDoc();
  } catch (e) {
    return e;
  }
  // get textframes in the selection
  var tfs = []; // textframes
  _extractTextFramesAsVTextFrameItem(app.activeDocument.selection, tfs);
  try {
    _checkTextFrames(tfs);
  } catch (e) {
    return e;
  }
  // sort tfs
  _sortVTextFramesReasonableByPosition(tfs);
  // get the contents of tfs
  var conts           = [];
  var rex_return_code = new RegExp("\r", "g");
  for (var i = 0; i < tfs.length; i++) {
    conts.push(tfs[i].tf.contents.replace(
      rex_return_code, RETURN_CODE_ALT));
  }
  return conts.join("\n---\n");
}

function replaceAll(et) {
  try {
    _checkDoc();
  } catch (e) {
    return e;
  }
  // get textframes in the selection
  var tfs = []; // textframes
  _extractTextFramesAsVTextFrameItem(app.activeDocument.selection, tfs);
  try {
    _checkTextFrames(tfs);
  } catch (e) {
    return e;
  }
  // sort tfs
  _sortVTextFramesReasonableByPosition(tfs);
  // get the contents of tfs
  var conts           = [];
  var rex_return_code = new RegExp("\r", "g");
  for (var i = 0; i < tfs.length; i++) {
    conts.push(tfs[i].tf.contents.replace(
      rex_return_code, RETURN_CODE_ALT));
  }
  _replaceContents(tfs, et.split("\n---\n"), new RegExp(RETURN_CODE_ALT_FOR_REX, "g"));
  app.redraw();
}

function _checkDoc() {
  var errMsg,
      errCode;

  if (!__isDoc()) {
    // errCode = '0xfedcba';
    errMsg = 'Expected document and selected text frame[s]\n' +
      'Select text frames and push button "Refresh"';
    // alert(errMsg);
    // throw new Error(errCode);
    throw new Error(errMsg);
  }
  return true;
  function __isDoc() {
    return documents.length;
  }
}

function _checkTextFrames(tfs) {
  var errMsg,
      errCode;
  if (!__isTxtFrames(tfs)) {
    // errCode = '0xabcdef';
    errMsg = 'Expected selected text frame[s]\n' +
      'Select text frames and push button "Refresh"';
    // alert(errMsg);
    // throw new Error(errCode);
    throw new Error(errMsg);
  }
  return true;
  function __isTxtFrames(tfs /*@param {Array} tfs - selected text frames*/) {
    return tfs.length;
  }
}

function _replaceContents(tfs, et_texts, rex_return_code_alt) {
  while (et_texts[et_texts.length - 1] == "") et_texts.pop();

  for (var i = 0; i < tfs.length; i++) {
    if (i >= et_texts.length) break;

    tfs[i].tf.contents = et_texts[i].replace(rex_return_code_alt, "\r");
  }
}

function _extractTextFramesAsVTextFrameItem(s, r) {
  // s is an array of pageitems ( ex. selection )
  for (var i = 0; i < s.length; i++) {
    if (s[i].typename == "TextFrame") {
      r.push(new _vTextFrameItem(s[i]));
    } else if (s[i].typename == "GroupItem") {
      _extractTextFramesAsVTextFrameItem(s[i].pageItems, r);
    }
  }
}

function _sortVTextFramesReasonableByPosition(tfs) {
  var rect = [];
  // reft, top, right, bottom
  _getVTextFramesRect(tfs, rect);

  if (rect[1] - rect[3] < rect[2] - rect[0]) { // height < width
    // left -> right || top -> bottom
    tfs.sort(function(a, b) {
      return a.left == b.left
        ? b.top - a.top
        : a.left - b.left
    });
  } else {
    // top -> down || left -> right
    tfs.sort(function(a, b) {
      return a.top == b.top
        ? a.left - b.left
        : b.top - a.top
    });
  }
}

function _vTextFrameItem(tf) {
  // virtual textframe for comparing the each position
  this.tf = tf;
  if (tf.kind == TextType.POINTTEXT) {
    this.left = tf.left;
    this.top  = tf.top;
  } else {
    var tp    = tf.textPath;
    this.left = tp.left;
    this.top  = tp.top;
  }
}

function _getVTextFramesRect(tfs, rect) {
  // get the rect that includes each top-left corner of tfs
  var top, left;

  for (var i = 0; i < tfs.length; i++) {
    top  = tfs[i].top;
    left = tfs[i].left;

    if (i == 0) {
      // reft, top, right, bottom
      rect.push(left);
      rect.push(top);
      rect.push(left);
      rect.push(top);
    } else {
      rect[0] = Math.min(rect[0], left);
      rect[1] = Math.max(rect[1], top);
      rect[2] = Math.max(rect[2], left);
      rect[3] = Math.min(rect[3], top);
    }
  }
}