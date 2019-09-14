let d;
let r;
  
let circles = [];
let n = 10;
let t = [];

let colors = [];

function setup() {
  createCanvas(500, 500);  
  //colors = chroma.scale([chroma.random(),chroma.random()]).mode('lch').colors(4);

  colors[0] = chroma.random().hex();
  colors[1] = chroma(colors[0]).brighten(0.2).hex();
  colors[2] = chroma.random().hex();
  colors[3] = chroma(colors[2]).brighten(0.2).hex();

  //colors[0] = chroma.random().hex();
  //colors[1] = chroma(colors[0]).brighten(0.2).hex();
  //colors[2] = chroma(colors[1]).brighten(0.2).hex();
  //colors[3] = chroma(colors[2]).brighten(0.2).hex();

  d = width/n;
  r = d/2;

  noLoop();
  noStroke();
}

function draw() {

  for (x = r; x < width + d; x+=d) {
    t[x] = [];
    
    let iy = 0;
    for (y = r; y < height+ d; y+=d) {       
      let list = [0, 2];
      let distanceFromCenter = Math.sqrt(Math.pow(x - r - width/2,2) + Math.pow(y - r - height/2,2));
    
      let oneWeight =  mapExp(distanceFromCenter, 0, width /2, 0, 2, 3);
      let weight = [1-oneWeight,oneWeight];
      weight = [.5,.5]
    
      let random_item = getRandomItem(list, weight);
      console.log(random_item);
      let i = random_item + Math.round(random(0,1));
      
      let color = colors[i];
            
      fill(color);
      rect(x -d, y -d , d, d);
      t[x][y] = color;
      iy ++;
    }
  }
  
  for (x = r; x < width; x+=d) {
    for (y = r; y < height; y+=d) { 
      let color = t[x+(d*int(random(0,2)))][y+(d*int(random(0,2)))];
      fill(color);
      circle((x), (y) , d, d);
    }
  }
  
  paper();
}

let getRandomItem = function(list, weight) {
    let total_weight = weight.reduce(function (prev, cur, i, arr) {
        return prev + cur;
    });
     
    let random_num = random(0, total_weight);
    let weight_sum = 0;
    //console.log(random_num)
     
    for (let i = 0; i < list.length; i++) {
        weight_sum += weight[i];
        weight_sum = +weight_sum.toFixed(2);
         
        if (random_num <= weight_sum) {
            return list[i];
        }
    }
};

let mapExp = function(value, start1, stop1, start2, stop2, exp = 2) {
  let inT = map(value, start1, stop1, 0, 1);
  let outT = Math.pow(inT, exp);
  return map(outT, 0, 1, start2, stop2);
}

let paper = function(size = 2, dust = false) { 
  push();
  strokeWeight(1);
  noStroke();
  for (let i = 0; i<width-1; i += size) {
    for (let j = 0; j<height-1; j += size) {
      fill(random(205-40, 205+30), 25);
      rect(i, j, size, size);
    }
  }

  if(dust) {
    for (let i = 0; i<30; i++) {
      fill(random(130, 215), random(100, 170));
      rect(random(0, width-2), random(0, height-2), random(1, 3), random(1, 3));
    }
  }
  pop();
}