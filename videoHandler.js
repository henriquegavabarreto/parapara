//Posenet rules
let rules

//Setting up posenet
let poseNet;
let poses = [];

function modelReady(){
  console.log("Model Ready!");
  song.play()
}

function startPoseNet(){
  if (/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i.test(navigator.userAgent)) {
    rules = {
     imageScaleFactor: 0.5,
     outputStride: 16,
     flipHorizontal: false,
     minConfidence: 0.1,
     maxPoseDetections: 5,
     scoreThreshold: 0.5,
     nmsRadius: 20,
     detectionType: 'single',
     multiplier: 0.5,
    }
  } else {
    rules = {
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
  }
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
      frameRate: 30,
      facingMode: "user",
      width: 1280/3,
      height: 720/3
    }
  }

  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(mediaStream) {
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
      video.play();
      video.width = 1280/3
      video.height = 720/3
    }
  })
  .catch(function(err){
    if (err.name=="NotFoundError" || err.name == "DevicesNotFoundError" ){
      errorText.text = 'Are you sure you have a camera?\rCheck your device and your system preferences\rto make sure your camera is anabled and reload this page.'
    } else if (err.name=="NotReadableError" || err.name == "TrackStartError" ){
      errorText.text = 'Are you using your camera elsewhere?\rCome back here when your camera is not being used'
    } else if (err.name=="OverconstrainedError" || err.name == "ConstraintNotSatisfiedError" ){
      errorText.text = 'The camera you have is not supported...\rCheck this website on another device.'
    } else if (err.name=="NotAllowedError" || err.name == "PermissionDeniedError" ){
      errorText.text = 'This website needs permission to use your camera.\rMake sure you hit allowed when asked or \rcheck your settings and try again'
    } else if (err.name=="TypeError" || err.name == "TypeError" ){
      errorText.text = 'Oops... Something went wrong when we tried to access you camera...'
    } else {
      errorText.text = 'Something went wrong... Check if you have a camera, \rif it\'s working and that this website can use it.\rCheck your settings and try again'
    }
    console.log(err.name, err.message);
  });

}


function stopCapture(){
  video.srcObject.getVideoTracks().forEach(function (track) {
    track.stop();
  });
}
