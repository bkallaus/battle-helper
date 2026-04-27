import { Dex } from '@pkmn/dex';
const pika = Dex.species.get('Pikachu');
console.log('Immunity Ground vs Flying:', Dex.getImmunity('Ground', ['Flying']));
console.log('Immunity Electric vs Ground:', Dex.getImmunity('Electric', ['Ground']));
console.log('Immunity Normal vs Ghost:', Dex.getImmunity('Normal', ['Ghost']));
console.log('Immunity Fire vs Water:', Dex.getImmunity('Fire', ['Water']));
