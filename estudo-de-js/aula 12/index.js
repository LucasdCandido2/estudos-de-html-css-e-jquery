let varA = 'A';
let varB = 'B';
let varC = 'C';


let varD = varA;
let varE = varB;
let varF = varC;

varA = varE;
varB = varF;
varC = varD;

console.log(varA, varB, varC);
