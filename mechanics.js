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

//Simple place check that lights up the rings when hands are in place

function placeCheck(){
  for(let i = 0; i < 9; i++){
    if(isHandInposition('rightHand',i) || isHandInposition('leftHand',i)){
      group.children.entries[i].alpha = 0.8;
    } else {
      group.children.entries[i].alpha = 0.4;
    }
  }
}

//Main mechanics

function isHandInposition (hand, position){
  if(poses.length > 0){
    let nose = poses[0].pose.keypoints[0].position;
    let leftEar = poses[0].pose.keypoints[3].position;
    let rightEar = poses[0].pose.keypoints[4].position;
    let leftShoulder = poses[0].pose.keypoints[5].position;
    let rightShoulder = poses[0].pose.keypoints[6].position;
    let leftHip = poses[0].pose.keypoints[11].position;
    let rightHip = poses[0].pose.keypoints[12].position;
    let leftHand = poses[0].pose.keypoints[9].position;
    let rightHand = poses[0].pose.keypoints[10].position;

    let shouldersY = (leftShoulder.y + rightShoulder.y)/2;
    let hipsY = (leftHip.y + rightHip.y)/2;
    let stomach = (hipsY + shouldersY)/2;
    let neck = (nose.y + shouldersY)/2;

// Sets which hand is being checked
    let checkingHand;

    if(hand === "rightHand"){
      checkingHand = rightHand;
    } else {
      checkingHand = leftHand;
    }

    let left = false;
    let center = false;
    let right = false;
    let top = false;
    let middle = false;
    let bottom = false;

    if(checkingHand.x > leftEar.x){
      left = true;
    }
    if(checkingHand.x < leftShoulder.x + 20 && checkingHand.x > rightShoulder.x - 20){
      center = true;
    }
    if(checkingHand.x < rightEar.x){
      right = true;
    }
    if(checkingHand.y < shouldersY){
      top = true;
    }
    if(checkingHand.y < hipsY && checkingHand.y > nose.y){
      middle = true;
    }
    if(checkingHand.y > stomach){
      bottom = true;
    }

// Check the position for the hand
    switch(position){
      case 0:
        return left && top;
        break;
      case 1:
        return center && top;
        break;
      case 2:
        return right && top;
        break;
      case 3:
        return left && middle;
        break;
      case 4:
        return center && middle;
        break;
      case 5:
        return right && middle;
        break;
      case 6:
        return left && bottom;
        break;
      case 7:
        return center && bottom;
        break;
      case 8:
        return right && bottom;
        break;
    }
  }
}

//BASED ON NEW DANCECHART

let rightHandHolding = false;
let leftHandHolding = false;

function movementTests(){
  for(let i = 0; i < danceChart.moves.length; i++){
    if(songManager.currentBeat >= danceChart.moves[i].beat && round(songManager.currentBeat) === danceChart.moves[i].beat && round(songManager.currentBeat) > pastBeat){
      if(danceChart.moves[i].hasOwnProperty("single")){
        for(let j = 0; j < Object.keys(danceChart.moves[i].single).length; j++){
          singleMovementCheck(Object.values(danceChart.moves[i].single)[j].type,
                              Object.keys(danceChart.moves[i].single)[j],
                              Object.values(danceChart.moves[i].single)[j].position,
                              Object.values(danceChart.moves[i].single)[j].progress);
        }
      }
      if(danceChart.moves[i].hasOwnProperty("double")){
        doubleMovementCheck(danceChart.moves[i].double.type,
                            danceChart.moves[i].double.progress,
                            danceChart.moves[i].double.position);
      }
    }
  }
}

function singleMovementCheck(type, hand, position, progress){
  switch(type){
    case "sharp":
      singleSharpTest(type,hand,position);
      break;
    case "hold":
      singleHoldTest(type,hand,position,progress);
      break;
    case "motion":
      singleHoldTest(type,hand,position,progress);
      break;
  }
}

function singleSharpTest(type,hand,position){
  if(isHandInposition(hand,position)){
    //SHARP - HIT - setScore(type)
    hit(type,position);
  } else {
    //SHARP - MISS
    miss(position);
  }
}

function singleHoldTest(type,hand,position,progress){
  if(progress === "start" || getHoldingHand(hand)){
    if(isHandInposition(hand,position) && progress !== "end"){
      setHoldingHand(hand,true);
    } else if (isHandInposition(hand,position) && progress === "end"){
      //HOLD - HIT - setScore(type)
      hit(type,position);
      setHoldingHand(hand,false);
    } else {
      //HOLD - MISS
      //ANIMATION TINT
      miss(position);
      setHoldingHand(hand,false);
    }
  }
}

function doubleMovementCheck(type, progress, position){
  switch(type){
    case "sharp":
      doubleSharpTest(position);
      break;
    case "hold":
      doubleHoldTest(position, progress);
      break;
    case "motion":
      doubleHoldTest(position, progress);
      break;
  }
}

function doubleSharpTest(type,position){
  if(isHandInposition(Object.keys(position)[0],Object.values(position)[0]) &&
    isHandInposition(Object.keys(position)[1],Object.values(position)[1])){
    //DOUBLE - HIT - setScore(type)
    hit(type, position);
  } else {
    //DOUBLE - MISS
    miss(position);
  }
}

function doubleHoldTest(type,position,progress){
  let hand1 = Object.keys(position)[0];
  let hand2 = Object.keys(position)[1];
  let position1 = Object.values(position)[0];
  let position2 = Object.values(position)[1];

  if(progress === "start" || (getHoldingHand(hand1) && getHoldingHand(hand2))){
    if(isHandInposition(hand1,position1) && isHandInposition(hand2,position2) && progress !== "end"){
      setHoldingHand(hand1,true);
      setHoldingHand(hand2,true);
    } else if (isHandInposition(hand1,position1) && isHandInposition(hand2, position2) && progress === "end"){
      //HOLD - HIT - setScore(type)
      hit(type,position);
      setHoldingHand(hand1,false);
      setHoldingHand(hand2,false);
    } else {
      //HOLD - MISS
      //ANIMATION TINT
      miss(position);
      setHoldingHand(hand1,false);
      setHoldingHand(hand2,false);
    }
  }
}

function setHoldingHand(hand,condition){
  if(hand === "rightHand"){
    rightHandHolding = condition;
  } else {
    leftHandHolding = condition;
  }
}

function getHoldingHand(hand){
  if(hand === "rightHand"){
    return rightHandHolding;
  } else {
    return leftHandHolding;
  }
}

function hit(type,position){
  hitCount++;
  hitTxt.text = 'HIT: ' + hitCount;

}
function miss(position){
  missCount++;
  missTxt.text = 'MISS: ' + missCount;
}
