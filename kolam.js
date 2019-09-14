let tsize = 20,  // tile size
    margin = 1,  // margin size
    tnumber = 5;  // number of points (lager row) 

let link = [];  // connections
let nlink = [];  // next connections

let idx;  // index used to interpolate between old and new connections

let pg;  // PGraphics used to draw the kolam
let bgcolor;  // background color


/*===========================*/


function setup() {
  createCanvas(500, 500);  
  bgcolor = color(random(50), random(50), random(50));
  
  pg = createGraphics(tsize*tnumber + 2*margin, tsize*tnumber + 2*margin);
  
  
  
  for (let i = 0; i < tnumber + 1; i++)  {
    link[i] = [];
    nlink[i] = [];
    for (let j = 0; j < tnumber + 1; j++)  {
      link[i][j] = nlink[i][j] = int(random(0 ,1));
    }
  }
  
  configTile();
  
  background(bgcolor);
}


/*===========================*/


function draw() {
 
  if (idx <= 1)  drawTile();  //draw a new tile each frame while it's not entirely updated 
  
  translate(width/2, height/2);
  //rotate(QUARTER_PI);  

  imageMode(CENTER);
  image(pg, 0, 0);  
 
}


/*===========================*/


function mouseClicked() {
  configTile();
}


/*===========================*/


function configTile() {
  
  idx = 0;  // reset index
  
  // update ancient links
  for (let i = 0; i < link.length; i++) {
    for (let j = 0; j < link[0].length; j++) {
      link[i][j] = nlink[i][j];
    }
  }
  

  // create new links
  let limit = random(0, 1);  // choose frequency of conections randomly
  
  for (let i = 0; i < nlink.length; i++) {
    for (let j = i; j < nlink[0].length/2; j++) {
      
      let l = 0;      
      if (random(1) > limit)  l = 1;
      
      //nlink[i][j] = l;  // left-top
      //nlink[i][nlink[0].length - j - 1] = l;  // left-bottom
      //
      nlink[j][i] = l;  // top-left
      //nlink[nlink[0].length - j - 1][i]  = l;  // top-right
      //
      //nlink[nlink.length - 1 - i][j] = l;  // right-top
      //nlink[nlink.length - 1 - i][nlink[0].length - j - 1] = l;  // right-top
      //
      //nlink[j][nlink.length - 1 - i] = l;  // bottom-left
      //nlink[nlink[0].length - 1 - j][nlink.length - 1 - i] = l;  // bottom-right
    }
  }

}
  

/*===========================*/

  
function drawTile() {
  pg.background(bgcolor);
  pg.noFill();
  pg.stroke(255);
  pg.strokeWeight(1);
  
  for (let i = 0; i < tnumber; i++) {
    for (let j = 0; j < tnumber; j++) {
      if ((i+j)%2 == 0) {
        
        let top_left = tsize/2 * lerp(link[i][j], nlink[i][j], idx);
        let top_right = tsize/2 * lerp(link[i + 1][j], nlink[i + 1][j], idx);
        let bottom_right = tsize/2 * lerp(link[i + 1][j + 1], nlink[i + 1][j + 1], idx);
        let bottom_left = tsize/2 * lerp(link[i][j + 1], nlink[i][j + 1], idx);
        
        pg.rect(i*tsize + margin, j*tsize + margin, tsize, tsize, top_left, top_right, bottom_right, bottom_left);          
        pg.point(i*tsize + tsize/2 + margin, j*tsize+tsize/2 + margin);
        
      }
    }
  }
  
  // update index
  idx += 0.02;
  idx = constrain(idx, 0, 1);
}