(function() {

    function formatDate(d) {
        var dateStr = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear() + ' ';
        var h = d.getHours();
        var a = 'AM';
        if (h > 12) {
          h = h - 12;
          a = 'PM';
        } else if (h == 0) {
          h = 12;
        }
        var m = d.getMinutes();
        if (m < 10) { 
          m = '0' + m;
        }
        dateStr += h + ':' + m + ' ' + a;
        return dateStr;
    }

    function formatTime(d) {
        var h = d.hour;
        var m = d.minute;
        var a = (h >= 12 ? 'PM' : 'AM');
        if (h > 12) {
            h -= 12;
        }
        if (h == 0) {
            h = 12;
        }
        if (m < 10) {
            m = '0' + m;
        }
        return h + ':' + m + ' ' + a;
    }

    function parseDate(d) {
        var regex = /^([0-9]+)-([0-9]+)-([0-9]+)T([0-9]+):([0-9]+):([0-9]+)$/;
        var match = regex.exec(d);
        if (match == null) {
            throw new Exception("Could not parse date " + d);
        }
        return {
            year: parseInt(match[1]),
            month: parseInt(match[2]),
            day: parseInt(match[3]),
            hour: parseInt(match[4]),
            minute: parseInt(match[5]),
            second: parseInt(match[6])
        }
    }

    function dateToConDay(d) {
        var conDay = d.day - 12;
        if (d.hour < 2) {
            conDay -= 1;
        }
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
    
    function asColor(c) {
        return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)];
    }

    function wrapToFit(doc, maxSize, text, width, height) {
        var paragraphs = text.split("\n");

        var done = false;
        var size = maxSize;
        while (!done && size > 0) {
            doc.setFontSize(size);
            var allLines = [];
            for (var i = 0; i < paragraphs.length; i++) {
                allLines = allLines.concat(doc.splitTextToSize(paragraphs[i], width));
            }
            // https://github.com/MrRio/jsPDF/blob/master/dist/jspdf.debug.js#L6818
            // Descent of the line is calculated by jsPDF as .25 of the font size
            if (allLines.length * size * 1.25 <= height) {
                done = true;
            } else {
                size -= 1;
            }
        }

        return {
            fontSize: size,
            lines: allLines
        };
    }

    function displayRoomName(room_name) {
        var room_index = ROOMS.indexOf(room_name);
        if (room_index != -1) {
            room_name = scheduleRenderer.ROOM_NAMES[room_index];
        } else {
            room_name = 'Other';
        }
        return room_name;
    }

    function appendDescriptions(doc, events) {
        const MARGIN = 0.5 * 72;
        const HEIGHT = 9.75 * 72;
        const WIDTH = 7.5 * 72;
        // https://github.com/MrRio/jsPDF/blob/master/dist/jspdf.debug.js#L6818
        // Descent of the line is calculated by jsPDF as .25 of the font size
        const LINE_HEIGHT = 1.25;
        const CON_DAYS = ['Friday', 'Saturday', 'Sunday'];

        var now = new Date();

        var yPos = HEIGHT;
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            doc.setFontSize(12);
            var descLines = doc.splitTextToSize(event.description, WIDTH);

            var totalHeight = (14 + 10 + 10 + (descLines.length+2) * 12);
            if (yPos + totalHeight * LINE_HEIGHT > HEIGHT) {
                doc.addPage();
                doc.setFontSize(12);
                doc.text('Generated ' + formatDate(now), MARGIN, 11 * 72 - MARGIN);
                yPos = 0;
            } else {
                yPos += 12 * LINE_HEIGHT;
            }

            yPos += 14 * LINE_HEIGHT;
            doc.setFontSize(14);
            doc.text(event.title, MARGIN, MARGIN + yPos);
            doc.setFontSize(10);
            var st = parseDate(event.start_time);
            var et = parseDate(event.end_time);
            doc.text(CON_DAYS[dateToConDay(st)] + ' ' + formatTime(st) + '\u2013' + formatTime(et), MARGIN, MARGIN + yPos + 10 * LINE_HEIGHT);
            doc.text(displayRoomName(event.room_name), MARGIN, MARGIN + yPos + 20 * LINE_HEIGHT);
            doc.setFontSize(12);
            doc.text(descLines, MARGIN, MARGIN + yPos + 20 * LINE_HEIGHT + 12 * LINE_HEIGHT);
            yPos += (20 + 12 + descLines.length * 12) * LINE_HEIGHT;
        }

    }

    window.scheduleRenderer = {
        formatDate: formatDate,
        formatTime: formatTime,
        parseDate: parseDate,
        dateToConDay: dateToConDay,
        dateDelta: dateDelta,
        ROOMS: ROOMS,
        ROOM_NAMES: ROOM_NAMES,
        TRACKS: TRACKS,
        COLORS: COLORS,
        BORDER_COLORS,
        asColor: asColor,
        wrapToFit: wrapToFit,
        appendDescriptions: appendDescriptions
    };

})();
