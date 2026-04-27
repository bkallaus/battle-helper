import { Dex } from '@pkmn/dex';
async function test() {
  const l1 = await Dex.learnsets.get('rotomwash');
  console.log('rotomwash', l1?.learnset ? Object.keys(l1.learnset).length : 'no learnset');
  const l2 = await Dex.learnsets.get('rotom');
  console.log('rotom', l2?.learnset ? Object.keys(l2.learnset).length : 'no learnset');
}
test();
