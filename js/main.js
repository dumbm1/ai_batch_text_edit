/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
  'use strict';
  var csInterface = new CSInterface();
  themeManager.init();
  loadJSX('json2.js');
  loadJSX('hostscript.jsx');

  init();

  function init() {
    (function () {
      $('#form_batch_text_edit').sisyphus({
                                            /*excludeFields: $("#fld_return"),
                                             timeout: 10*/
                                          });
    }());

    var editor = ace.edit('editor');
    editor.renderer.setOption('showLineNumbers', false);
    editor.renderer.setShowGutter(false);
    editor.renderer.setPadding(2);

    if ($('#chk_show_hidden').prop('checked')) {
      editor.setShowInvisibles(true);
    } else {
      editor.setShowInvisibles(false);
    }

    editor.setShowPrintMargin(false);
    editor.setWrapBehavioursEnabled(true);

    editor.getSession().setUseWrapMode(true);
    editor.getSession().setTabSize(0);

    editor.$blockScrolling = Infinity;

    $('#editor').css('font-size', $('#nmb_font_size').val() + 'pt');
    _getFramesContents();
    editor.focus();

    $('#nmb_font_size').change(function () {
      $('#editor').css('font-size', $(this).val() + 'pt');
      editor.focus();
    });

    $('#btn_replace').click(function () {
      var et = editor.getValue();
      var frSep = $('#txt_fr_sep').val();

      csInterface.evalScript('replaceAll(' + JSON.stringify(et) + ', ' + JSON.stringify(frSep) + ')', function (result) {
      });
    });

    $('#txt_fr_sep').keyup(function () {

      csInterface.evalScript('getContents(' + JSON.stringify($('#txt_fr_sep').val()) + ')', function (result) {
        editor.setValue(result, 0);
        editor.clearSelection();
      });
    });

    $('#chk_show_hidden').change(function () {
      if ($(this).is(':checked')) {
        editor.setShowInvisibles(true);
      } else {
        editor.setShowInvisibles(false);
      }
    });

    $('#btn_update').click(function () {
      if ($('#chk_confirm_update').is(':checked')) {
        if (confirm('Reload text from Illustrator Text Frame to Panel?')) {
          _getFramesContents();
          editor.focus();
        }
      } else {
        _getFramesContents();
        editor.focus();
      }
    });

    $('#btn_reload').click(function () {
      reloadPanel();
    });

    function _getFramesContents() {
      csInterface.evalScript('getContents(' + JSON.stringify($('#txt_fr_sep').val()) + ')', function (result) {
        editor.setValue('', 0);
        editor.setValue(result, 0);
        editor.clearSelection();
      });
    }
  }

  function loadJSX(fileName) {
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + '/jsx/';
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
  }

  // Reloads extension panel
  function reloadPanel() {
    location.reload();
  }

}());
    
