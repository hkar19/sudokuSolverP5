let testing = false;
let testRowBomb = true;

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
  
  // this puzzle can be done with soleCan, seekingTruth, and boxBomb
  let puzzle00 = [ // 7 937 193 567
    [null,null,null,  null,null,9,    null,6,null],
    [5,6,null,        null,null,null, 8, null, null],
    [null,null,null,  null,1,3,       null, null, 2],

    [null,null,8,     6,null,null,    4,7,null],
    [null,null,4,     null,null,null, 6,null,null],
    [null,2,6,        null,null,1,    8,null,null],

    [7,null,null,     1,8,null,       null,null,null],
    [null,null,8,     null,null,null, null,3,7],
    [null,5,null,     9,null,null,    null,null,null]
  ];
  
  // this puzzle requires rowBomb or colBomb to solve.
  let puzzle01 = [ // 2 574 684 724
    [null,null,null,  null,2,null,    3,7,null],
    [null,null,8,     5,1,null,       null,null,4],
    [2,null,null,     null,7,null,    null,null,5],

    [6,null,null,     2,null,null,    4,9,null],
    [null,null,null,  null,null,null, null,null,null],
    [null,5,1,        null,null,7,    null,null,2],

    [5,null,null,     null,3,null,    null,null,9],
    [2,null,null,     null,8,5,       4,null,null],
    [null,8,3,        null,1,null,    null,null,null]
  ];
  
  // it was said puzzle02 can only be solved with swordfish pattern
  let puzzle02 = [ // very hard! from http://www.sudokuessentials.com/Sudoku_Swordfish.html
    [null,null,7,  null,null,4,    2,8,null],
    [null,null,null,  null,2,5,    null,null,4],
    [2,8,null,  null,null,null,    6,null,null],

    [null,9,null,  3,null,null,    null,null,null],
    [null,null,6,  null,null,null,    1,null,null],
    [null,null,null,  null,null,2,    null,9,null],

    [null,null,6,  null,null,null,    null,7,8],
    [2,null,null,  5,7,null,    null,null,null],
    [null,7,5,  4,null,null,    3,null,null]
  ];
  
  // selecting the puzzle to solve
  for(let i=0;i<9;i++){
    a[i] = puzzle02[i];
  }

  buildPossibilities();

  let n = 10;
  let cyc =0;
  while(!winning && n>0){
    seekingTruth();
    for(let i=0;i<9;i++) soleCan(i);
    boxBomb();
    rowBomb();
    n--;
    cyc++;
    checkWin();
  }
  
  
  // seekingTruth();
  
  // seekingTruth();

  // if (testing) {
  //   console.log(b);
  //   let i =1;
  //   for (let j = 0; j < 9; j++) { // show the built possibilities
  //     console.log("pos "+i+"," + j + "(" + a[i][j] + ")" + ": " + b[i][j]);
  //   }
  // }
  
  checkWin();
  if(!winning) alert("not yet solved in "+cyc+" cycles");
  else alert("solving complete in "+cyc+" cycles");
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
        textSize(0.15*size);
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

// when a[i][j] is not null, we kill possibility of value a[i][j] in:
// - the big box i
// - the row of a[i][j]
// - the column of a[i][j]
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

// sole candidate
// extracting the only possibility in b[i][j] into a[i][j]
// then we killPossibility of number in a[i][j]
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

// naked subset in box
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

// unique candidate in box i
function soleCan(i){ 
  for(let num =1;num<=9;num++){ // check number num
    if (a[i] && a[i].includes(num)) continue;

    let count = 0;
    let lastJ;
    for(let j=0;j<9;j++){ // small Box
      if (b[i][j] && b[i][j].includes(num)){
        count++;
        if (count>1) break;
        lastJ = j;
      }
    }

    if (count == 1){
      if(testing) console.log("the only possibility for "+i+","+lastJ+" is "+num);
      a[i][lastJ] = num;
      killPossibility(i,lastJ);
      soleCan(i);
      if(testing) console.log("at "+i+", soleCan finished here");
      return;
    }

  }
}

// naked subset in row
function rowBomb(){
  for(let i=0;i<3;i++){
    let startI = i*3;
    for(let j=0;j<3;j++){
      let startJ = j*3;
      if (testRowBomb) console.log("-------<STARTING FROM "+startI+","+startJ+">-------");

      for(let m=0;m<3;m++){
        let checkI = startI +m;
        for(let n=0;n<3;n++){
          let checkJ = startJ +n;
          if (testRowBomb) console.log("checking "+checkI+","+checkJ+"");

          // checking small box with only 2 possibilities
          if(b[checkI][checkJ] && b[checkI][checkJ].filter(num => num != null).length ===2){
            let pos = b[checkI][checkJ].filter(num => num != null);
            if (testRowBomb) console.log("small box with 2 possibilities detected at "+checkI+","+checkJ+" ("+pos+")");
            
            // checking other small boxes
            for(let r=m;r<3;r++){
              let anCheckI = startI +r;
              for(let s=0;s<3;s++){ // we must start checking the leftmost small box in bigbox anCheckI
                let anCheckJ = startJ +s;
                if (testRowBomb) console.log("rowBomb Check for another box "+anCheckI+","+anCheckJ+" ("+b[anCheckI][anCheckJ]+")");
                if(b[anCheckI][anCheckJ] && !((checkI == anCheckI) && (checkJ ==anCheckJ)) && JSON.stringify(b[checkI][checkJ])==JSON.stringify(b[anCheckI][anCheckJ])){

                  if (testRowBomb) console.log(checkI+","+checkJ+" and "+anCheckI+","+anCheckJ+" are the same box!");
                  
                  // bombing the rest of small box
                  for(let x=0;x<3;x++){
                    let bombI = startI +x;
                    for(let y=0;y<3;y++){
                      let bombJ = startJ +y;
                      
                      if (testRowBomb) console.log("considering rowBombing small box "+bombI+","+bombJ);
                      if(!( ((bombI == checkI) && (bombJ == checkJ)) || ((bombI == anCheckI) && (bombJ == anCheckJ)) )){
                        if(b[bombI][bombJ]){
                          if (testRowBomb) console.log("rowBombing! small box:"+bombI+","+bombJ);
                          b[bombI][bombJ][pos[0]-1] = null;
                          b[bombI][bombJ][pos[1]-1] = null;
                        }
                      }
                    }
                  }
                }

              }
            }
          }
        }
      }
      
    }
  }
}

// checking the winner
function checkWin(){
  for(let i=0;i<9;i++){
    for(let j=0;j<9;j++){
      if(b[i][j]) return;
    }
  }
  winning = true;
}