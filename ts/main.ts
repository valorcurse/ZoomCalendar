import {ZoomCalendar} from "../ts/zoomcalendar.ts";
// import * as ZoomCalendar from "../ts/zoomcalendar.ts";

var calendar: ZoomCalendar = new ZoomCalendar();

console.log("Adding zoomcalendar: " + calendar);

document.body.appendChild(calendar.domElement);