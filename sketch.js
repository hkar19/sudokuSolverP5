let testing = true;

let a = []; // truth, inside each small box is number
let b = []; // possibilities, inside each small box is an array of 9

function setup() {
  createCanvas(400, 400);
  
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

  if (testing) {
    console.log(b);
    let i =1;
    for (let j = 0; j < 9; j++) { // show the built possibilities
      console.log("pos "+i+"," + j + "(" + a[i][j] + ")" + ": " + b[i][j]);
    }
  }

}

// function draw() {
//   background(220);
// }

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
        if (testing) console.log("called on ("+i+","+j+") "+pos);
        if (pos.length === 1){
          if (testing) console.log("IS KILLING ON ("+i+","+j+") with "+pos[0]);
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