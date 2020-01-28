let testing = true;

let a = []; // truth, inside each small box is number
let b = []; // possibilities, inside each small box is an array of 9
let winning = false;

let side = 630;

function setup() {
  createCanvas(side, side);
  
  for(let i =0;i<9;i++){ // initiating a and b
    a = a.concat([[]]);
    b = b.concat([[]]);
    
    for(let j=0;j<9;j++){
      //a[i] = a[i].concat([]); // by doing this, i made sure every small box is addressable
      b[i] = b[i].concat([[1,2,3,4,5,6,7,8,9]]);
    }
  }
  
  
  a[0] = [null, null, null, 
          null, null, 9, 
          null, 6, null];

  a[1] = [5, 6, null, 
          null, null, null, 
          8, null, null];
  
  a[2] = [null, null, null, 
          null, 1, 3, 
          null, null, 2];
  
  a[3] = [null, null, 8, 
          6, null, null, 
          4, 7, null];
  
  a[4] = [null, null, 4, 
          null, null, null, 
          6, null, null];

  a[5] = [null, 2, 6, 
          null, null, 1, 
          8, null, null];
  
  a[6] = [7, null, null, 
          1, 8, null, 
          null, null, null];
  
  a[7] = [null, null, 8, 
          null, null, null, 
          null, 3, 7];
  
  a[8] = [null, 5, null, 
          9, null, null, 
          null, null, null];
  
  
  buildPossibilities();
  seekingTruth();
  boxBomb();

  // if (testing) {
  //   console.log(b);
  //   let i =1;
  //   for (let j = 0; j < 9; j++) { // show the built possibilities
  //     console.log("pos "+i+"," + j + "(" + a[i][j] + ")" + ": " + b[i][j]);
  //   }
  // }

  if(!winning) alert("not yet winning");
  else alert("solving complete");
}

function draw() {
  background(255);
  let size = side/9;

  // drawing the borders
  for(let i=1;i<9;i++){
    if(i%3===0) strokeWeight(5);
    else strokeWeight(1);
    line(size*i,0,size*i,side);
    line(0,size*i,side,size*i);
  }

  // filling in the truth
  for(let i=0;i<9;i++){
    let initX =(i%3)*size*3+size/2;
    let initY = floor(i/3)*size*3+size/2;
    
    for(let j=0;j<9;j++){
      textSize(0.50*size);
      textAlign(CENTER, CENTER);
      let addX = (j%3)*size;
      let addY = floor(j/3)*size;
      if(a[i][j]) text(a[i][j].toString(),initX+addX,initY+addY);
      else{
        textSize(0.2*size);
        text(b[i][j].toString(),initX+addX,initY+addY);
      }
    }
  }



}

function buildPossibilities() {
  for (let i = 0; i < a.length; i++) { 
    for (let j = 0; j < 9; j++) {
      killPossibility(i,j);
    }
  }

}

function killPossibility(i,j){
  if (a[i][j]) {
    let fNo = a[i][j]; // forbidden number
    b[i][j] = null; // killing all possibility in the small box
    
    // killing possibility in each small box for particular big box "i"
    for (let k = 0; k < 9; k++) { 
      if (b[i][k]) { 
        b[i][k][fNo - 1] = null;
      }
    }
    
    // killing possibility in row
    for(let m =0;m<3;m++){ // big box numbering
      let _i = floor(i/3)*3 +m;
      
      if(_i != i){
        for(let n=0;n<3;n++){
          let _j = floor(j/3)*3 +n;
          if(b[_i][_j]){
            b[_i][_j][fNo-1] = null;
          }
        }
      }
    }

    // killing possibility in a column
    for(let m =0;m<3;m++){ // big box numbering
      let _i = i%3 +3*m;
      
      if(_i != i){
        for(let n=0;n<3;n++){
          let _j = j%3+3*n;
          if(b[_i][_j]){
            b[_i][_j][fNo-1] = null;
          }
        }
      }
    }
  }
}

function seekingTruth(){
  //let seeking = true;

  for(let i=0;i<9;i++){
    for(let j=0;j<9;j++){
      //if (testing) console.log("i am seeking truth");
      if(b[i][j]){
        let pos = b[i][j].filter(num => num != null);
        // if (testing) console.log("called on ("+i+","+j+") "+pos);
        if (pos.length === 1){
          // if (testing) console.log("IS KILLING ON ("+i+","+j+") with "+pos[0]);
          a[i][j] = pos[0];
          killPossibility(i,j);
          seekingTruth();
          return;
        }
      }
    }
  }

  if (testing) console.log("done seeking truth");


}

function boxBomb(){
  for(let i=0;i<9;i++){
    for(let j=0;j<9;j++){

      if(b[i][j] && b[i][j].filter(num => num != null).length ===2){ // check whether b[i][j] consist only 2 possibilities
        let pos = b[i][j].filter(num => num != null);
        if (testing) console.log("boxBomb Check for box "+i+","+j+" ("+pos+")");

        for(let k=j+1;k<9;k++){ // check next small block for the sameness of possibilities
          
          if(b[i][k] && JSON.stringify(b[i][j])==JSON.stringify(b[i][k])){
            if (testing) console.log(i+","+j+" and "+i+","+k+" are the same box!");
            for(let x=0;x<9;x++){
              if(x!=j && x!=k){ // delete the 2 possibilities in all other small box but b[i][j] and b[i][k]
                
                if(b[i][x]){
                  if (testing) console.log("boxBombing! small box:"+i+","+x);
                  b[i][x][pos[0]-1] = null;
                  b[i][x][pos[1]-1] = null;
                }
                
              }
            }

          }
        }
      }
    }
  }
}

function checkWin(){
  for(let i=0;i<9;i++){
    for(let j=0;j<9;j++){
      if(b[i][j]) return;
    }
  }
  winning = true;
}