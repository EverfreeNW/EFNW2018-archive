(function () {

    var START_TIME = 9;
    var DAY_LENGTH = 17;
    var MARGIN = 0.5 * 72;
    var HEADER = 0.5 * 72;
    var FOOTER = 0.25 * 72;
    var CELL_WIDTH = 7.5 * 72 / (scheduleRenderer.ROOM_NAMES.length + 1);
    var CELL_HEIGHT = 9.25 * 72 / (DAY_LENGTH * 2 + 1);

    function renderDoc(EVENTS) {
        var doc = new jsPDF('portrait', 'pt', 'letter');
        doc.addPage();
        doc.addPage();

        var dayNames = ['Friday', 'Saturday', 'Sunday'];

        for (var day = 0; day < 3; day++) {
            doc.setPage(day + 1);
            doc.setFontSize(32);
            doc.text(dayNames[day], MARGIN, MARGIN + 32);
            doc.setFontSize(12);
            doc.text('Generated ' + scheduleRenderer.formatDate(new Date()), MARGIN, 11 * 72 - MARGIN);
            doc.setDrawColor(0x99, 0x99, 0x99);
            doc.rect(MARGIN, MARGIN + HEADER, (scheduleRenderer.ROOMS.length + 1) * CELL_WIDTH, (DAY_LENGTH * 2 + 1) * CELL_HEIGHT, 'S');

            /*
             for (var i = 0; i < DAY_LENGTH * 2; i++) {
             var y = MARGIN + HEADER + (i + 1) * CELL_HEIGHT;
             var w = (scheduleRenderer.ROOMS.length + 1) * CELL_WIDTH;
             doc.lines([[w, 0]], MARGIN, y);
             }*/
            doc.setFillColor(0xf0, 0xf0, 0xf0);
            for (var i = 0; i < DAY_LENGTH * 2; i+=2) {
                var y = MARGIN + HEADER + (i + 1) * CELL_HEIGHT;
                var w = (scheduleRenderer.ROOMS.length + 1) * CELL_WIDTH;
                doc.rect(MARGIN, y, w, CELL_HEIGHT, 'F');
            }

            for (var i = 0; i < scheduleRenderer.ROOMS.length; i++) {
                var x = MARGIN + (i + 1) * CELL_WIDTH;
                var h = (DAY_LENGTH * 2 + 1) * CELL_HEIGHT;
                doc.lines([[0, h]], x, MARGIN + HEADER);
            }

            doc.setFontSize(4);
            for (var i = 0; i < scheduleRenderer.ROOMS.length; i++) {
                var room_name = scheduleRenderer.ROOM_NAMES[i].replace(" (", "\n(");
                var room_name_text = scheduleRenderer.wrapToFit(doc, 10, room_name, CELL_WIDTH-2, CELL_HEIGHT-2);
                doc.text(room_name_text.lines, MARGIN + (i + 1) * CELL_WIDTH + 1, MARGIN + HEADER + room_name_text.fontSize + 1);
            }

            doc.setFontSize(8);
            for (var i = 0; i < DAY_LENGTH * 2; i++) {
                doc.text(scheduleRenderer.formatTime({
                    hour: (START_TIME + Math.floor(i / 2)) % 24,
                    minute: (i % 2) * 30
                }), MARGIN + 1, MARGIN + HEADER + (i + 1) * CELL_HEIGHT + 9);
            }
        }

        for (var i = 0; i < EVENTS.length; i++) {
            var d = scheduleRenderer.parseDate(EVENTS[i].start_time);
            EVENTS[i].absStartTime = d.day * 24 * 60 + d.hour * 60 + d.minute;
        }
        EVENTS.sort(function (a, b) {
            return a.absStartTime - b.absStartTime;
        });
        doc.setFontSize(4);
        for (var i = 0; i < EVENTS.length; i++) {
            var event = EVENTS[i];
            var room_name = event['room_name'];
            var width = 1;
            //if (room_name == 'ColumbiaAB') {room_name = 'ColumbiaA'; width = 2;}
            //if (room_name == 'Glacier + Horizon') {room_name = 'Glacier'; width = 2;}
            var column = scheduleRenderer.ROOMS.indexOf(room_name);
            if (column < 0) {
                continue;
            }
            var start_time = scheduleRenderer.parseDate(event['start_time']);
            var end_time = scheduleRenderer.parseDate(event['end_time']);
            var parentId = null;
            var conDay = scheduleRenderer.dateToConDay(start_time);
            doc.setPage(conDay + 1);

            if (end_time.hour >= 2 && (start_time.hour < 2 || start_time.hour > end_time.hour)) {
                end_time.hour = 2;
                end_time.minute = 0;
                end_time.second = 0;
            }

            var height = Math.floor(scheduleRenderer.dateDelta(end_time, start_time) / 1000.0 / 60.0 / 30.0 * CELL_HEIGHT) - 2;
            var width = width * CELL_WIDTH - 2;
            var x = MARGIN + CELL_WIDTH + column * CELL_WIDTH + 1;
            var start_hour = start_time.hour;
            if (start_hour < 2) {
                start_hour += 24;
            }
            if (start_hour == 2) {
                continue;
            }
            var y = MARGIN + HEADER + CELL_HEIGHT + Math.floor(((start_hour - START_TIME) * 60 + start_time.minute) / 30.0 * CELL_HEIGHT) + 1;
            var titleText = scheduleRenderer.wrapToFit(doc, 8, event['title'], width-2, height-2);

            var color_index = scheduleRenderer.TRACKS.indexOf(event.track);

            doc.setDrawColor.apply(doc, scheduleRenderer.asColor(scheduleRenderer.BORDER_COLORS[color_index]));
            doc.setFillColor.apply(doc, scheduleRenderer.asColor(scheduleRenderer.COLORS[color_index]));
            doc.roundedRect(x, y, width, height, 5, 5, 'DF');
            doc.text(titleText.lines, x + 1, y + titleText.fontSize + 1);

            if (event.foal_recommended) {
                //doc.addImage('FoalFriendlyIcon.svg', 'SVG', x + CELL_WIDTH - 22, y + 2, 20, 20);
            }
            if (event.ticket_purchase_required) {
                //doc.addImage('TicketIcon.svg', 'SVCG', x + CELL_WIDTH - 22, y + 2, 20, 16);
            }
        }

        scheduleRenderer.appendDescriptions(doc, EVENTS);

        return doc;
    }

    window.renderSchedulePdf = function(events) {
        var doc = renderDoc(events);
        doc.save('schedule.pdf');
    }

})();
