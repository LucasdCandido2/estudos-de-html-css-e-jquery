const nome = 'Luiz Otavio';
const sobrenome = 'Miranda';
const idade = 35;
const peso = 84;
const alturaEmM = 1.8;
let imc;
let anoNascimento;

imc = peso / (alturaEmM*alturaEmM);

anoNascimento = 2024 - idade;

console.log(`${nome} ${sobrenome} tem ${idade} anos pesa ${peso}kg`);
console.log(`tem ${alturaEmM} de altura e seu IMC é de ${imc.toFixed(2)}`);
console.log(`${nome} nasceu em ${anoNascimento}`);