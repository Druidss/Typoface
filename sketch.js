// p5.js

let sketch = function(p){
  let canvas;
  let videoFeed;
  let img;
  let soundBgm;
  let sourceText;
  let poem;
  let gloria;
  let startIndex = 0;
  let f;
  let hasPlayedSound = false; 
  let currentFrameRate;
  let targetFrameRateSmall = 1;
  let targetFrameRateLarge = 30;
  let time = 0;
  let transitionInProgress = true; // 标识是否在进行过渡
  let transitionProgress = 0;     // 过渡进度，范围从0到1
  let alpha = 255;





  p.preload = function () {
    p.soundFormats('mp3', 'ogg');
    soundBgm = p.loadSound("./bgm.mp3",onSoundLoaded);
    soundDang = p.loadSound("./dang.mp3",onSoundLoaded);
      
    gloria = p.loadImage("p2m.png");
    sourceText = p.loadStrings("/quesion.txt");
    f = p.loadFont(
    "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
  );
  }


  p.setup = function(){
    canvas = p.createCanvas(640, 480,this.WEBGL);
    canvas.id("canvas");
    p.colorMode(p.HSB);
    p.stroke(255);
    p.strokeWeight(3);

    videoFeed = p.createCapture(p.VIDEO);
    videoFeed.size(640,480);
    videoFeed.hide();//hides the Dom element-createCapture

    img = p.loadImage("./bmy.png");
    img2 = p.loadImage("./bgm2.jpg")

    poem = sourceText.join(' ');
    p.textFont(f,100)
    soundBgm.loop();
  }




  p.draw = function(){
    p.clear();

    if(detections != undefined){
      if(detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length >= 1){

        drawTransitionCanvas();
        p.textFace();
        p.faceMesh();
        if(!hasPlayedSound){
          soundDang.play();
          hasPlayedSound = true;
          transitionInProgress = true;
        }
      }else{
        if(hasPlayedSound){
          hasPlayedSound = false;
          alpha = 255;
        }
        p.background();
      }
    }

  }

  p.faceMesh = function(){
    p.push();
    // p.rotateY(p.radians(p.frameCount*0.5));
    p.translate(-p.width/2,-p.height/2);

    p.beginShape(p.POINTS);
    for(let j=0; j<detections.multiFaceLandmarks[0].length; j++){
      let x = detections.multiFaceLandmarks[0][j].x * p.width;
      let y = detections.multiFaceLandmarks[0][j].y * p.height;
      // console.log(p.width);
      // console.log(detections.multiFaceLandmarks[0][1].x);

      let color = (p.random(0,255),p.random(0,255),p.random(0,255));
      let colorB = p.map(p.brightness(color),0,255,0.3,0);
      // let z = p.map(colorB,0,1,-100,100);
      // let depth = p.map (colorB,0,1,-100,100);
      
      p.push();
      
      p.stroke(255); // 设置边框颜色为白色
      p.strokeWeight(1); // 设置边框宽度为2像素
      p.noFill(); // 不填充矩形
      p.rect(x,y,colorB*20,colorB*20);

      // p.translate(x-p.width/2,y-p.height/2,z);
      var xFrame = detections.multiFaceLandmarks[0][j].x

 if (!isNaN(xFrame)) {
    if (xFrame < 0.5) {
      currentFrameRate = p.lerp(targetFrameRateLarge, targetFrameRateSmall, xFrame * 2);
    } else {
      currentFrameRate = p.lerp(targetFrameRateSmall, targetFrameRateLarge, (xFrame - 0.5) * 2);
    }
  } else {
    currentFrameRate = targetFrameRateLarge;
  }
    // console.log(currentFrameRate);
      p.pop();
    }
    p.endShape();
    
    p.pop();
  }


  p.background = function() {
    img.resize(640, 480);
    p.image(img, -p.width/2 , -p.height/2)  // 在坐标(0, 0)，显示原图大小的图像 
    img.loadPixels(); // 加载图像像素数据
    p.push();
    p.translate(-p.width/2,-p.height/2);

    for (let x = 0; x < img.width; x += 5) {
      for (let y = 0; y < img.height; y += 5) {
        let pixelColor = p.color(img.get(x, y)); // 获取当前位置像素颜色
        let avg = p.red(pixelColor)*0.222 + p.green(pixelColor)*0.707 + p.blue(pixelColor)*0.071;
        let wave = p.sin(time + x * 0.1) * 20; // 使用sin函数模拟波动效果
        let diameter = p.map(wave, -20, 20, 2 , 3.5);

        p.fill(avg); // 使用像素颜色填充点
        p.noStroke(); // 不绘制描边
        p.ellipse(x, y+wave, diameter, diameter);
      }
    }
    time += 0.02;
    p.pop();
  }


  function onSoundLoaded() {
  // 音频加载完成后调用
  soundDang.play()
}

function drawTransitionCanvas() {
  // let transitionAlpha = p.map(transitionProgress, 0, 1, 255, 0);
  // p.fill(255, transitionAlpha);
  // p.rect(0, 0, p.width,p.height);
  
  img.resize(640, 480);

  p.tint(255, alpha);
  p.image(img, -p.width/2 , -p.height/2)  // 在坐标(0, 0)，显示原图大小的图像 
  
  if (alpha > 0 && hasPlayedSound) {
    alpha -= 30;
  }
  console.log(alpha);
  console.log(hasPlayedSound);
  
  p.push();
  p.pop();
}

p.textFace = function () {
  {
  p.frameRate(currentFrameRate);
  p.push();
  p.translate(-p.width/2,-p.height/2);
  let charIndex = startIndex; //0
  let w = p.width / gloria.width;  // 800/500  800/48
  let h = p.height / gloria.height;

  gloria.loadPixels();
  for (let j = 0; j < gloria.height; j++) {
  for (let i = 0; i < gloria.width; i++) {
      const pixelIndex = (i + j * gloria.width) * 4;
      const r = gloria.pixels[pixelIndex + 0];
      const g = gloria.pixels[pixelIndex + 1];
      const b = gloria.pixels[pixelIndex + 2];
      const avg = r*0.222 + g*0.707 + b*0.071;

      var fontSize = p.map(avg, 0, 255, w*1.6, w*0.4);
      
      p.noStroke();
      p.fill(avg);      
      p.textSize(fontSize);
      p.textAlign(p.CENTER, p.CENTER);
      
      p.text(poem.charAt(charIndex % poem.length), i * w + w * 0.5, j * h + h * 0.5);
      charIndex++;
    }
  }
  startIndex++; 
  p.pop();
}
}

}

let myp5 = new p5(sketch);