import {ZoomCalendar} from "../ts/zoomcalendar";
// import * as ZoomCalendar from "../ts/zoomcalendar.ts";

var calendar: ZoomCalendar = new ZoomCalendar();

// var start = new Date("January 13, 2016 11:13:00");
// var end = new Date("January 13, 2016 17:47:00");

// calendar.addEvent(start, end);

// start = new Date("October 12, 2016 11:13:00");
// end = new Date("October 14, 2016 17:47:00");

// calendar.addEvent(start, end);

console.log("Adding zoomcalendar: " + calendar);

document.body.appendChild(calendar.domElement);