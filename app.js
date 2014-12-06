/**
 ** LeapSnap
 ** Author: Anubhav Mishra & Luke Kysow
 **/

var Leap = require('leapjs');
var WebSocketServer = require('ws').Server
, wss = new WebSocketServer({port: 8088});
var _ = require('underscore');

var controller = Leap.loop({enableGestures: true}, function(frame){

  if (frame.valid) {
      // Get a valid frame and detect gesture
      if(frame.gestures.length > 0){
        frame.gestures.forEach(function(gesture){
            switch (gesture.type){
              case "circle":
                  console.log("Circle Gesture");
                  sendMsg(gesture.type);
                  break;
              case "keyTap":
                  console.log("Key Tap Gesture");
                  sendMsg(gesture.type);
                  break;
              case "screenTap":
                  console.log("Screen Tap Gesture");
                  sendMsg(gesture.type);
                  break;
              case "swipe":
                  console.log("Swipe Gesture");
                  var Horizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
                  // Horizontal Gestures Right or Left
                  if(Horizontal){
                      if(gesture.direction[0] > 0){
                        // Applying threshold value to have a better response
                        if(gesture.duration > 30000){
                          console.log("right!");
                          sendMsg("swiperight");
                        }
                      } else {
                        // Applying threshold value to have a better response
                          if(gesture.duration > 30000){
                            console.log("left!");
                            sendMsg("swipeleft");
                          }
                      }
                  }
                  break;
            }
        });
      }
  }


});

var allSockets = [];

wss.on('connection', function (ws) {
  console.log('Connection!');
  allSockets.push(ws);
});


// Send gesture
var sendMsg = _.debounce(function (gesture){
  for(var i = 0; i < allSockets.length; i++){
    if (allSockets[i]) {
      try {
        allSockets[i].send(gesture);
      }
      catch(e) {
        console.log(e);
      }
    }
  }
}, 150, true);
