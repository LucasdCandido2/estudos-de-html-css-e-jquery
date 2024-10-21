let arr = [1,2,3,4];
arr.push(5);
console.log(arr);//metodo push(), que adiciona 1 item a array no final dela arr = [1,2,3,4,5];


let arr2 = [1,2,3,4];
arr2.pop()
console.log(arr2);//metodo pop(), que remove o ultimo item da array arr2 = [1,2,3];

let arr3 = [1,2,3,4,];
arr3.shift();
console.log(arr3);//metodo shift(), que remove o primeiro item da array arr3 = [2,3,4,];

let arr4 = [1,2,3,4];
arr4.unshift(0);
console.log(arr4);//metodo unshift(), que adiciona um item ao inicio do array arr4 = [0,1,2,3,4];


let arr5 = [1,2,3,4];
let doubled = arr5.map(function(num){
    return num * 2;
})
console.log(doubled);//metodo map(), cria um novo array com o resultado da função aplicada a cada elemento da array doubled = [2,4,6,8]


let arr6 = [1,2,3,4];
let evens = arr6.filter(function(num){
    return num % 2 === 0;
});
console.log(evens);//metodo filter(), cria um novo array com os itens que passaram no teste implementado pela função evens = [2,4]

let arr7 = [1,2,3,4];
arr7.forEach(function(val){
    console.log(val); 
});//metodo forEach(), executa uma função para cada elemento da arrey

let test = [12, 34, 56, 78, 90, 23, 45, 67, 89, 10];
test.push(55);
console.log(test);

let test2 = [12, 34, 56, 78, 90, 23, 45, 67, 89, 10];
test2.pop();
console.log(test2);

let test3 = [12, 34, 56, 78, 90, 23, 45, 67, 89, 10];
test3.shift();
console.log(test3);

let test4 = [12, 34, 56, 78, 90, 23, 45, 67, 89, 10];
test4.unshift(10);
console.log(test4);

let test5 = [12, 34, 56, 78, 90, 23, 45, 67, 89, 10];
let div = test5.map(function(num){
    return num / 2;
})
console.log(div);

let test6 = [12, 34, 56, 78, 90, 23, 45, 67, 89, 10];
let evens2 = test6.filter(function(num){
    return num % 2 === 0;
})
console.log(evens2);

let test7 = [12, 34, 56, 78, 90, 23, 45, 67, 89, 10];
test7.forEach(function(num){
    console.log(num);  
})

//////////////////////////////////////////////////////////////////////////////////

let names = ['alice', 'bob', 'charlie'];
names.push('david');
console.log(names); // ['alice', 'bob', 'charlie', 'david']

let names2 = ['alice', 'bob', 'charlie'];
let removedName = names.pop()
console.log(names2,removedName); //['alice', 'bob', 'charlie'] 'david'

let names3 = ['alice', 'bob', 'charlie'];
let firstName = names3.shift();
console.log(names3,firstName);//['bob','charlie']'alice'

let names4 = ['alice', 'bob', 'charlie'];
names4.unshift('david')
console.log(names4); //['david','alice','bob','charlie']

let names5 = ['alice', 'bob', 'charlie'];
let uppercasedNames = names5.map(function(name){
    return name.toUpperCase();
});
console.log(uppercasedNames);//['ALICE','BOB','CHARLIE']

let names6 = ['alice', 'bob', 'charlie', 'ana'];
let aNames = names6.filter(function(name){
    return name.startsWith('a');
});
console.log(names6,aNames);//['alice','bob','charlie','ana'] ['alice','ana']

let names7 = ['alice', 'bob', 'charlie'];
names7.forEach(function(name){
    console.log(name);
})
/*
alice
bob
charlie
*/

let names11 = ['MANOEL','VERONICA','JOAO','RAFAEL','DOOUGLAS','AMANDA'];
names11.push('DIEGO');
console.log(names11);

let names12 = ['MANOEL','VERONICA','JOAO','RAFAEL','DOOUGLAS','AMANDA'];
names12.pop();
console.log(names12);

let names13 = ['MANOEL','VERONICA','JOAO','RAFAEL','DOOUGLAS','AMANDA'];
names13.shift();
console.log(names13);

let names14 = ['MANOEL','VERONICA','JOAO','RAFAEL','DOOUGLAS','AMANDA'];
names14.unshift('CASSANDRA');
console.log(names14);

let names15 = ['MANOEL','VERONICA','JOAO','RAFAEL','DOOUGLAS','AMANDA'];
let lowercaseNames = names15.map(function(name){
    return name.toLowerCase();
})
console.log(names15,lowercaseNames)

let names16 = ['MANOEL','VERONICA','JOAO','RAFAEL','DOOUGLAS','AMANDA'];
let namesA = names16.filter(function(name){
    return name.endsWith('A');
});
console.log(names16,namesA);

let names17 = ['MANOEL','VERONICA','JOAO','RAFAEL','DOOUGLAS','AMANDA'];
names17.forEach(function(name){
    console.log(name);
})

let numName = [1,'ana',2,'leandro'];
numName.push(4,'Roberta');
console.log(numName);

let numName2 = [1,'ana',2,'leandro'];
let utiEle = numName2.pop();
console.log(numName2,utiEle);

let numName3 = [1,'ana',2,'leandro'];
let priEle = numName3.shift();
console.log(numName3,priEle);

let numName4 = [1,'ana',2,'leandro'];
numName4.unshift(0,'miguel');
console.log(numName4);

let numName5 = [1,'ana',2,'leandro'];
let strArr = numName5.map(function(item){
    return item.toString();
});
console.log(numName5,strArr);

let numName6 = [1,'ana',2,'leandro'];
let numbers = numName6.filter(function(item){
    return typeof item === 'number';
});
console.log(numName6,numbers);

let numName7 = [1,'ana',2,'leandro'];
numName7.forEach(function(item){
    console.log(item);
})

let numName11 = [1,'DOUGLAS',2,'DIEGO',3,'MIGUEL'];
numName11.push(4,'JAVIER');
console.log(numName11);

let numName12 = [1,'DOUGLAS',2,'DIEGO',3,'MIGUEL'];
numName12.pop();
console.log(numName12);

let numName13 = [1,'DOUGLAS',2,'DIEGO',3,'MIGUEL'];
numName13.unshift(0,'DEANGELO');
console.log(numName13);

let numName14 = [1,'DOUGLAS',2,'DIEGO',3,'MIGUEL'];
numName14.shift();
console.log(numName14);

let numName15 = [1,'DOUGLAS',2,'DIEGO',3,'MIGUEL'];
let mapNam = numName15.map(function(item){
    return item.toString();
});
console.log(numName15,mapNam);

let numName16 = [1,'DOUGLAS',2,'DIEGO',3,'MIGUEL'];
let strNam = numName16.filter(function(item){
    return typeof item === 'string'
})
console.log(numName16,strNam);

let numName17 = [1,'DOUGLAS',2,'DIEGO',3,'MIGUEL'];
numName17.forEach(function(item){
    console.log(item);
})

let multArray = [
    [1,2,3,4],
    ['matheus','miguel','carlos','joao'],
    [5,6,7,8],
    ['rafael','daniel','nathan','javier']
];

multArray.push([9,10,11,12]);
console.log(multArray);

let multArray2 = [
    [1,2,3,4],
    ['matheus','miguel','carlos','joao'],
    [5,6,7,8],
    ['rafael','daniel','nathan','javier']
];

multArray2.pop();
console.log(multArray2);

let multArray3 = [
    [1,2,3,4],
    ['matheus','miguel','carlos','joao'],
    [5,6,7,8],
    ['rafael','daniel','nathan','javier']
];
let firstArray = multArray3.shift();
console.log(multArray3,firstArray);

let multArray4 = [
    [1,2,3,4],
    ['matheus','miguel','carlos','joao'],
    [5,6,7,8],
    ['rafael','daniel','nathan','javier']
];

multArray4.unshift([0,0,0,0]);
console.log(multArray4);

let multArray5 = [
    [1,2,3,4],
    ['matheus','miguel','carlos','joao'],
    [5,6,7,8],
    ['rafael','daniel','nathan','javier']
];
let incrArray = multArray5.map(function(innerArray){
    return innerArray.map(function(item){
        return typeof item === 'number' ? item + 10 : item;
    });
});
console.log(multArray5,incrArray);

let multArray6 = [
    [1,2,3,4],
    ['matheus','miguel','carlos','joao'],
    [5,6,7,8],
    ['rafael','daniel','nathan','javier']
];
let filtArray = multArray6.filter(function(innerArray){
    return innerArray.some(item => typeof item === 'number');
});

console.log(multArray6,filtArray);

let multArray7 = [
    [1,2,3,4],
    ['matheus','miguel','carlos','joao'],
    [5,6,7,8],
    ['rafael','daniel','nathan','javier']
];
multArray7.forEach(function(innerArray){
    innerArray.forEach(function(item){
        console.log(item);
        
    });
});

let num1 = [1,2,3,4];
num1.push(5);
console.log(num1);

let num2 = [1,2,3,4];
num2.pop();
console.log(num2);

let num3 = [1,2,3,4];
num3.shift();
console.log(num3);

let num4 = [1,2,3,4];
num4.unshift(1);
console.log(num4);

let num5 = [1,2,3,4];
let doubled2 = num5.map(function(num){
    return num * 2;
})
console.log(doubled2);

let num6 = [1,2,3,4];
let evens3 = num6.filter(function(num){
    return num % 2 === 0;
});
console.log(evens3);

let num7 = [1,2,3,4];
num6.forEach(function(num){
    console.log(num);
});

let ray = ['matheus','miguel','joao','javier'];
ray.push('rai');
console.log(ray);

let ray2 = ['matheus','miguel','joao','javier'];
ray2.pop();
console.log(ray2);

let ray3 = ['matheus','miguel','joao','javier'];
ray3.shift()
console.log(ray3);

let ray4 = ['matheus','miguel','joao','javier'];
ray4.unshift('matias');
console.log(ray4);

let ray5 = ['matheus','miguel','joao','javier'];
let rayM = ray5.map(function(str){
    return str.toUpperCase()
})
console.log(rayM);

let ray6 = ['matheus','miguel','joao','javier'];
let rayCase = ray6.filter(function(str){
    return str.startsWith('m');
});
console.log(rayCase);

let ray7 = ['matheus','miguel','joao','javier'];
ray7.forEach(function(str){
    console.log(str);
});

let arrNum = [1,'matheus',2,'miguel',3,'samuel',4,'diego'];
arrNum.push(5);
console.log(arrNum);

let arrNum2 = [1,'matheus',2,'miguel',3,'samuel',4,'diego'];
arrNum2.pop();
console.log(arrNum2);

let arrNum3 = [1,'matheus',2,'miguel',3,'samuel',4,'diego'];
arrNum3.shift();
console.log(arrNum3);

let arrNum4 = [1,'matheus',2,'miguel',3,'samuel',4,'diego'];
arrNum4.unshift(0,'rafael')
console.log(arrNum4);

let arrNum5 = [1,'matheus',2,'miguel',3,'samuel',4,'diego'];
