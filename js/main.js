/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function() {
  'use strict';

  var csInterface = new CSInterface();
  init();

  function init() {

    themeManager.init();
    loadJSX("json2.js");

    $("#btn_send").click(function() {
      csInterface.evalScript('main()', function(result) {
         alert(result);
        csInterface.closeExtension();
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
    
