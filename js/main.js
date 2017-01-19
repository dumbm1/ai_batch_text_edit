/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function() {
  'use strict';

  var csInterface = new CSInterface();
  init();

  function init() {

    themeManager.init();
    loadJSX("json2.js");

    if (csInterface.isWindowVisible()) {
      csInterface.evalScript('main()', function(result) {
        $("#txt_fld").val(result);
      });
    }

    $("#btn_send").click(function() {
      // var et = $("#txt_fld").val();
      var et = document.getElementById('txt_fld').value;
      csInterface.evalScript('repl(' + JSON.stringify(et) + ')', function(result) {
        alert(result);
        // csInterface.closeExtension();
      });
    });

    $("#btn_refresh").click(reloadPanel);

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
    
