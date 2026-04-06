import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const EVENT_TYPES = ['Wedding Reception','Club Night','House Party','Birthday Party','Corporate Event','Bar / Lounge','Rooftop / Outdoor','Festival'];
const VIBES = ['High Energy','Chill & Smooth','Dark & Moody','Feel Good','Emotional Journey','Party Starter'];
const GENRES = ['Hip-Hop','R&B','Afrobeats','Amapiano','House','Techno','Pop / Top 40','Reggaeton','Latin','Funk / Soul','Drum & Bass','80s / 90s'];

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    event: '', vibe: '', duration: '60', crowdAge: '25–35',
    genres: [], bpmStart: '95', bpmPeak: '128',
    mustPlay: '', avoid: '', level: 'pro'
  });

  const toggleGenre = (g) => setForm(f => ({
    ...f,
    genres: f.genres.includes(g) ? f.genres.filter(x => x !== g) : [...f.genres, g]
  }));

  const generate = async () => {
    setLoading(true);
    setStep(3);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResult(data);
      setStep(4);
    } catch (e) {
      setResult({ error: true });
      setStep(4);
    }
    setLoading(false);
  };

  const reset = () => {
    setStep(1); setResult(null);
    setForm({ event:'', vibe:'', duration:'60', crowdAge:'25–35', genres:[], bpmStart:'95', bpmPeak:'128', mustPlay:'', avoid:'', level:'pro' });
  };

  const copyPlan = () => {
    if (!result) return;
    let text = `SETFORGE — ${form.event} | ${form.duration} min | ${form.vibe}\nBPM: ${form.bpmStart}–${form.bpmPeak} | Genres: ${form.genres.join(', ')}\n\n`;
    text += `OVERVIEW\n${result.overview}\n\nPHASES\n`;
    result.phases?.forEach(p => {
      text += `\n${p.name} | ${p.time} | ${p.bpm} BPM | Energy ${p.energy}/9\n`;
      p.tracks?.forEach((t, i) => text += `  ${i+1}. ${t}\n`);
      if (p.notes) text += `  Note: ${p.notes}\n`;
    });
    text += `\nTRANSITIONS\n`;
    result.transitions?.forEach(t => text += `  > ${t.moment}\n    Technique: ${t.technique}\n`);
    text += `\nEMERGENCY TRACKS\n`;
    result.emergency?.forEach(e => text += `  > ${e}\n`);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const energyDots = (n) => Array.from({length: 9}, (_, i) => (
    <span key={i} className={`${styles.dot} ${i < n ? styles.dotOn : ''}`} />
  ));

  return (
    <>
      <Head>
        <title>SetForge — AI DJ Set Planner</title>
        <meta name="description" content="Generate professional DJ set plans in seconds." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.app}>
        <div className={styles.container}>

          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logomark}>🎧</div>
            <div>
              <div className={styles.logotype}>SetForge</div>
              <div className={styles.logoSub}>AI DJ set planner</div>
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h1 className={styles.title}>Build your set</h1>
              <p className={styles.hint}>Tell us about the gig.</p>

              <div className={styles.section}>
                <div className={styles.label}>Event type</div>
                <div className={styles.chipGrid}>
                  {EVENT_TYPES.map(e => (
                    <button key={e} className={`${styles.chip} ${form.event === e ? styles.chipOn : ''}`} onClick={() => setForm(f => ({...f, event: e}))}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.label}>Vibe</div>
                <div className={styles.chipGrid}>
                  {VIBES.map(v => (
                    <button key={v} className={`${styles.chip} ${form.vibe === v ? styles.chipOn : ''}`} onClick={() => setForm(f => ({...f, vibe: v}))}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.row2}>
                <div>
                  <div className={styles.label}>Duration (min)</div>
                  <input className={styles.input} type="number" value={form.duration} onChange={e => setForm(f => ({...f, duration: e.target.value}))} />
                </div>
                <div>
                  <div className={styles.label}>Crowd age range</div>
                  <input className={styles.input} value={form.crowdAge} onChange={e => setForm(f => ({...f, crowdAge: e.target.value}))} />
                </div>
              </div>

              <button className={styles.btn} disabled={!form.event || !form.vibe} onClick={() => setStep(2)}>
                Next: Music →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h1 className={styles.title}>Define your sound</h1>
              <p className={styles.hint}>Genres, BPM and must-plays.</p>

              <div className={styles.section}>
                <div className={styles.label}>Genres</div>
                <div className={styles.chipGrid}>
                  {GENRES.map(g => (
                    <button key={g} className={`${styles.chip} ${form.genres.includes(g) ? styles.chipOn : ''}`} onClick={() => toggleGenre(g)}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.row2}>
                <div>
                  <div className={styles.label}>Opening BPM</div>
                  <input className={styles.input} type="number" value={form.bpmStart} onChange={e => setForm(f => ({...f, bpmStart: e.target.value}))} />
                </div>
                <div>
                  <div className={styles.label}>Peak BPM</div>
                  <input className={styles.input} type="number" value={form.bpmPeak} onChange={e => setForm(f => ({...f, bpmPeak: e.target.value}))} />
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.label}>Must-play artists or tracks</div>
                <input className={styles.input} value={form.mustPlay} onChange={e => setForm(f => ({...f, mustPlay: e.target.value}))} placeholder="e.g. Drake, Burna Boy, Beyoncé…" />
              </div>

              <div className={styles.section}>
                <div className={styles.label}>Avoid</div>
                <input className={styles.input} value={form.avoid} onChange={e => setForm(f => ({...f, avoid: e.target.value}))} placeholder="e.g. no country, no slow jams…" />
              </div>

              <div className={styles.toggleWrap}>
                <span className={styles.toggleLabel}>DJ experience level</span>
                <div className={styles.toggleOpts}>
                  <button className={`${styles.toggleOpt} ${form.level === 'novice' ? styles.toggleOn : ''}`} onClick={() => setForm(f => ({...f, level: 'novice'}))}>Novice</button>
                  <button className={`${styles.toggleOpt} ${form.level === 'pro' ? styles.toggleOn : ''}`} onClick={() => setForm(f => ({...f, level: 'pro'}))}>Pro</button>
                </div>
              </div>

              <button className={styles.btn} disabled={form.genres.length === 0} onClick={generate}>
                Generate set plan
              </button>
              <button className={styles.btnGhost} onClick={() => setStep(1)}>← Back</button>
            </div>
          )}

          {/* LOADING */}
          {step === 3 && (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Building your set plan…</p>
            </div>
          )}

          {/* RESULT */}
          {step === 4 && result && !result.error && (
            <div>
              <div className={styles.metaRow}>
                <span className={`${styles.metaTag} ${styles.metaHot}`}>{form.vibe}</span>
                <span className={styles.metaTag}>{form.event}</span>
                <span className={styles.metaTag}>{form.duration} min</span>
                <span className={styles.metaTag}>{form.bpmStart}–{form.bpmPeak} BPM</span>
                {form.genres.slice(0,3).map(g => <span key={g} className={styles.metaTag}>{g}</span>)}
              </div>

              <div className={styles.actions}>
                <button className={styles.actCopy} onClick={copyPlan}>{copied ? 'Copied!' : 'Copy plan'}</button>
                <button className={styles.actNew} onClick={reset}>New set</button>
              </div>

              <div className={styles.card}>
                <div className={styles.cardLabel}>Set overview</div>
                <p className={styles.overview}>{result.overview}</p>
              </div>

              <div className={styles.card}>
                <div className={styles.cardLabel}>Phases</div>
                {result.phases?.map((p, i) => (
                  <div key={i} className={styles.phaseRow}>
                    <div className={styles.phaseMeta}>
                      <div className={styles.phaseName}>{p.name}</div>
                      <div>{p.time}</div>
                      <div>{p.bpm} BPM</div>
                      <div>{p.genre}</div>
                      <div className={styles.energyBar}>{energyDots(p.energy)}</div>
                    </div>
                    <div className={styles.phaseTracks}>
                      {p.tracks?.map((t, j) => (
                        <div key={j} className={styles.trackLine}>
                          <span className={styles.trackNum}>{j+1}</span>
                          <span>{t}</span>
                        </div>
                      ))}
                      {p.notes && <div className={styles.phaseNote}>{p.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.card}>
                <div className={styles.cardLabel}>Key transitions</div>
                {result.transitions?.map((t, i) => (
                  <div key={i} className={styles.transRow}>
                    <div className={styles.transArrow}>▶</div>
                    <div>
                      <div className={styles.transMoment}>{t.moment}</div>
                      <div className={styles.transTech}>{t.technique}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.card}>
                <div className={styles.cardLabel}>Emergency tracks</div>
                {result.emergency?.map((t, i) => (
                  <div key={i} className={styles.emergRow}>
                    <span className={styles.transArrow}>▶</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              <div className={styles.upsell}>
                <div className={styles.upsellTitle}>SetForge Pro</div>
                <p className={styles.upsellText}>Unlimited sets · save history · PDF export · Spotify playlist sync</p>
                <button className={styles.btn} style={{marginTop: '0.5rem'}}>Upgrade — $12/mo</button>
              </div>
            </div>
          )}

          {step === 4 && result?.error && (
            <div>
              <p style={{color:'#888', fontSize:'14px', marginBottom:'1rem'}}>Something went wrong. Please try again.</p>
              <button className={styles.btn} onClick={reset}>Start over</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
