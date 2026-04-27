import { Dex } from '@pkmn/dex';
console.log(Array.from(Dex.types.all()).map(t => t.name));
