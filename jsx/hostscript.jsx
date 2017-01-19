// main();
function main() {
  // - settings -------------
  // return code alternative character(s) used while editting
  var RETURN_CODE_ALT = "@/";

  // return code that used in regexp (escape the characters if it needs)
  var RETURN_CODE_ALT_FOR_REX = RETURN_CODE_ALT;

  // - settings end -------------
  // ----------------------------
  if (app.documents.length < 1) return;

  // get textframes in the selection
  var tfs = []; // textframes
  extractTextFramesAsVTextFrameItem(app.activeDocument.selection, tfs);
  if (tfs.length < 1) {
    alert("Please select textframes");
    return;
  }

  // sort tfs
  sortVTextFramesReasonableByPosition(tfs);

  // get the contents of tfs
  var conts           = [];
  var rex_return_code = new RegExp("\r", "g");
  for (var i = 0; i < tfs.length; i++) {
    conts.push(tfs[i].tf.contents.replace(
      rex_return_code, RETURN_CODE_ALT));
  }

  return conts.join("\n");

  // --------------------------------------------------
  function vTextFrameItem(tf) {
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

  // --------------------------------------------------
  function replaceContents(tfs, et_texts, rex_return_code_alt) {
    while (et_texts[et_texts.length - 1] == "") et_texts.pop();

    for (var i = 0; i < tfs.length; i++) {
      if (i >= et_texts.length) break;

      tfs[i].tf.contents
        = et_texts[i].replace(rex_return_code_alt, "\r");
    }
  }

  // --------------------------------------------------
  function sortVTextFramesReasonableByPosition(tfs) {
    var rect = [];
    // reft, top, right, bottom
    getVTextFramesRect(tfs, rect);

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

  // --------------------------------------------------
  function getVTextFramesRect(tfs, rect) {
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

  // --------------------------------------------------
  function extractTextFramesAsVTextFrameItem(s, r) {
    // s is an array of pageitems ( ex. selection )
    for (var i = 0; i < s.length; i++) {
      if (s[i].typename == "TextFrame") {
        r.push(new vTextFrameItem(s[i]));
      } else if (s[i].typename == "GroupItem") {
        extractTextFramesAsVTextFrameItem(s[i].pageItems, r);
      }
    }
  }
}

function repl(et) {
  // - settings -------------
  // return code alternative character(s) used while editting
  var RETURN_CODE_ALT = "@/";

  // return code that used in regexp (escape the characters if it needs)
  var RETURN_CODE_ALT_FOR_REX = RETURN_CODE_ALT;

  // - settings end -------------
  // ----------------------------
  if (app.documents.length < 1) return;

  // get textframes in the selection
  var tfs = []; // textframes
  extractTextFramesAsVTextFrameItem(app.activeDocument.selection, tfs);
  if (tfs.length < 1) {
    alert("Please select textframes");
    return;
  }

  // sort tfs
  sortVTextFramesReasonableByPosition(tfs);

  // get the contents of tfs
  var conts           = [];
  var rex_return_code = new RegExp("\r", "g");
  for (var i = 0; i < tfs.length; i++) {
    conts.push(tfs[i].tf.contents.replace(
      rex_return_code, RETURN_CODE_ALT));
  }

  replaceContents(
    tfs,
    et.split("\n"),
    new RegExp(RETURN_CODE_ALT_FOR_REX, "g")
  );

  function replaceContents(tfs, et_texts, rex_return_code_alt) {
    while (et_texts[et_texts.length - 1] == "") et_texts.pop();

    for (var i = 0; i < tfs.length; i++) {
      if (i >= et_texts.length) break;

      tfs[i].tf.contents = et_texts[i].replace(rex_return_code_alt, "\r");
    }
  }

  // --------------------------------------------------
  function extractTextFramesAsVTextFrameItem(s, r) {
    // s is an array of pageitems ( ex. selection )
    for (var i = 0; i < s.length; i++) {
      if (s[i].typename == "TextFrame") {
        r.push(new vTextFrameItem(s[i]));
      } else if (s[i].typename == "GroupItem") {
        extractTextFramesAsVTextFrameItem(s[i].pageItems, r);
      }
    }
  }

  // --------------------------------------------------
  function sortVTextFramesReasonableByPosition(tfs) {
    var rect = [];
    // reft, top, right, bottom
    getVTextFramesRect(tfs, rect);

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

  // --------------------------------------------------
  function vTextFrameItem(tf) {
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

  // --------------------------------------------------
  function getVTextFramesRect(tfs, rect) {
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
}