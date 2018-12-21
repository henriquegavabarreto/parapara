function cueSpawn(){
  for(let i = 0; i < danceChart.moves.length; i++){
      if(danceChart.moves[i].hasOwnProperty("single")){
        for(let j = 0; j < Object.keys(danceChart.moves[i].single).length; j++){
          singleCue(Object.values(danceChart.moves[i].single)[j].type,
                    Object.values(danceChart.moves[i].single)[j].position,
                    Object.values(danceChart.moves[i].single)[j].progress,
                    Object.values(danceChart.moves[i].single)[j].duration,
                    Object.values(danceChart.moves[i].single)[j].endingPosition,
                    danceChart.moves[i].beat);
        }
      }
      if(danceChart.moves[i].hasOwnProperty("double")){
        for(let j = 0; j < Object.keys(danceChart.moves[i].single).length; j++){
          singleCue(Object.values(danceChart.moves[i].single)[j].type,
                    Object.values(danceChart.moves[i].single)[j].position,
                    Object.values(danceChart.moves[i].single)[j].progress,
                    Object.values(danceChart.moves[i].single)[j].duration,
                    Object.values(danceChart.moves[i].single)[j].endingPosition,
                    danceChart.moves[i].beat);
        }

      }
    }
}

function singleCue(type, position, progress, duration, endingPosition, beat){
  switch(type){
    case "sharp":
    sharpCue(position,beat);
    break;
    case "hold":
    holdCue(position, progress, beat, duration, endingPosition);
    break;
    case "motion":
    motionCue(position, progress, beat, duration, endingPosition);
    break;
  }
}

function sharpCue(position,beat){
  //The first condition takes out the freezing at the beginning of animation
  if((advanceSpawn-(beat-songManager.currentBeat))/advanceSpawn > 0 && songManager.currentBeat < beat && songManager.currentBeat >= beat - advanceSpawn && (advanceSpawn-(beat-songManager.currentBeat))/advanceSpawn <= 1){
    graphics.lineStyle(12,0xff00ff,1);
    graphics.strokeCircle(grid[position].x,grid[position].y,(80*(advanceSpawn-(beat-songManager.currentBeat))/advanceSpawn));
  }

}

function holdCue(position,progress,beat, duration){
  if((advanceSpawn-(beat-songManager.currentBeat))/advanceSpawn > 0 && songManager.currentBeat < beat && songManager.currentBeat >= beat - advanceSpawn && progress === "start" && (advanceSpawn-(beat-songManager.currentBeat))/advanceSpawn <= 1){
    graphics.lineStyle(12,0x00ffff,1);
    graphics.strokeCircle(grid[position].x,grid[position].y,(80*(advanceSpawn-(beat-songManager.currentBeat))/advanceSpawn));
  }
  if(songManager.currentBeat >= beat && songManager.currentBeat <= beat + duration){
    graphics.lineStyle(12,0x00ffff);
    graphics.beginPath();
    graphics.arc(grid[position].x,grid[position].y,80,Phaser.Math.DegToRad(0),Phaser.Math.DegToRad(360*(duration-((beat+duration)-songManager.currentBeat))/duration));
    graphics.strokePath();
    graphics.closePath();
  }
}

function motionCue(position,progress,beat, duration, endingPosition){
  if((advanceSpawn-(beat-songManager.currentBeat))/advanceSpawn > 0 && songManager.currentBeat < beat && songManager.currentBeat >= beat - advanceSpawn && (progress === "start" || progress === "end")){
    graphics.lineStyle(12,0xffff00,1);
    graphics.strokeCircle(grid[position].x,grid[position].y,(80*(advanceSpawn-(beat-songManager.currentBeat))/advanceSpawn));
  }
  if((duration-((beat+duration)-songManager.currentBeat))/duration >= 0 && songManager.currentBeat < beat + duration && songManager.currentBeat >= beat - advanceSpawn && (progress === "start" || progress === "end")){
    graphics.lineStyle(12,0xffff00,0.5);
    graphics.lineBetween(grid[position].x,grid[position].y,grid[endingPosition].x,grid[endingPosition].y);

    graphics.fillStyle(0xffffff,0.8);
    let v1 = new Phaser.Math.Vector2(grid[position].x,grid[position].y);
    let v2 = new Phaser.Math.Vector2(grid[endingPosition].x,grid[endingPosition].y);

    let v1Lerp = v1.lerp(v2,(duration-((beat+duration)-songManager.currentBeat))/duration);

    graphics.fillCircle(v1Lerp.x,v1Lerp.y,15);
  }


  // if(round(songManager.currentBeat) === (beat - advanceSpawn) && round(songManager.currentBeat) > pastBeat && progress === 'start'){
  //   let cueMotionParticles = cueParticles.createEmitter({
  //       scale: { start: 0.5, end: 0.5 },
  //       blendMode: 'ADD',
  //       emitZone: { type: 'edge', source: new Phaser.Geom.Line(grid[position].x,grid[position].y, grid[endingPosition].x,grid[endingPosition].y), quantity: 500, yoyo: false },
  //       tint:0xffff00,
  //       quantity:50,
  //       lifespan:100,
  //       alpha: 0.6,
  //   });
  //   setTimeout(function(){cueMotionParticles.stop();cueMotionParticles.setAlpha(0);},advanceSpawn*songManager.tempo*1000)
  //   //cueParticles.emitParticleAt(grid[position].x,grid[position].y);
  // }
  // if(round(songManager.currentBeat) === beat && round(songManager.currentBeat) > pastBeat && progress === 'start'){
  //   let motionParticles = cueParticles.createEmitter({
  //     scale: { start: 0.5, end: 0 },
  //     blendMode: 'ADD',
  //     emitZone: { type: 'edge', source: new Phaser.Geom.Line(grid[position].x,grid[position].y, grid[endingPosition].x,grid[endingPosition].y), quantity: 50, yoyo: false },
  //     lifespan: 100,
  //     quantity: 5,
  //     tint: 0xffff00,
  //   });
  //   setTimeout(function(){motionParticles.stop(); motionParticles.setAlpha(0)},duration*1000*songManager.tempo);
  // }
}


let grid = createReferenceGrid();

function createReferenceGrid(){
  let referenceGrid = [];
  let initX = generalWidth/3;
  let initY = 180;
  let distance = 200;

  for(let y = initY; y <= initY + (2 * distance); y += distance ){
    for(let x = initX; x <= initX + (2 * distance); x += distance){
      referenceGrid.push({x: x, y: y});
    }
  }

  return referenceGrid;
}
