const config = {
    "DAYS": {
        "NUMBER_OF" :7,
        "SPACE_BETWEEN": 5
    },
    "WEEKS": {
         "AXIS": {
             "HEIGHT": 40,
             "Y_PADDING": 30
         }
    }
    
};

const ZoomLevel = {
    YEAR: 0.5,
    MONTH: 1,
    DAY: 5,
};

var zoomLevel = ZoomLevel.YEAR;
var previousZoomLevel = ZoomLevel.YEAR;