import { Dex } from '@pkmn/dex';
async function test() {
  const s = Dex.species.get('rotomwash');
  console.log(s.baseSpecies, s.id);
}
test();
