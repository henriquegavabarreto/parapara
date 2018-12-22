//Posenet rules
let rules = {
 imageScaleFactor: 0.5,
 outputStride: 16,
 flipHorizontal: false,
 minConfidence: 0.1,
 maxPoseDetections: 5,
 scoreThreshold: 0.5,
 nmsRadius: 20,
 detectionType: 'single',
 multiplier: 0.75,
}

//Setting up posenet
let poseNet;
let poses = [];

function modelReady(){
  console.log("Model Ready!");
  posenetReady = true;
}

function startPoseNet(){
  poseNet = ml5.poseNet(video,rules,modelReady);
  poseNet.on('pose', function(results){
    poses = results;
  });
}


//Setting up video element and capture function

let video = document.createElement('video');

//old capture method

// function startCapture(){
//   let vendoURL = window.URL || window.webkitURL;
//
//   navigator.getMedia = navigator.getUserMedia ||
//                         navigator.webkitGetUserMedia ||
//                         navigator.mozGetUserMedia ||
//                         navigator.msGetUserMedia;
//
//   navigator.getMedia({
//     video: true,
//     audio: false,
//   }, function(stream){
//     video.srcObject = stream;
//     video.play();
//   }, function(error){
//     console.log(error);
//   })
//
//   video.width = 1280/2.5;
//   video.height = 720/2.5;
// }

function startCapture(){
  let constraints = {
    audio: false,
    video: {
      facingMode: "user",
      width: 1280,
      height: 720
    }
  }

  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(mediaStream) {
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
      video.play();
    }
  })
  .catch(function(err){
    console.log(err.name + ": " + err.message);
  });
  video.width = 1280/2.5;
  video.height = 720/2.5;
}


function stopCapture(){
  video.srcObject.getVideoTracks().forEach(function (track) {
    track.stop();
  });
}
