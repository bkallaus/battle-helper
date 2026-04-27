import { Dex } from '@pkmn/dex';
const pika = Dex.species.get('Pikachu');
console.log('Types:', pika.types);
const eff = Dex.getEffectiveness('Electric', pika.types);
console.log('Effectiveness Electric vs Pikachu:', eff);
const eff2 = Dex.getEffectiveness('Ground', pika.types);
console.log('Effectiveness Ground vs Pikachu:', eff2);
