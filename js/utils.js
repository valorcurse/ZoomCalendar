// function loadJSON(callback) {   

//     var xobj = new XMLHttpRequest();
//         xobj.overrideMimeType("application/json");
//     xobj.open('GET', 'my_data.json', true); // Replace 'my_data' with the path to your file
//     xobj.onreadystatechange = function () {
//           if (xobj.readyState == 4 && xobj.status == "200") {
//             // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
//             callback(xobj.responseText);
//           }
//     };
//     xobj.send(null);  
// }

function loadJSON(jsonFile, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', jsonFile, false);
    
    var data;
    
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        // console.log(request.responseText);
        // return JSON.parse(request.responseText);
        callback(JSON.parse(request.responseText));
      } else {
        // We reached our target server, but it returned an error
        callback(JSON.parse("{}"));
      }
    };
    
    request.onerror = function() {
    //   // There was a connection error of some sort
    };
    
    request.send();
    // return request.onload();
}

function isOnScreen(element) {
    var curPos = element.offset();
    var curTop = curPos.top;
    var screenHeight = $(window).height();
    return (curTop > screenHeight) ? false : true;
}