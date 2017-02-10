/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function() {
  'use strict';
  var csInterface = new CSInterface();
  themeManager.init();
  loadJSX("json2.js");
  loadJSX("hostscript.jsx");
  init();

  function init() {
    var store   = new Store();
    var defOpts = store.getDef();

    var storeOpts = store.getStore(defOpts);

    if (!storeOpts.txt_font_size) {
      storeOpts = store.setStore(defOpts);
    }

    store.setFace(storeOpts);


    var editor = ace.edit("editor");
    // editor.setTheme("ace/theme/monokai");
    // editor.getSession().setMode("ace/mode/text");
    editor.setShowInvisibles(true);
    editor.setShowPrintMargin(false);
    editor.setWrapBehavioursEnabled(true);
    editor.getSession().setUseWrapMode(true);

    editor.$blockScrolling = Infinity;

    csInterface.evalScript('getContents()', function(result) {

      editor.setValue(result, 0);
    });

    $("#nmb_font_size").change(function() {
      $('#editor').css("font-size", $(this).val() + "pt");
      editor.focus();

      if ($('#chk_save').is(':checked')) {
        store.setStore(store.getFace());
      }
    });

    $("#btn_replace").click(function() {
      var et = editor.getValue();

      csInterface.evalScript('replaceAll(' + JSON.stringify(et) + ')', function(result) {
      });
    });

    $("#chk_save").change(function() {
      if ($(this).is(':checked')) {
        var opts = store.getFace();
        store.setStore(opts);
      } else {
        store.setStore(defOpts);
      }
    });

    $("#btn_refresh").click(reloadPanel);

    /*$("#btn_test").click(function() {
     localStorage.clear();
     });*/

    function Store() {

      this.getDef = function() {
        var opts = {
          txt_font_size: 12,
          nmb_font_size: 12,
          chk_close:     false,
          chk_save:      false
        }
        return opts;
      }

      this.getStore = function(opts) {
        var storeOpts = {};
        for (var key in opts) {
          if (localStorage.getItem(key) === undefined) {
            return false;
          }
          storeOpts[key] = localStorage.getItem(key);
        }
        /**
         * !!! in the localStorage all values have a type String
         * */
        if (storeOpts.chk_save == 'true') {
          storeOpts.chk_save = true;
        } else if (storeOpts.chk_save == 'false') {
          storeOpts.chk_save = false;
        }
        if (storeOpts.chk_close == 'true') {
          storeOpts.chk_close = true;
        } else if (storeOpts.chk_close == 'false') {
          storeOpts.chk_close = false;
        }
        return storeOpts;
      }

      this.getFace = function() {
        var opts = {
          txt_font_size: $("#nmb_font_size").val(),
          nmb_font_size: $("#nmb_font_size").val(),
          chk_close:     $("#chk_close").is(':checked'),
          chk_save:      $("#chk_save").is(':checked')
        }
        return opts;
      }

      this.setStore = function(opts) {
        localStorage.clear();
        for (var key in opts) {
          localStorage.setItem(key, opts[key]);
        }
        return opts;
      }

      this.setFace = function(opts) {
        $('#editor').css("font-size", opts.nmb_font_size + "pt");
        $("#nmb_font_size").val(opts.nmb_font_size);
        $("#chk_close").prop('checked', opts.chk_close);
        $("#chk_save").prop('checked', opts.chk_save);
      }
    }
  }

  function loadJSX(fileName) {
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
  }

  // Reloads extension panel
  function reloadPanel() {
    location.reload();
  }

}());
    
