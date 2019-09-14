//////////////////////////////////////////////////////////////////////////
//                       //                                             //
//   -~=Manoylov AC=~-   //                Mad Tiler 510                //
//                       //                                             //
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// Based on:                                                            //
//    #510 Mad Tiler  								                                  //
//    http://geometrydaily.tumblr.com/image/58788031158                 //
//    http://geometrydaily.tumblr.com/post/58788031158/510-mad-tiler    //
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// Controls:                                                            //
//    mouse                                                             //
//      click: generate new composition                                 //
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// Contacts:                                                            //
//    http://manoylov.tumblr.com/                                       //
//    https://codepen.io/Manoylov/                                      //
//    https://www.openprocessing.org/user/23616/                        //
//    https://twitter.com/ManoylovAC                                    //
//    https://www.facebook.com/epistolariy                              //
//////////////////////////////////////////////////////////////////////////

'use strict';
(function() {
  var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    width, height;

  var sz = 640;
  var borderSz = sz / 100 * 14;
  var endPos = sz - borderSz;

  var blockW = sz / 22;
  var blockH = blockW * 1.75;
  var blockHypotenuse = Math.sqrt((blockW * blockW) + (blockH * blockH));
  var vrStep = blockH / 2;
  var hrStep = blockHypotenuse + blockW;

  var angles = [[0, 60, 120], [60, 120]];
  var blocks = [];
  var sivId, noiseLayer;

  function start() { setup(); }

  function setup() {
    canvas.width  = width = sz;
    canvas.height = height = sz;
    ctx.fillStyle = '#21708a';
    blocks = createBlocks();
    sivId = setInterval(function () { updBlocksAngles(); }, 4000);
    noiseLayer = createNoiseLayer();

    setEventListeners();
    setTimeout(function () { draw(); }, 200);
  }

  function draw() {
    background('#ededed');

    for (var i = 0; i < blocks.length; ++i) {
      blocks[i].drawWithAnimate();
    }

    ctx.drawImage(noiseLayer.canvas, 0, 0);
    window.requestAnimationFrame(draw);
  }

  function createBlocks() {
    var angSetNum = Math.random() > .1 ? 0 : 1;
    var blocksArr = [];

    for (var y = borderSz - vrStep / 8, yIter = 0; y < endPos; y += vrStep, ++yIter) {
      for (var x = borderSz - hrStep / 8; x <= endPos; x += hrStep) {
        if (yIter % 2 === 1) {
          blocksArr.push(new Block(x, y, blockW, blockH, deg2rad(angles[angSetNum][~~random(angles[angSetNum].length)])));
        }
        else  {
          blocksArr.push(new Block(x + hrStep / 2, y, blockW, blockH, deg2rad(angles[angSetNum][~~random(angles[angSetNum].length)])));
        }
      }
    }

    return blocksArr;
  }

  function updBlocksAngles() {
    var angSetNum = Math.random() > .2 ? 0 : 1;

    for (var i = 0; i < blocks.length; ++i) {
      var fr = Math.random() < .9 ? 1 : 2;
      blocks[i].setAngle(deg2rad(angles[angSetNum][~~random(angles[angSetNum].length)] * fr));
      blocks[i].durEnd = random(1.3, 1.7);
    }
  }

  function createNoiseLayer() {
    var noiseLayer = new CLayer(width, height);

    for (var i = 0; i < width - 1; i += 2) {
      for (var j = 0; j < height - 1; j += 2) {
        var grey = ~~random(205-40, 205+30);
        noiseLayer.drawCtx.fillStyle = 'rgba(' + grey + ',' + grey + ',' + grey + ', .1)';
        noiseLayer.drawCtx.fillRect(i, j, 2, 2);
      }
    }

    for (var itr = 0; itr < 30; itr++) {
      var grey = ~~random(130, 215);
      var opacity = (random(100, 170) / 255).toFixed(2) ;
      noiseLayer.drawCtx.fillStyle = 'rgba(' + grey + ',' + grey + ',' + grey + ', ' + opacity + ')';
      noiseLayer.drawCtx.fillRect(random(0, width-2), random(0, height-2), random(1, 3), random(1, 3));
    }

    return noiseLayer;
  }

  function setEventListeners() {
    canvas.addEventListener('mousedown', mouseDn);
    document.addEventListener('keypress', keyPress);
  }

  function keyPress(e) {
    var eventKey = e.key ? e.key.toLowerCase() : e;
    if (~'gnr'.indexOf(eventKey)) {
      if (sivId) { clearInterval(sivId); }

      blockW = constrain(blockW, 5, width / 15);
      blockH = blockW * 1.75;
      blockHypotenuse = Math.sqrt((blockW * blockW) + (blockH * blockH));
      vrStep = blockH / 2;
      hrStep = blockHypotenuse + blockW;
      blocks = createBlocks();
    }
  }

  function mouseDn(evt) {
    if (evt.target.nodeName === 'CANVAS') {
      if (sivId) { clearInterval(sivId); }
      if (evt.button === 0) { updBlocksAngles(); }
    }
  }

///////////////////////////////////////////////////////////////////////
// Classes ///////////////////////////////////////////////////////////////////////

  // CLayer Class
  function CLayer (w, h) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.drawCtx = this.canvas.getContext('2d');
  }

  // Block Class
  function Block(x, y, w, h, angle) {
    this.x = x;
    this.y = y;
    this.wdth = w;
    this.currHght = 0;
    this.targetHght = h;
    this.currAng = angle;
    this.targetAng = angle;
    this.durEnd = 1.5;
    this.durProgress = 0;

    this.setAngle = function (newAngle) {
      this.targetAng = newAngle;
      this.durProgress = 0;
    };
    this.updateAnimationValues = function () {
      if (this.durProgress < this.durEnd) {
        if (this.currAng !== this.targetAng) {
          this.currAng = easeInOutSine(this.durProgress, this.currAng, this.targetAng - this.currAng, this.durEnd);
        }
        if (this.currHght !== this.targetHght) {
          this.currHght = easeInOutSine(this.durProgress, this.currHght, this.targetHght - this.currHght, this.durEnd);
        }

        this.durProgress += .008;
      }
    };
    this.draw = function () {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.currAng);
      ctx.fillRect(-this.wdth / 2, -this.currHght / 2 - .3, this.wdth, this.currHght + .6);
      ctx.restore();
    };
    this.drawWithAnimate = function () {
      this.updateAnimationValues();
      this.draw();
    };
  }

////////////////////////////////////////////////////////////////////
// Helper Functions ////////////////////////////////////////////////////////////////////

  function random (min, max){
    if (!min && min !== 0) {
      return Math.random();
    } else if (!max) {
      return Math.random() * min;
    }

    return Math.random() * (max - min) + min;
  }

  function background(clr) {
    ctx.save();
    ctx.fillStyle = clr || "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function deg2rad (degrees) {
    return degrees * Math.PI / 180
  }

  function constrain (n, low, high) {
    return Math.max(Math.min(n, high), low);
  }

  // t: curr time, b: start val, c: change In value, d: duration
  function easeInOutSine(t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  }


  // -~= START =~- //
  start();
})();
