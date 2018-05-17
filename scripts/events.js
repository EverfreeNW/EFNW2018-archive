var EVENTS;
jQuery.getJSON( "/events.json", function( data ) {
  EVENTS = data;
  initEventsCal();
  initMySchedule();
});
function customHyphen(s) {
  return s.replace('Parasprite', 'Para\u00ADsprite').replace('Seashell','Sea\u00ADshell').replace('MLP:CCG','MLP:\u200BCCG');
}
function formatTime(d) {
  var h = d.hour;
  var m = d.minute;
  var suffix = (h >= 12 ? 'PM' : 'AM');
  if (h == 0) { h = 12; }
  if (h > 12) { h -= 12; }
  if (h < 10) {h = '0' + h;}
  if (m < 10) {m = '0' + m;}
  return h + ':' + m + ' ' + suffix;
}
function parseDate(d) {
  var regex = /^([0-9]+)-([0-9]+)-([0-9]+)T([0-9]+):([0-9]+):([0-9]+)$/;
  var match = regex.exec(d);
  if (match == null) {throw new Exception("Could not parse date " + d);}
  return {
    year: parseInt(match[1]),
    month: parseInt(match[2]),
    day: parseInt(match[3]),
    hour: parseInt(match[4]),
    minute: parseInt(match[5]),
    second: parseInt(match[6])
  }
}
function cloneDate(d) {
  return {
    year: d.year,
    month: d.month,
    day: d.day,
    hour: d.hour,
    minute: d.minute,
    second: d.second
  };
}
function dateToConDay(d) {
  var conDay = d.day - 12;
  if (d.hour <= 2) { conDay -= 1; }
  return conDay;
}
function dateDelta(a, b) {
  return Date.UTC(a.year, a.month, a.day, a.hour, a.minute, a.second) - Date.UTC(b.year, b.month, b.day, b.hour, b.minute, b.second);
}
var ROOMS = ['Mane Stage', "Foal's", 'Arts & Crafts', 'Celestia', 'Luna', 'Cadance', "Twilight's Writing Room", 'Tabletop Gaming', 'Electronic Gaming', 'CCG', 'Cosplay Repair', "Special Events 1"];
var ROOM_NAMES = [ 'Mane Stage', "Foal's Room", 'Arts & Crafts', 'Celestia Room', 'Luna Room', 'Cadance Room', "Twilight's Writing Room", 'Tabletop Gaming', 'Elec. Gaming', 'CCG Room', 'Cosplay Repair', "Maxi's (Special Events)" ];

var TRACKS = ['General', 'Foals Exclusive (Kids Event)', 'Arts & Crafts', 'Friendship & Community', 'Cosplay', 'Music', 'Writing', 'Tabletop Gaming', 'Electronic Gaming', 'Card Gaming', 'Special'];

var COLORS = [ 'ff93cb', 'ffcee5', 'ffa873', 'ffe599', 'd1e4b3', 'b3e4c1', 'b3e1e4', 'a1c0ee', 'c5b7e4', 'e7a3f1', 'A6D7F7', 'B6CCD6', 'E1F7DA', 'F5C9D4', 'ff93cb' ];
var BORDER_COLORS = [ 'd75b9b', 'db85ac', 'd07f4e', 'd4b862', 'a5c96b', '75c48b', '5bb9bf', '6d99dc', '9576dc', 'c35ed2', '6CB2E0', 'A3B8C2', 'ACD69F', 'EBA7B8', 'd75b9b'];

var START_TIME = 9;
var DAY_LENGTH = 18;
var CELL_WIDTH = 85;
var CELL_HEIGHT = 24;
var HEADER_ROW_HEIGHT = 54;
function initTrackLegend() {
  legend = jQuery('#track-key');
  for (var i = 0; i < TRACKS.length; i++) {
    var item = document.createElement('li');
    var c = document.createElement('div');
    c.className = 'legend-color';
    c.style.cssText = 'background-color:#' + COLORS[i] + ';'
            + 'border-color:#' + BORDER_COLORS[i] + ';';
    item.appendChild(c);
    item.appendChild(document.createTextNode(TRACKS[i]));
    legend.append(item);
  }
}

function initEventsCal() {
  initTrackLegend();
  ['cal-fri', 'cal-sat', 'cal-sun'].forEach(function(id) {
    var row = document.createElement('div');
    row.className = 'cal-row';
    var cell = document.createElement('div');
    cell.className = 'cell left-cell top-cell';
    row.appendChild(cell);
    for (var i = 0; i < ROOM_NAMES.length; i++) {
      var cell = document.createElement('div');
      cell.style.left = ((i+1)*(CELL_WIDTH+1)+1) + 'px';
      cell.style.top =  '0px';
      cell.className = 'cell top-cell roomHeader';
      cell.innerHTML = ROOM_NAMES[i];
      row.appendChild(cell);
    }
    document.getElementById(id).appendChild(row);
    for (var i = 0; i < DAY_LENGTH * 2; i++) {
      var row = document.createElement('div');
      row.className = 'cal-row';
      var timeCell = document.createElement('div');
      timeCell.style.left = '0px';
      timeCell.style.top =  (HEADER_ROW_HEIGHT+i*(CELL_HEIGHT+1)+1) + 'px';
      timeCell.className = 'cell left-cell ' + (i%2==0 ? 'even-cell' : 'odd-cell');
      if (i == DAY_LENGTH*2-1) {timeCell.className += ' bottom-cell';}
      timeCell.innerHTML = formatTime({hour: Math.floor(START_TIME+i/2) % 24, minute: i%2 == 0 ? 0 : 30});
      row.appendChild(timeCell);
      for (var j = 0; j < ROOM_NAMES.length; j++) {
        var cell = document.createElement('div');
        cell.style.left = ((j+1)*(CELL_WIDTH+1)+1) + 'px';
        cell.style.top = timeCell.style.top;
        cell.className = 'cell ' + (i%2==0 ? 'even-cell' : 'odd-cell');
        if (i == DAY_LENGTH*2-1) {cell.className += ' bottom-cell';}
        row.appendChild(cell);
      }
      document.getElementById(id).appendChild(row);
    }
    document.getElementById(id).style.width = ((ROOM_NAMES.length+1) * (CELL_WIDTH+1) + 2) + 'px';
    document.getElementById(id).style.height = (HEADER_ROW_HEIGHT + (DAY_LENGTH*2) * (CELL_HEIGHT+1) + 2) + 'px';
  });
  for (var i = 0; i < EVENTS.length; i++) {
    var d = parseDate(EVENTS[i].start_time);
    EVENTS[i].absStartTime = d.day*24*60 + d.hour*60 + d.minute;
    d = parseDate(EVENTS[i].end_time);
    EVENTS[i].absEndTime = d.day*24*60 + d.hour*60 + d.minute;
  }
  EVENTS.sort(function(a, b) {
    return a.absStartTime - b.absStartTime;
  });
  for (var i = 0; i < EVENTS.length; i++) {
    var event = EVENTS[i];
    var room_name = event['room_name'];
    var width = 1;
    var column = ROOMS.indexOf(room_name);
    if (column < 0) {
      if (event.absEndTime - event.absStartTime >= 240) { continue; }
      column = ROOM_NAMES.length-1;
    }
    var start_time = parseDate(event['start_time']);
    var end_time = parseDate(event['end_time']);
    var parentId = null;
    var conDay = dateToConDay(start_time);
    if (conDay == 0) {parentId = 'cal-fri'};
    if (conDay == 1) {parentId = 'cal-sat'};
    if (conDay == 2) {parentId = 'cal-sun'};
    if (parentId == null) {continue;}

    var display_end_time = cloneDate(end_time);
    var display_start_time = cloneDate(start_time);
    var late_night = false;
    var early_morning = false;
    if ((display_start_time.hour > display_end_time.hour || display_start_time.hour < 3) && display_end_time.hour > 3) { display_end_time.hour = 3; display_end_time.minute = 0; display_end_time.second = 0; early_morning = false; late_night = true; }
    if (display_start_time.hour > 3 && display_start_time.hour < 9) { display_start_time.hour = 9; display_start_time.minute = 0; display_start_time.second = 0; early_morning = true; late_night = false; }

    var height = Math.floor( dateDelta(display_end_time, display_start_time)/1000.0/60.0/30.0 * (CELL_HEIGHT +1)) - 12;
    width = width * (CELL_WIDTH+1) - 13;
    var x = (CELL_WIDTH + 1) + column * (CELL_WIDTH+1) + 1;
    var start_hour = display_start_time.hour;
    if (start_hour <= 2) { start_hour += 24; }
    var y = HEADER_ROW_HEIGHT + Math.floor( ((start_hour-START_TIME)*60 + display_start_time.minute)/30.0 * (CELL_HEIGHT+1) ) + 1;
    var title = event['title'];
    var clean_title = title.replace(/<[^>]*>/g, '');
    if (height < 20 && clean_title.length > 20) { title = clean_title.substring(0, 17) + '...'; }
    else if (clean_title.length > 30) {title = clean_title.substring(0, 27) + '...';}
    if (event['ticket_purchase_required']) { title = "<img class='event-icon' src='/images/TicketIcon.svg'> " + title; }
    if (event['foal_recommended']) { title = "<img class='event-icon' src='/images/FoalFriendlyIcon.svg'>" + title; }
    if (late_night) { title = "<img style='float:right;width:2em;margin: 0 0 2px 2px' src='/images/DownArrowIcon.svg'>" + title; }
    if (early_morning) { title = "<img style='float:right;width:2em;margin: 0 0 2px 2px' src='/images/UpArrowIcon.svg'>" + title; }

    var colorIndex = (event.track == null ? COLORS.length-1 : TRACKS.indexOf(event.track));

    var style = 'left:' + x + 'px;';
    style += 'top:' + y + 'px;';
    style += 'height:' + height + 'px;';
    style += 'width:' + width + 'px;';
    style += 'background:#' + COLORS[colorIndex] + ';';
    style += 'border-color:#' + BORDER_COLORS[colorIndex] + ';';
    var eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.style.cssText = style;
    eventDiv.innerHTML = "<div>" + customHyphen(title) + "</div>";
    jQuery(eventDiv.children[0]).hyphenate('en-us');
    document.getElementById(parentId).appendChild(eventDiv);
    var descDiv = document.createElement('div');
    descDiv.innerHTML = '<i class="closeEvent"></i><div class="title">'
      + event['title'] + '</div><div class="time"><i class="icon-clock"></i> '
      + "Time: " + formatTime(start_time) + '-' + formatTime(end_time) + '</div><br/>'
      + event['description']
      + (event['ticket_purchase_required'] ? "<br/><br/><img style='float:left;width:2em;margin: 0 2px 2px 0' src='/images/TicketIcon.svg'> A <a href='/registration/tickets'>ticket purchase</a> is required to attend this exclusive event!</a>" : '' )
      + (event['foal_recommended'] ? "<br/><br/><img style='float:left;width:2em;margin: 0 2px 2px 0' src='/images/FoalFriendlyIcon.svg'> Everfree Northwest recommends this event for foals!<br/>" : '' )
      + "<br/><br/>";
    var aMySched = document.createElement('a');
    aMySched.href='#';
    aMySched.className = 'addto';
    aMySched.innerHTML = 'Add to my schedule';
    (function (event) {jQuery(aMySched).click(function() {
      if (jQuery.inArray(event, myEvents) < 0) {
        myEvents.push(event);
        redrawMySched();
      }
      jQuery(this.parentNode).click();
      return false;
    });})(event);
    descDiv.appendChild(aMySched);
    descDiv.className = 'eventDesc';
    (function(descDiv) {
      jQuery(eventDiv).click(function(e) {
        if (getSelection().toString()) { return false; }
        jQuery('.eventDesc').hide();
        jQuery(descDiv).show();
        var rect = e.target.getBoundingClientRect();
        var targetCal = jQuery(e.target).closest(".calendar");
        var calOffset = targetCal.offset();
        var offsetX = e.pageX - calOffset.left;
        var offsetY = e.pageY - calOffset.top;
        offsetX = Math.min(offsetX, targetCal.width() - 300);
        offsetY = Math.min(offsetY, targetCal.height() - descDiv.getBoundingClientRect().height);
        descDiv.style.left = offsetX + 'px';
        descDiv.style.top = offsetY + 'px';
      });
      jQuery(descDiv).click(function() {
        if (getSelection().toString()) { return false; }
        jQuery(descDiv).hide();
      });
    })(descDiv);
    document.getElementById(parentId).appendChild(descDiv);
  }
  jQuery('#tab-fri').click(function() {
    jQuery('#cal-sat').hide(); jQuery('#tab-sat').removeClass('selected');
    jQuery('#cal-sun').hide(); jQuery('#tab-sun').removeClass('selected');
    jQuery('#cal-fri').show(); jQuery('#tab-fri').addClass('selected');
  });
  jQuery('#tab-sat').click(function() {
    jQuery('#cal-fri').hide(); jQuery('#tab-fri').removeClass('selected');
    jQuery('#cal-sun').hide(); jQuery('#tab-sun').removeClass('selected');
    jQuery('#cal-sat').show(); jQuery('#tab-sat').addClass('selected');
  });
  jQuery('#tab-sun').click(function() {
    jQuery('#cal-fri').hide(); jQuery('#tab-fri').removeClass('selected');
    jQuery('#cal-sat').hide(); jQuery('#tab-sat').removeClass('selected');
    jQuery('#cal-sun').show(); jQuery('#tab-sun').addClass('selected');
  });
}
function initMySchedule() {
  var DAYS = ['Friday', 'Saturday', 'Sunday'];
  var row = document.createElement('div');
  row.className = 'cal-row';
  var cell = document.createElement('div');
  cell.className = 'cell left-cell top-cell';
  row.appendChild(cell);
  for (var i = 0; i < DAYS.length; i++) {
    var cell = document.createElement('div');
    cell.style.left = ((i+1)*(CELL_WIDTH+1)+1) + 'px';
    cell.style.top =  '0px';
    cell.className = 'cell top-cell roomHeader';
    cell.innerHTML = DAYS[i];
    row.appendChild(cell);
  }
  document.getElementById('mysched').appendChild(row);
  for (var i = 0; i < DAY_LENGTH * 2; i++) {
    var row = document.createElement('div');
    row.className = 'cal-row';
    var timeCell = document.createElement('div');
    timeCell.style.left = '0px';
    timeCell.style.top =  (HEADER_ROW_HEIGHT+i*(CELL_HEIGHT+1)+1) + 'px';
    timeCell.className = 'cell left-cell ' + (i%2==0 ? 'even-cell' : 'odd-cell');
    if (i == DAY_LENGTH*2-1) {timeCell.className += ' bottom-cell';}
    timeCell.innerHTML = formatTime({hour: Math.floor(START_TIME+i/2) % 24, minute: i%2 == 0 ? 0 : 30});
    row.appendChild(timeCell);
    for (var j = 0; j < DAYS.length; j++) {
      var cell = document.createElement('div');
      cell.style.left = ((j+1)*(CELL_WIDTH+1)+1) + 'px';
      cell.style.top = timeCell.style.top;
      cell.className = 'cell ' + (i%2==0 ? 'even-cell' : 'odd-cell');
      if (i == DAY_LENGTH*2-1) {cell.className += ' bottom-cell';}
      row.appendChild(cell);
    }
    document.getElementById('mysched').appendChild(row);
  }
  document.getElementById('mysched').style.width = ((DAYS.length+1) * (CELL_WIDTH+1) + 2) + 'px';
  document.getElementById('mysched').style.height = ((DAY_LENGTH*2+1) * (CELL_HEIGHT+1) + 2) + 'px';
  var ids = jQuery.cookie('EFNW_MS16');
  if (ids) {
    ids = ids.split(/,/);
    for (var i = 0; i < EVENTS.length; i++) {
      if (jQuery.inArray(''+EVENTS[i].id, ids) >= 0) {myEvents.push(EVENTS[i]);}
    }
    redrawMySched();
  }
}
var myEvents = [];
function redrawMySched() {
  var ids = [];
  for (var i = 0; i < myEvents.length; i++) {ids.push(myEvents[i].id);}
  jQuery.cookie('EFNW_MS16', ids.join(','), {expires: 365});
  jQuery('#mysched div.event').remove();
  var processedEvents = [];
  for (var i = 0; i < myEvents.length; i++) {
    if (jQuery.inArray(myEvents[i], processedEvents) >= 0) { continue; }
    var column = dateToConDay(parseDate(myEvents[i].start_time));
    if (column < 0 || column > 2) {continue;}
    var eventsBlock = [myEvents[i]];
    var updated = 1;
    while (updated) {
      updated = 0;
      var start_time = parseDate(eventsBlock[0].start_time);
      var end_time = parseDate(eventsBlock[0].end_time);
      for (var j = 1; j < eventsBlock.length; j++) {
        var st = parseDate(eventsBlock[j].start_time);
        var et = parseDate(eventsBlock[j].end_time);
        if (dateDelta(start_time, st) > 0) {start_time = st;}
        if (dateDelta(end_time, et) < 0) {end_time = et;}
      }
      for (var j = 0; j < myEvents.length; j++) {
        if (jQuery.inArray(myEvents[j], processedEvents) >= 0) { continue; }
        if (jQuery.inArray(myEvents[j], eventsBlock) >= 0){ continue; }
        var st = parseDate(myEvents[j].start_time);
        var et = parseDate(myEvents[j].end_time);
        if ((dateDelta(st, start_time) >= 0 && dateDelta(st, end_time) < 0)
            || (dateDelta(st, start_time) < 0 && dateDelta(et, start_time) > 0)) {
            eventsBlock.push(myEvents[j]);
            updated = 1;
        }
      }
    }
    for (var j = 0; j < eventsBlock.length; j++) {
      var event = eventsBlock[j];
      var start_time = parseDate(event.start_time);
      var end_time = parseDate(event.end_time);
      var room_name = event['room_name'];
      var room_index = ROOMS.indexOf(room_name);
      if (room_index != -1) {
        room_name = ROOM_NAMES[room_index];
      } else {
        room_name = 'Other';
        room_index = ROOM_NAMES.length-1;
      }
      var display_end_time = cloneDate(end_time);
      var display_start_time = cloneDate(start_time);
      if ((display_start_time.hour > display_end_time.hour || display_start_time.hour < 3) && display_end_time.hour > 3) { display_end_time.hour = 3; display_end_time.minute = 0; display_end_time.second = 0; }
      if (display_start_time.hour > 3 && display_start_time.hour < 9) { display_start_time.hour = 9; display_start_time.minute = 0; display_start_time.second = 0; }

      var height = Math.floor( dateDelta(display_end_time, display_start_time)/1000.0/60.0/30.0 * (CELL_HEIGHT +1)) - 12;
      var width = CELL_WIDTH/eventsBlock.length - 12;
      var x = CELL_WIDTH + j*CELL_WIDTH/eventsBlock.length + column * (CELL_WIDTH+1) + 2;
      var start_hour = display_start_time.hour;
      if (start_hour <= 2) { start_hour += 24; }
      var y = HEADER_ROW_HEIGHT + Math.floor( ((start_hour-START_TIME)*60 + display_start_time.minute)/30.0 * (CELL_HEIGHT+1) ) + 1;
      var title = event['title'];
      var clean_title = title.replace(/<[^>]*>/g, '');
      if (height < 20 && clean_title.length > 20) { title = clean_title.substring(0, 17) + '...'; }
      else if (clean_title.length > 30) {title = clean_title.substring(0, 27) + '...';}
      if (event['ticket_purchase_required']) { title = "<img class='event-icon' src='/images/TicketIcon.svg'> " + title; }
      if (event['foal_recommended']) { title = "<img class='event-icon' src='/images/FoalFriendlyIcon.svg'>" + title; }

      var colorIndex = (event.track == null ? COLORS.length-1 : TRACKS.indexOf(event.track));

      var style = 'left:' + x + 'px;';
      style += 'top:' + y + 'px;';
      style += 'height:' + height + 'px;';
      style += 'width:' + width + 'px;';
      style += 'background:#' + COLORS[colorIndex] + ';';
      style += 'border-color:#' + BORDER_COLORS[colorIndex] + ';';
      var eventDiv = document.createElement('div');
      eventDiv.className = 'event';
      eventDiv.style.cssText = style;
      eventDiv.innerHTML = "<div>" + customHyphen(title) + "</div>";
      jQuery(eventDiv.children[0]).hyphenate('en-us');
      document.getElementById('mysched').appendChild(eventDiv);
      var descDiv = document.createElement('div');
      descDiv.innerHTML = '<i class="closeEvent"></i><div class="title">'
        + event['title'] + '</div><div class="time"><i class="icon-clock"></i> '
        + "Time: " + formatTime(start_time) + '-' + formatTime(end_time) + '</i></div><div class="room"><i class="icon-map"></i> '
        + "Room: " + room_name + '<br/><br/><div class="desc">'
        + event['description']
        + (event['ticket_purchase_required'] ? "<br/><br/><img style='float:left;width:2em;margin: 0 2px 2px 0' src='/images/TicketIcon.svg'> A <a href='/registration/tickets'>ticket purchase</a> is required to attend this exclusive event!</a>" : '' )
        + (event['foal_recommended'] ? "<br/><br/><img style='float:left;width:2em;margin: 0 2px 2px 0' src='/images/FoalFriendlyIcon.svg'> Everfree Northwest recommends this as a foal-friendly event!" : '' )
        + "</div><br/><br/>";
      var aMySched = document.createElement('a');
      aMySched.href='#';
      aMySched.className = 'addto';
      aMySched.innerHTML = 'Remove from my schedule';
      (function (event) {jQuery(aMySched).click(function() {
        var index = jQuery.inArray(event, myEvents);
        if (index >= 0) {myEvents.splice(index, 1);}
        redrawMySched();
        jQuery(this.parentNode).click();
        return false;
      });})(event);
      descDiv.appendChild(aMySched);
      descDiv.className = 'eventDesc';
      (function(descDiv) {
        jQuery(eventDiv).click(function(e) {
          if (getSelection().toString()) { return false; }
          jQuery('.eventDesc').hide();
          jQuery(descDiv).show();
          var targetCal = jQuery(e.target).closest(".calendar");
          var calOffset = targetCal.offset();
          var offsetX = e.pageX - calOffset.left;
          var offsetY = e.pageY - calOffset.top;
          //offsetX = Math.min(offsetX, targetCal.width() - 300);
          offsetY = Math.min(offsetY, targetCal.height() - descDiv.getBoundingClientRect().height);
          descDiv.style.left = offsetX + 'px';
          descDiv.style.top = offsetY + 'px';
          });
        jQuery(descDiv).click(function() {
          if (getSelection().toString()) { return false; }
          jQuery(descDiv).hide();
        });
      })(descDiv);
      document.getElementById('mysched').appendChild(descDiv);
      processedEvents.push(event);
    }
  }
}
