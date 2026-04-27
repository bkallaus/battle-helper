import { calculate, Pokemon, Move } from '@smogon/calc';
const p1 = new Pokemon(9, 'Pikachu', { level: 50 });
const p2 = new Pokemon(9, 'Charizard', { level: 50 });
const move = new Move(9, 'Thunderbolt');
const result = calculate(9, p1, p2, move);
console.log(result.range());
