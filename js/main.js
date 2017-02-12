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
    if ($('#chk_show_hidden').is(':checked')) {
      editor.setShowInvisibles(true);
    } else {
      editor.setShowInvisibles(false);
    }
    editor.setShowPrintMargin(false);
    editor.setWrapBehavioursEnabled(true);
    editor.getSession().setUseWrapMode(true);
    editor.$blockScrolling = Infinity;

    csInterface.evalScript('getContents(' + JSON.stringify($('#txt_fr_sep').val()) + ')', function(result) {
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
      var et    = editor.getValue();
      var frSep = $('#txt_fr_sep').val();

      csInterface.evalScript('replaceAll(' + JSON.stringify(et) + ', ' + JSON.stringify(frSep) + ')', function(result) {
      });
    });

    $('#txt_fr_sep').keyup(function() {
      if ($('#chk_save').is(':checked')) {
        store.setStore(store.getFace());
      }
      csInterface.evalScript('getContents(' + JSON.stringify($('#txt_fr_sep').val()) + ')', function(result) {
        editor.setValue(result, 0);
      });
    })

    $("#chk_save").change(function() {
      if ($(this).is(':checked')) {
        var opts = store.getFace();
        store.setStore(opts);
      } else {
        store.setStore(defOpts);
      }
    });

    $("#chk_show_hidden").change(function() {
      if ($('#chk_save').is(':checked')) {
        store.setStore(store.getFace());
      }
      if ($(this).is(':checked')) {
        editor.setShowInvisibles(true);
      } else {
        editor.setShowInvisibles(false);
      }
    });

    $("#btn_refresh").click(reloadPanel);

    /*$("#btn_test").click(function() {
     localStorage.clear();
     });*/

    function Store() {

      this.getDef = function() {
        var opts = {
          txt_font_size:   12,
          nmb_font_size:   12,
          chk_show_hidden: false,
          chk_save:        false,
          txt_fr_sep:      "---"
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
        if (storeOpts.chk_show_hidden == 'true') {
          storeOpts.chk_show_hidden = true;
        } else if (storeOpts.chk_show_hidden == 'false') {
          storeOpts.chk_show_hidden = false;
        }
        return storeOpts;
      }

      this.getFace = function() {
        var opts = {
          txt_font_size:   $("#nmb_font_size").val(),
          nmb_font_size:   $("#nmb_font_size").val(),
          chk_show_hidden: $("#chk_show_hidden").is(':checked'),
          chk_save:        $("#chk_save").is(':checked'),
          txt_fr_sep:      $('#txt_fr_sep').val(),
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
        $("#chk_show_hidden").prop('checked', opts.chk_show_hidden);
        $("#chk_save").prop('checked', opts.chk_save);
        $('#txt_fr_sep').val(opts.txt_fr_sep);
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
    
