/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function() {
  'use strict';

  var csInterface = new CSInterface();
  init();

  function init() {

    themeManager.init();
    loadJSX("json2.js");

    var closeExt = false; // close after push ok button

    if (csInterface.isWindowVisible()) {
      csInterface.evalScript('getContents()', function(result) {
        if (result.match('0xabcdef') || result.match('0xfedcba')) csInterface.closeExtension();
        $("#txt_fld").val(result);
      });
    }

    $("#btn_replace").click(function() {
      var et = $("#txt_fld").val();
      csInterface.evalScript('replaceAll(' + JSON.stringify(et) + ')', function(result) {
        if (closeExt) {
          csInterface.closeExtension();
        }
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
    
