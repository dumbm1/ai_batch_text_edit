/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function() {
  'use strict';
  var csInterface = new CSInterface();
  themeManager.init();
  loadJSX("json2.js");
  init();

  function init() {
    var store   = new Store();
    var defOpts = store.getDef();

    var storeOpts = store.getStore(defOpts);

    if (!storeOpts.txt_font_size) {
      storeOpts = store.setStore(defOpts);
    }

      store.setFace(storeOpts);
      csInterface.evalScript('getContents()', function(result) {
        if (result.match('0xabcdef') || result.match('0xfedcba')) csInterface.closeExtension();

        $("#txt_fld").val(result);
      });

    $("#nmb_font_size").change(function() {
      $('#txt_fld').css("font-size", $(this).val() + "pt");

      if ($('#chk_save').is(':checked')) {
        store.setStore(store.getFace());
      }
    });

    $("#btn_replace").click(function() {
      var et = $("#txt_fld").val();

      csInterface.evalScript('replaceAll(' + JSON.stringify(et) + ')', function(result) {
        if ($('#chk_close').is(':checked')) {
          csInterface.closeExtension();
        }
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

    $("#chk_close").change(function() {
      if ($('#chk_save').is(':checked')) {
        var opts = store.getFace();
        store.setStore(opts);
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
        $('#txt_fld').css("font-size", opts.nmb_font_size + "pt");
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
    
