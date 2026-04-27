import React, { useState } from 'react';
import { Dex } from '@pkmn/dex';
import { TypeGrid } from './TypeGrid';
import { allSpecies, allTypes } from '../data';

export const TypeChartPanel = () => {
  const [attackingType, setAttackingType] = useState<string>('Normal');
  const [defendingTypes, setDefendingTypes] = useState<string[]>(['Normal']);
  const [defendingSpecies, setDefendingSpecies] = useState<string>('');

  const handleSpeciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDefendingSpecies(val);
    const speciesInfo = Dex.species.get(val);
    if (speciesInfo && speciesInfo.exists) {
      setDefendingTypes(speciesInfo.types);
    }
  };

  const handleTypeToggle = (t: string) => {
    setDefendingSpecies('');
    if (defendingTypes.includes(t)) {
      setDefendingTypes(defendingTypes.filter(type => type !== t));
    } else {
      if (defendingTypes.length < 2) {
        setDefendingTypes([...defendingTypes, t]);
      } else {
        // Replace the oldest selection if trying to add a third
        setDefendingTypes([defendingTypes[1], t]);
      }
    }
  };

  const p2Types = defendingTypes;

  let multiplier = 1;
  let effText = "";
  if (p2Types.length === 0) {
    effText = "No Type Selected";
  } else if (attackingType) {
    const isImmune = !Dex.getImmunity(attackingType, p2Types);
    if (isImmune) {
      multiplier = 0;
    } else {
      const eff = Dex.getEffectiveness(attackingType, p2Types);
      multiplier = Math.pow(2, eff);
    }
    effText = multiplier === 0 ? "Immune (0x)" : multiplier === 1 ? "Neutral (1x)" : `${multiplier}x Effective`;
  }

  const resultColor = p2Types.length === 0 ? 'var(--text-muted)' : multiplier > 1 ? 'var(--hp-green)' : multiplier < 1 && multiplier > 0 ? 'var(--hp-yellow)' : multiplier === 0 ? 'var(--text-muted)' : 'var(--text-main)';
  const resultBorder = p2Types.length === 0 ? 'var(--border)' : multiplier > 1 ? 'var(--hp-green)' : multiplier < 1 ? 'var(--hp-red)' : 'var(--border)';

  return (
    <div className="builder-panel" style={{ marginTop: '1.5rem' }}>
      <h2>Type Matchup Calculator</h2>
      
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label>Attacking Type</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {allTypes.map(t => (
            <button
              type="button"
              key={t}
              onClick={() => setAttackingType(t)}
              className={`tab-btn ${attackingType === t ? 'active' : ''}`}
              style={{ border: '1px solid var(--border)', fontSize: '14px' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label>Defending Type(s) - Select up to 2</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {allTypes.map(t => (
            <button
              type="button"
              key={t}
              onClick={() => handleTypeToggle(t)}
              className={`tab-btn ${defendingTypes.includes(t) ? 'active' : ''}`}
              style={{ border: '1px solid var(--border)', fontSize: '14px' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>— OR —</div>

      <div className="form-group" style={{ marginBottom: '1.5rem', maxWidth: '300px' }}>
        <label>Search Defending Pokémon</label>
        <div className="input-with-clear" style={{ marginTop: '0.5rem' }}>
          <input 
            list="species-list-typechart" 
            value={defendingSpecies} 
            onChange={handleSpeciesChange} 
            placeholder="Type a Pokémon..."
          />
          {defendingSpecies && (
            <button type="button" className="clear-input-btn" onClick={() => { setDefendingSpecies(''); }} aria-label="Clear">✕</button>
          )}
        </div>
        <datalist id="species-list-typechart">
          {allSpecies.map(s => <option key={s.name} value={s.name} />)}
        </datalist>
      </div>

      <div style={{ marginTop: '32px', padding: '24px', borderRadius: '16px', background: '#ffffff', border: `1px solid ${resultBorder}`, boxShadow: 'var(--surface-1-shadow)' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Result vs {defendingSpecies ? defendingSpecies : p2Types.length > 0 ? p2Types.join('/') : 'None'} 
          <span style={{ display: 'flex', gap: '0.25rem' }}>
            {p2Types.map(t => (
              <span key={t} className="type-chip">{t}</span>
            ))}
          </span>
        </h3>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: resultColor }}>
          {effText}
        </div>
      </div>
      <TypeGrid />
    </div>
  );
};
