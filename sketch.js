let testing = true;

function setup() {
  createCanvas(400, 400);
  
  let a = []; // truth, inside each small box is number
  let b = []; // possibilities, inside each small box is an array of 9
  
  for(let i =0;i<9;i++){
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
  
  
  b = buildPossibilities(a, b);

  if (testing) {
    // console.log(b);
    let i =1;
    for (let j = 0; j < 9; j++) { // show the built possibilities
      console.log("pos "+i+"," + j + "(" + a[i][j] + ")" + ": " + b[i][j]);
    }
  }

}

// function draw() {
//   background(220);
// }

function buildPossibilities(a, b) {
  let bPos = b;

  for (let i = 0; i < a.length; i++) { 
    for (let j = 0; j < 9; j++) {
      if (a[i][j]) {
        let fNo = a[i][j]; // forbidden number
        bPos[i][j] = null; // killing all possibility in the small box
        
        // killing possibility in each small box for particular big box "i"
        for (let k = 0; k < 9; k++) { 
          if (bPos[i][k]) { 
            bPos[i][k][fNo - 1] = null;
          }
        }
        
        // killing possibility in row
        for(let m =0;m<3;m++){ // big box numbering
          let _i = floor(i/3) +m;
          
          if(_i != i){
            for(let n=0;n<3;n++){
              let _j = floor(j/3)+n;
              if(bPos[_i][_j]){
                bPos[_i][_j][fNo-1] = null;
              }
            }
          }
        }
      }
    }
  }

  return bPos;
}