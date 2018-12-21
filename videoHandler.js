//Setting up video element and capture function

let video = document.createElement('video');

function startCapture(){
  let vendoURL = window.URL || window.webkitURL;

  navigator.getMedia = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;

  navigator.getMedia({
    video: true,
    audio: false,
  }, function(stream){
    video.srcObject = stream;
    video.play();
  }, function(error){
    console.log(error);
  })

  video.width = 1280/2.5;
  video.height = 720/2.5;
}

function stopCapture(){
  video.srcObject.getVideoTracks().forEach(function (track) {
    track.stop();
  });
}
