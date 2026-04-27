import React, { useState, useMemo, useEffect } from 'react';
import { Dex } from '@pkmn/dex';
import { calculate, Pokemon, Move } from '@smogon/calc';

// Pre-compute lists for dropdowns
const allSpecies = Array.from(Dex.species.all()).filter(s => s.num > 0);
// Filter out Z-moves, Max moves, etc for simplicity
const allMoves = Array.from(Dex.moves.all()).filter(m => !m.isZ && !m.isMax);
const allTypes = Array.from(Dex.types.all()).filter(t => t.name !== 'Stellar').map(t => t.name);

interface PokemonConfig {
  species: string;
  ivs: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  evs: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  boosts: { atk: number; def: number; spa: number; spd: number; spe: number };
  level: number;
}

const defaultStats = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
const defaultEVs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
const defaultBoosts = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

const defaultP1: PokemonConfig = {
  species: 'Pikachu',
  ivs: { ...defaultStats },
  evs: { ...defaultEVs },
  boosts: { ...defaultBoosts },
  level: 50,
};

const defaultP2: PokemonConfig = {
  species: 'Charizard',
  ivs: { ...defaultStats },
  evs: { ...defaultEVs },
  boosts: { ...defaultBoosts },
  level: 50,
};

const PokemonConfigPanel = ({ title, config, setConfig, isP2 }: { title: string, config: PokemonConfig, setConfig: any, isP2: boolean }) => {
  const speciesInfo = Dex.species.get(config.species);
  const types = speciesInfo?.types || [];
  const baseStats = speciesInfo?.baseStats || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

  const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig({...config, species: e.target.value});
  };

  return (
    <div className="builder-panel">
      <h2>{title} Config</h2>
      <div className="form-group">
        <label>Species & Types</label>
        <div className="species-input-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div className="input-with-clear" style={{ flex: 1, minWidth: '200px' }}>
            <input 
              list={`species-list-${isP2 ? 'p2' : 'p1'}`} 
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', fontSize: '1rem' }} 
              value={config.species} 
              onChange={handleSpeciesChange} 
              placeholder="Type a Pokémon..."
            />
            {config.species && (
              <button type="button" className="clear-input-btn" onClick={() => setConfig({...config, species: ''})} aria-label="Clear">✕</button>
            )}
          </div>
          <datalist id={`species-list-${isP2 ? 'p2' : 'p1'}`}>
            {allSpecies.map(s => <option key={s.name} value={s.name} />)}
          </datalist>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            {types.map(t => (
              <span key={t} style={{ fontSize: '0.85rem', fontWeight: 'bold', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <details style={{ marginBottom: '1rem', background: 'rgba(0,0,0,0.1)', padding: '0.5rem', borderRadius: '4px' }}>
        <summary style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer', userSelect: 'none', fontWeight: 'bold' }}>
          Level (Currently: {config.level})
        </summary>
        <div style={{ marginTop: '0.5rem' }}>
          <input type="number" value={config.level} min={1} max={100} onChange={e => setConfig({...config, level: parseInt(e.target.value) || 50})} style={{ width: '100%' }} />
        </div>
      </details>

      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)'}}>Stats (EVs / Boosts)</label>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <div className="stats-grid-header">
          <span style={{textAlign: 'left'}}>STAT</span><span>BASE</span><span>EV (0-32)</span><span>BOOST (-6 to +6)</span>
        </div>
        {(Object.keys(config.evs) as Array<keyof typeof config.evs>).map(stat => (
          <div key={stat} className="stat-row">
            <span style={{fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold'}}>{stat}</span>
            <span style={{fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-main)', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.4rem', borderRadius: '4px'}}>{(baseStats as any)[stat]}</span>
            <div className="stat-controls">
              <span className="stat-value">{config.evs[stat]}</span>
              <button 
                type="button"
                className={config.evs[stat] > 0 ? "stat-btn clr-btn" : "stat-btn"}
                onClick={() => setConfig({...config, evs: {...config.evs, [stat]: config.evs[stat] > 0 ? 0 : 32}})}
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
                  onClick={() => setConfig({...config, boosts: {...config.boosts, [stat]: Math.min(6, config.boosts[stat] + 1)}})}
                >+1</button>
                <button 
                  type="button"
                  className="stat-btn"
                  onClick={() => setConfig({...config, boosts: {...config.boosts, [stat]: Math.max(-6, config.boosts[stat] - 1)}})}
                >-1</button>
              </div>
            ) : <div />}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setConfig({...config, evs: { ...defaultEVs }, boosts: { ...defaultBoosts }})}
        style={{ width: '100%', marginTop: '1rem', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255, 60, 60, 0.2)', border: '1px solid rgba(255, 60, 60, 0.3)', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', transition: 'background 0.2s' }}
      >
        Clear All Stats
      </button>
    </div>
  );
};

const TypeChartPanel = () => {
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
              style={{ border: '1px solid var(--border)', fontSize: '0.9rem' }}
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
              style={{ border: '1px solid var(--border)', fontSize: '0.9rem' }}
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
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', fontSize: '1rem', width: '100%' }} 
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

      <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${resultBorder}` }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Result vs {defendingSpecies ? defendingSpecies : p2Types.length > 0 ? p2Types.join('/') : 'None'} 
          <span style={{ display: 'flex', gap: '0.25rem' }}>
            {p2Types.map(t => (
              <span key={t} style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{t}</span>
            ))}
          </span>
        </h3>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: resultColor }}>
          {effText}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [p1Config, setP1Config] = useState<PokemonConfig>(defaultP1);
  const [p2Config, setP2Config] = useState<PokemonConfig>(defaultP2);
  const [p1Learnset, setP1Learnset] = useState<string[]>([]);
  const [moveFilter, setMoveFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'calc' | 'types'>('calc');

  useEffect(() => {
    let active = true;
    const fetchLearnset = async () => {
      const speciesInfo = Dex.species.get(p1Config.species);
      if (!speciesInfo) return;
      
      const learnableMoves = new Set<string>();
      
      const getMovesForSpecies = async (speciesId: string) => {
        try {
          const learnset = await Dex.learnsets.get(speciesId);
          if (learnset && learnset.learnset) {
            Object.keys(learnset.learnset).forEach(m => learnableMoves.add(m));
          }
        } catch (e) {
          // Ignore
        }
      };

      await getMovesForSpecies(speciesInfo.id);
      
      if (speciesInfo.baseSpecies && speciesInfo.baseSpecies !== speciesInfo.name) {
        const baseSpeciesInfo = Dex.species.get(speciesInfo.baseSpecies);
        if (baseSpeciesInfo) {
          await getMovesForSpecies(baseSpeciesInfo.id);
        }
      }

      if (!active) return;

      if (learnableMoves.size > 0) {
        setP1Learnset(allMoves.filter(m => learnableMoves.has(m.id)).map(m => m.name));
      } else {
        setP1Learnset(allMoves.map(m => m.name));
      }
    };
    
    fetchLearnset();
    return () => { active = false; };
  }, [p1Config.species]);

  // Compute damage calculations automatically whenever config changes
  const damageResults = useMemo(() => {
    try {
      const p1 = new Pokemon(9, p1Config.species, {
        level: p1Config.level,
        ivs: p1Config.ivs,
        evs: p1Config.evs,
        boosts: p1Config.boosts,
      });

      const p2 = new Pokemon(9, p2Config.species, {
        level: p2Config.level,
        ivs: p2Config.ivs,
        evs: p2Config.evs,
        boosts: p2Config.boosts,
      });

      const p2Types = Dex.species.get(p2Config.species)?.types || [];

      const results = p1Learnset.map(moveName => {
        try {
          const pkmnMove = Dex.moves.get(moveName);
          const move = new Move(9, moveName);
          
          if (move.category === 'Status') return null;

          let effText = "";
          let multiplier = 1;
          
          if (pkmnMove) {
            const isImmune = !Dex.getImmunity(pkmnMove.type, p2Types);
            if (isImmune) {
              multiplier = 0;
            } else {
              const eff = Dex.getEffectiveness(pkmnMove.type, p2Types);
              multiplier = Math.pow(2, eff);
            }
            effText = multiplier === 0 ? "Immune (0x)" : multiplier === 1 ? "Neutral (1x)" : `${multiplier}x Effective`;
          }
          
          if (multiplier === 0) {
            return {
              move: moveName,
              desc: 'Immune',
              context: 'Does not affect the target.',
              damageStr: '0',
              koStr: '',
              eff: effText,
              multiplier,
              maxDamage: 0
            };
          }

          const result = calculate(9, p1, p2, move);
          
          let maxDamage = 0;
          try {
             maxDamage = result.range()[1];
          } catch(e) {
             if (Array.isArray(result.damage)) {
               maxDamage = Math.max(...result.damage);
             } else if (typeof result.damage === 'number') {
               maxDamage = result.damage;
             }
          }

          const fullDesc = result.desc();
          let context = fullDesc;
          let damageStr = "";
          let koStr = "";

          if (fullDesc.includes(':')) {
            const parts = fullDesc.split(':');
            context = parts[0].trim();
            const rest = parts[1].trim();
            
            if (rest.includes(' -- ')) {
              const restParts = rest.split(' -- ');
              damageStr = restParts[0].trim();
              koStr = restParts[1].trim();
            } else {
              damageStr = rest;
            }
          }

          return {
            move: moveName,
            desc: fullDesc,
            context,
            damageStr,
            koStr,
            eff: effText,
            multiplier,
            maxDamage
          };
        } catch (e) {
          return null;
        }
      });
      
      return (results.filter(r => r !== null) as any[]).sort((a, b) => b.maxDamage - a.maxDamage);
    } catch (e) {
      return [];
    }
  }, [p1Config, p2Config, p1Learnset]);


  const displayedResults = moveFilter 
    ? damageResults.filter(r => r.move.toLowerCase().includes(moveFilter.toLowerCase()))
    : damageResults;

  return (
    <div className="app-container" style={{ height: 'auto', minHeight: '90vh' }}>
      <div className="header">
        <h1>VGC Tactical HUD</h1>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'calc' ? 'active' : ''}`} onClick={() => setActiveTab('calc')}>Damage Calculator</button>
        <button className={`tab-btn ${activeTab === 'types' ? 'active' : ''}`} onClick={() => setActiveTab('types')}>Type Chart</button>
      </div>

      {activeTab === 'calc' && (
        <>
          <div className="builder-area">
            <PokemonConfigPanel title="Player 1" config={p1Config} setConfig={setP1Config} isP2={false} />
            <PokemonConfigPanel title="Player 2 (Target)" config={p2Config} setConfig={setP2Config} isP2={true} />
          </div>

          <div className="damage-panel" style={{ marginTop: '1.5rem' }}>
        <div className="damage-panel-header">
          <h2 style={{ margin: 0 }}>P1 Offensive Estimates vs P2</h2>
          <div className="move-filter-container input-with-clear">
            <input 
              type="text" 
              placeholder="Type ahead moves..." 
              value={moveFilter}
              onChange={e => setMoveFilter(e.target.value)}
            />
            {moveFilter && (
              <button type="button" className="clear-input-btn" onClick={() => setMoveFilter('')} aria-label="Clear">✕</button>
            )}
          </div>
        </div>
        <div className="damage-results-grid" style={{ marginTop: '1rem' }}>
          {p1Learnset.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Loading moves...</p>}
          {damageResults.length === 0 && p1Learnset.length > 0 && <p style={{ color: 'var(--text-muted)' }}>No attacking moves found.</p>}
          {displayedResults.map((result, idx) => (
            <div key={idx} className="damage-item" style={{ 
              borderColor: result.multiplier > 1 ? 'var(--hp-green)' : result.multiplier < 1 ? 'var(--hp-red)' : 'var(--border)' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span className="damage-move-name" style={{ fontSize: '1.2rem' }}>{result.move}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {result.koStr && result.koStr.toLowerCase().includes('ohko') && (
                    <span style={{
                      backgroundColor: result.koStr.toLowerCase().includes('guaranteed ohko') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: result.koStr.toLowerCase().includes('guaranteed ohko') ? 'var(--hp-green)' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {result.koStr.toLowerCase().includes('guaranteed ohko') && <span>✅</span>}
                      {result.koStr}
                    </span>
                  )}
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: result.multiplier > 1 ? 'var(--hp-green)' : result.multiplier < 1 && result.multiplier > 0 ? 'var(--hp-yellow)' : result.multiplier === 0 ? 'var(--text-muted)' : 'var(--text-main)',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    {result.eff}
                  </span>
                </div>
              </div>
              
              {result.damageStr ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                    {result.damageStr}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {result.context}
                  </div>
                </div>
              ) : (
                <span className="damage-desc">{result.desc}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      </>
      )}

      {activeTab === 'types' && (
        <TypeChartPanel />
      )}
    </div>
  );
};

export default App;
