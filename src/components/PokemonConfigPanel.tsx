import React from 'react';
import { Dex } from '@pkmn/dex';
import { PokemonConfig } from '../types';
import { allSpecies } from '../data';
import { defaultEVs, defaultBoosts } from '../constants';

const calculateStat = (statName: string, baseStat: number, level: number, iv: number, ev: number, boost: number) => {
  if (baseStat === 0) return 0;

  // Calculate raw stat
  let stat = 0;
  if (statName === 'hp') {
      if (baseStat === 1) return 1; // Shedinja
      stat = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  } else {
      stat = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5;
      // Natures aren't in PokemonConfig currently, so we assume neutral nature.
  }

  // Apply boosts
  if (statName !== 'hp') {
      if (boost > 0) {
          stat = Math.floor(stat * (2 + boost) / 2);
      } else if (boost < 0) {
          stat = Math.floor(stat * 2 / (2 - boost));
      }
  }

  return stat;
};

export const PokemonConfigPanel = ({ title, config, setConfig, isP2, onSave }: { title: string, config: PokemonConfig, setConfig: any, isP2: boolean, onSave?: () => void }) => {
  const speciesInfo = Dex.species.get(config.species);
  const types = speciesInfo?.types || [];
  const baseStats = speciesInfo?.baseStats || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

  const handleSpeciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, species: e.target.value, moves: [] });
  };

  return (
    <div className="builder-panel">
      <h2>{title}</h2>
      <div className="form-group">
        <label>Species & Types</label>
        <div className="species-input-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div className="input-with-clear" style={{ flex: 1, minWidth: '200px' }}>
            <input
              list={`species-list-${isP2 ? 'p2' : 'p1'}`}
              value={config.species}
              onChange={handleSpeciesChange}
              onFocus={() => setConfig({ ...config, species: '', moves: [] })}
              placeholder="Type a Pokémon..."
            />
            {config.species && (
              <button type="button" className="clear-input-btn" onClick={() => setConfig({ ...config, species: '', moves: [] })} aria-label="Clear Pokémon species">✕</button>
            )}
          </div>
          <datalist id={`species-list-${isP2 ? 'p2' : 'p1'}`}>
            {allSpecies.map(s => <option key={s.name} value={s.name} />)}
          </datalist>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {types.map(t => (
              <span key={t} className="type-chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <details style={{ marginBottom: '16px', background: '#f3f4f5', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <summary style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', cursor: 'pointer', userSelect: 'none', fontWeight: 500, letterSpacing: '0.05em' }}>
          Level (Currently: {config.level})
        </summary>
        <div style={{ marginTop: '0.5rem' }}>
          <input type="number" value={config.level} min={1} max={100} onChange={e => setConfig({ ...config, level: parseInt(e.target.value) || 50 })} style={{ width: '100%' }} />
        </div>
      </details>

      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stats (EVs / Boosts)</label>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <div className="stats-grid-header">
          <span style={{ textAlign: 'left' }}>STAT</span><span>BASE</span><span>EV (0-32)</span><span>BOOST (-6 to +6)</span><span>TOTAL</span>
        </div>
        {(Object.keys(config.evs) as Array<keyof typeof config.evs>).map(stat => (
          <div key={stat} className="stat-row">
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{stat}</span>
            <span className="stat-base-badge">{(baseStats as any)[stat]}</span>
            <div className="stat-controls">
              <span className="stat-value">{config.evs[stat]}</span>
              <button
                type="button"
                className={config.evs[stat] > 0 ? "stat-btn clr-btn" : "stat-btn"}
                onClick={() => setConfig({ ...config, evs: { ...config.evs, [stat]: config.evs[stat] > 0 ? 0 : 32 } })}
              >
                {config.evs[stat] > 0 ? 'Clr' : 'Max'}
              </button>
            </div>
            {stat !== 'hp' ? (
              <div className="stat-controls">
                <span className="stat-value">{config.boosts[stat] > 0 ? `+${config.boosts[stat]}` : config.boosts[stat]}</span>
                <button
                  type="button"
                  className="stat-btn"
                  onClick={() => setConfig({ ...config, boosts: { ...config.boosts, [stat]: Math.min(6, config.boosts[stat] + 1) } })}
                >+1</button>
                <button
                  type="button"
                  className="stat-btn"
                  onClick={() => setConfig({ ...config, boosts: { ...config.boosts, [stat]: Math.max(-6, config.boosts[stat] - 1) } })}
                >-1</button>
              </div>
            ) : <div />}
            <span className="stat-total-badge">{calculateStat(stat, (baseStats as any)[stat], config.level, config.ivs[stat], config.evs[stat], stat !== 'hp' ? config.boosts[stat] : 0)}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => setConfig({ ...config, evs: { ...defaultEVs }, boosts: { ...defaultBoosts } })}
          className="stat-btn clr-btn"
          style={{ flex: 1 }}
        >
          Clear All Stats
        </button>
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            style={{ 
              flex: 1, 
              backgroundColor: 'var(--accent)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            Save to Team
          </button>
        )}
      </div>
    </div>
  );
};
