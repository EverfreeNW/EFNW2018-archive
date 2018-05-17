(function () {

    var START_TIME = 9;
    var DAY_LENGTH = 17;
    var MARGIN = 0.5 * 72;
    var HEADER = 0.5 * 72;
    var FOOTER = 0.25 * 72;
    var CELL_WIDTH = 7.5 * 72 / 4;
    var CELL_HEIGHT = 9.25 * 72 / (DAY_LENGTH * 2 + 1);

    function renderDoc(myEvents) {
        for (var i = 0; i < myEvents.length; i++) {
            var d = scheduleRenderer.parseDate(myEvents[i].start_time);
            myEvents[i].absStartTime = d.day * 24 * 60 + d.hour * 60 + d.minute;
        }
        myEvents.sort(function (a, b) {
            return a.absStartTime - b.absStartTime;
        });

        var doc = new jsPDF('portrait', 'pt', 'letter');
        doc.setFontSize(32);
        doc.text('My Schedule', MARGIN, MARGIN + 32);

        doc.setFontSize(12);
        doc.text('Generated ' + scheduleRenderer.formatDate(new Date()), MARGIN, 11 * 72 - MARGIN);

        doc.setDrawColor(0x99, 0x99, 0x99);
        doc.rect(MARGIN, MARGIN + HEADER, (3 + 1) * CELL_WIDTH, (DAY_LENGTH * 2 + 1) * CELL_HEIGHT, 'S');

        /*
         for (var i = 0; i < DAY_LENGTH * 2; i++) {
         var y = MARGIN + HEADER + (i + 1) * CELL_HEIGHT;
         var w = (3 + 1) * CELL_WIDTH;
         doc.lines([[w, 0]], MARGIN, y);
         }*/
        doc.setFillColor(0xf0, 0xf0, 0xf0);
        for (var i = 0; i < DAY_LENGTH * 2; i+=2) {
            var y = MARGIN + HEADER + (i + 1) * CELL_HEIGHT;
            var w = (3 + 1) * CELL_WIDTH;
            doc.rect(MARGIN, y, w, CELL_HEIGHT, 'F');
        }

        var dayNames = ['Friday', 'Saturday', 'Sunday'];
        for (var i = 0; i < dayNames.length; i++) {
            var x = MARGIN + (i + 1) * CELL_WIDTH;
            var h = (DAY_LENGTH * 2 + 1) * CELL_HEIGHT;
            doc.lines([[0, h]], x, MARGIN + HEADER);
        }

        doc.setFontSize(8);
        for (var i = 0; i < dayNames.length; i++) {
            doc.text(dayNames[i], MARGIN + (i + 1) * CELL_WIDTH + 1, MARGIN + HEADER + 9);
        }

        doc.setFontSize(8);
        for (var i = 0; i < DAY_LENGTH * 2; i++) {
            doc.text(scheduleRenderer.formatTime({
                hour: (START_TIME + Math.floor(i / 2)) % 24,
                minute: (i % 2) * 30
            }), MARGIN + 1, MARGIN + HEADER + (i + 1) * CELL_HEIGHT + 9);
        }

        doc.setFontSize(8);
        var processedEvents = [];
        for (var i = 0; i < myEvents.length; i++) {
            if (jQuery.inArray(myEvents[i], processedEvents) >= 0) { continue; }
            var column = scheduleRenderer.dateToConDay(scheduleRenderer.parseDate(myEvents[i].start_time));
            if (column < 0 || column > 2) {continue;}
            var eventsBlock = [myEvents[i]];
            var updated = 1;
            while (updated) {
                updated = 0;
                var start_time = scheduleRenderer.parseDate(eventsBlock[0].start_time);
                var end_time = scheduleRenderer.parseDate(eventsBlock[0].end_time);
                for (var j = 1; j < eventsBlock.length; j++) {
                    var st = scheduleRenderer.parseDate(eventsBlock[j].start_time);
                    var et = scheduleRenderer.parseDate(eventsBlock[j].end_time);
                    if (scheduleRenderer.dateDelta(start_time, st) > 0) {start_time = st;}
                    if (scheduleRenderer.dateDelta(end_time, et) < 0) {end_time = et;}
                }
                for (var j = 0; j < myEvents.length; j++) {
                    if (jQuery.inArray(myEvents[j], processedEvents) >= 0) { continue; }
                    if (jQuery.inArray(myEvents[j], eventsBlock) >= 0){ continue; }
                    var st = scheduleRenderer.parseDate(myEvents[j].start_time);
                    var et = scheduleRenderer.parseDate(myEvents[j].end_time);
                    if ((scheduleRenderer.dateDelta(st, start_time) >= 0 && scheduleRenderer.dateDelta(st, end_time) < 0)
                        || (scheduleRenderer.dateDelta(st, start_time) < 0 && scheduleRenderer.dateDelta(et, start_time) > 0)) {
                        eventsBlock.push(myEvents[j]);
                        updated = 1;
                    }
                }
            }

            for (var j = 0; j < eventsBlock.length; j++) {
                var event = eventsBlock[j];
                var start_time = scheduleRenderer.parseDate(event.start_time);
                var end_time = scheduleRenderer.parseDate(event.end_time);
                var room_name = event['room_name'];
                var room_index = scheduleRenderer.ROOMS.indexOf(room_name);
                if (room_index != -1) {
                    room_name = scheduleRenderer.ROOM_NAMES[room_index];
                } else {
                    room_name = 'Other';
                    room_index = scheduleRenderer.ROOM_NAMES.length-1;
                }

                if (end_time.hour >= 2 && (start_time.hour < 2 || start_time.hour > end_time.hour)) {
                    end_time.hour = 2;
                    end_time.minute = 0;
                    end_time.second = 0;
                }

                var height = Math.floor(scheduleRenderer.dateDelta(end_time, start_time) / 1000.0 / 60.0 / 30.0 * CELL_HEIGHT) - 2;
                var width = CELL_WIDTH/eventsBlock.length - 2;
                var x = MARGIN + CELL_WIDTH + j*CELL_WIDTH/eventsBlock.length + column * CELL_WIDTH + 1;
                var start_hour = start_time.hour;
                if (start_hour < 2) {
                    start_hour += 24;
                }
                if (start_hour == 2) {
                    continue;
                }

                var y = MARGIN + HEADER + CELL_HEIGHT + Math.floor(((start_hour - START_TIME) * 60 + start_time.minute) / 30.0 * CELL_HEIGHT) + 1;
                var titleText = scheduleRenderer.wrapToFit(doc, 12, event['title'] + "\n" + room_name, width-2, height-2);
                //title = // doc.splitTextToSize(title, width-2); //wrapTitle(title, 40 / eventsBlock.length);
                //title = title.concat(doc.splitTextToSize(room_name, width-2)); //wrapTitle(room_name, 40 / eventsBlock.length));

                var color_index = scheduleRenderer.TRACKS.indexOf(event.track);

                doc.setDrawColor.apply(doc, scheduleRenderer.asColor(scheduleRenderer.BORDER_COLORS[color_index]));
                doc.setFillColor.apply(doc, scheduleRenderer.asColor(scheduleRenderer.COLORS[color_index]));
                doc.roundedRect(x, y, width, height, 5, 5, 'DF');
                doc.text(titleText.lines, x + 1, y + titleText.fontSize + 1);

                processedEvents.push(event);
            }
        }

        scheduleRenderer.appendDescriptions(doc, myEvents);

        return doc;
    }

    window.renderMySchedulePdf = function(myEvents) {
        var doc = renderDoc(myEvents);
        doc.save('my_schedule.pdf');
    }

})();
