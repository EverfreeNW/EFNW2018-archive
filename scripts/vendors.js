function make_poly(txt_pos, pts) {
    return function(paper, id, x, y) {
      path = 'M' + x + ',' + y;
      for (var i = 0; i < pts.length; i++) {
        path += 'l' + pts[i][0] + ',' + pts[i][1];
      }
      var p = paper.path(path);
      var txt = paper.text(x+txt_pos[0],y+txt_pos[1], id).attr('font-size', '1px');

      return [p, txt];
    }
  }
  function make_rect(w,h) {
    return function(paper, id, x, y) {
      var rect = paper.rect(x, y, w, h);
      var txt = paper.text(x+w/2,y+h/2, id).attr('font-size', '1px');
      return [rect, txt];
    }
  }

  var TABLE_RECTS = {};

  function highlightRect(value) {
    for (var id in TABLE_RECTS) {
      TABLE_RECTS[id][0].attr('fill', '#007549');
    }
    if (value) {
      jQuery(TABLE_RECTS[value][0].node).attr('fill', '#0074a2').attr('class', 'vendor-table highlight');
      TABLE_RECTS[value][2]();
    }
  }
  function removeHighlight() {
    jQuery('#canvas .vendor-table.highlight').attr('fill', '#007549').attr('class', 'vendor-table');
  }

  jQuery(document).ready(function () {
    var searchOptions = [];
    for (var i = 0; i < VENDORS.length; i++) {
      searchOptions.push({value: VENDORS[i].table, text: VENDORS[i].name});
    }
    searchOptions.sort(function(a, b) {
      a = a.text.toLowerCase();
      b = b.text.toLowerCase();
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    });

    jQuery('#searchbox').selectize({
      openOnFocus: false,
      options: searchOptions,
      onChange: function(value) {
        highlightRect(value);
      }
    });
    return;
    var svg = jQuery('#canvas > svg');
    svg.removeAttr('width').removeAttr('height').css({width: '100%', height: '100%'});
    for (var i = 0; i < TABLES.length; i++) {
      var table = TABLES[i];

      rect.node.setAttribute('class', 'vendor-table');
      txt.node.setAttribute('class', 'tableText');


      (function(rect, txt) {
        txt.mouseover(function() {rect.attr('fill', '#4CAE4C');});
        txt.mouseout(function() {rect.attr('fill', '#007549');});
        rect.mouseover(function() {this.attr('fill', '#4CAE4C');});
        rect.mouseout(function() {this.attr('fill', '#007549');});
      })(rect, txt);

      var tableDesc = document.createElement('div');
      tableText = '';
      var first = true;
      for (var j = 0; j < VENDORS.length; j++) {
        var vendor = VENDORS[j];
        if (vendor.table == table.id) {
          var name = '<a class="vendorName" href="#' + vendor.id + '">' + vendor.name + '</a>';
          tableText += "<span style=\"float:right\">Table " + table.id + "</span>" + name + vendor.desc;
          break;
        }
      }
      if (tableText == '') { tableText = "This table's vendor information is coming soon!"; }
      tableDesc.innerHTML = tableText;
      tableDesc.className = 'tableDesc';

      var clickFn = (function(tableDesc, rect, txt) {
        var clickCallback = function(e) {
          jQuery('.tableDesc').hide();
          var txtOffset = jQuery(txt.node).offset();
          var canvasOffset = jQuery('#canvas').offset();
          var left = txtOffset.left - canvasOffset.left + jQuery(txt.node).width()/2;
          left = Math.min(left, jQuery('#canvas').width()-350);
          var top = txtOffset.top - canvasOffset.top + jQuery(txt.node).height()/2;
          tableDesc.style.left = left + 'px';
          tableDesc.style.top = top + 'px';
          jQuery(tableDesc).show();
        };
        var clickHandler = function(e) { removeHighlight(); clickCallback(e); };
        txt.click(clickHandler);
        rect.click(clickHandler);
        jQuery(tableDesc).click(function() {jQuery(tableDesc).hide();});
        return clickCallback;
      })(tableDesc, rect, txt);

      TABLE_RECTS[table.id] = [rect, txt, clickFn];
      document.getElementById('canvas').appendChild(tableDesc);
    }

    jQuery('.vendorbox .tableNum').each(function() {
      var txt = this.innerHTML;
      var a = txt.match(/Table ([0-9]+)/);
      if (!a) { return; }
      var tableId = parseInt(a[1]);
      jQuery(this).click(function() { highlightRect(tableId); jQuery('html,body').animate({ scrollTop: jQuery('#canvas').offset().top-150 }, 1000); });
    });
  });
