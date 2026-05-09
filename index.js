import { useState, useEffect } from 'react';
import Head from 'next/head';

const RANKS = [
  { min: 0,  max: 10,  label: "GHOST",        color: "#445566", emoji: "👻" },
  { min: 10, max: 25,  label: "LURKER",        color: "#556677", emoji: "🌊" },
  { min: 25, max: 40,  label: "OBSERVER",      color: "#4a90d9", emoji: "👀" },
  { min: 40, max: 55,  label: "INITIATE",      color: "#4db8ff", emoji: "⚡" },
  { min: 55, max: 70,  label: "ARCHITECT",     color: "#44ddaa", emoji: "🏗️" },
  { min: 70, max: 85,  label: "CORE BUILDER",  color: "#7b2fff", emoji: "🔮" },
  { min: 85, max: 95,  label: "ARC MAXI",      color: "#f0c060", emoji: "🔥" },
  { min: 95, max: 101, label: "FULLY ARCED",   color: "#ffffff", emoji: "🌐" },
];

const STEPS = [
  "CONNECTING TO X NETWORK...",
  "FETCHING PROFILE DATA...",
  "SCANNING TWEET HISTORY...",
  "SEARCHING ARC MENTIONS...",
  "ANALYZING ENGAGEMENT...",
  "COMPUTING ARC SCORE...",
];

function getRank(score) {
  return RANKS.find(r => score >= r.min && score < r.max) || RANKS[RANKS.length - 1];
}

function TypeWriter() {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setText('ARC'.slice(0, ++i));
      if (i >= 3) { clearInterval(t); setDone(true); }
    }, 200);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ textAlign: 'center', marginBottom: 12 }}>
      <span style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 'clamp(60px,10vw,96px)',
        fontWeight: 900,
        letterSpacing: -4,
        background: 'linear-gradient(130deg,#fff 0%,#4db8ff 45%,#1a8cff 80%,#f0c060 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline',
      }}>{text}</span>
      <span style={{
        display: 'inline-block', width: 5, height: '0.8em',
        background: done ? 'transparent' : '#4db8ff',
        marginLeft: 4, verticalAlign: 'middle', borderRadius: 1,
        animation: 'cblink 0.8s step-end infinite',
      }} />
    </div>
  );
}

function ScoreRing({ score, happy }) {
  const r = 100;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    setTimeout(() => setOffset(circ - (score / 100) * circ), 120);
    const dur = 2200, start = performance.now();
    const tick = (ts) => {
      const p = Math.min((ts - start) / dur, 1);
      setDisplayed(Math.round((1 - Math.pow(1 - p, 3)) * score));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div style={{ position: 'relative', width: 240, height: 240, margin: '0 auto 28px' }}>
      <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#4db8ff', borderRightColor: 'rgba(77,184,255,.22)', animation: 'roll 3.5s linear infinite', boxShadow: '0 0 18px rgba(26,140,255,.25)' }} />
      <div style={{ position: 'absolute', inset: -28, borderRadius: '50%', border: '1.5px solid transparent', borderBottomColor: '#f0c060', borderLeftColor: 'rgba(240,192,96,.18)', animation: 'roll 6.5s linear infinite reverse' }} />
      <div style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: '#4db8ff', top: -21, left: 'calc(50% - 5px)', transformOrigin: '5px 141px', boxShadow: '0 0 16px #4db8ff', animation: 'roll 3.5s linear infinite' }} />
      <div style={{ position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: '#f0c060', bottom: -35, left: 'calc(50% - 3.5px)', transformOrigin: '3.5px -113px', boxShadow: '0 0 12px #f0c060', animation: 'roll 6.5s linear infinite reverse' }} />
      <svg style={{ transform: 'rotate(-90deg)', width: 240, height: 240 }} viewBox="0 0 240 240">
        <defs>
          <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a8cff" />
            <stop offset="100%" stopColor="#4db8ff" />
          </linearGradient>
          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a6080" />
            <stop offset="100%" stopColor="#7088aa" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r={r} fill="none" stroke="rgba(26,140,255,0.07)" strokeWidth="10" />
        <circle cx="120" cy="120" r={r} fill="none"
          stroke={happy ? 'url(#hg)' : 'url(#sg)'}
          strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 2.5s cubic-bezier(.2,.8,.2,1)',
            filter: happy ? 'drop-shadow(0 0 9px rgba(77,184,255,.9))' : 'drop-shadow(0 0 7px rgba(112,136,170,.7))',
          }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 2 }}>{happy ? '🎉' : '😢'}</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1, textShadow: '0 0 40px rgba(77,184,255,.7)' }}>{displayed}%</div>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#4db8ff', letterSpacing: 4, marginTop: 3 }}>ARCED</div>
      </div>
    </div>
  );
}

function StatCard({ label, tag, val, max, color, suffix, delay }) {
  const [w, setW] = useState(0);
  const pct = max > 0 ? Math.min(100, (val / max) * 100) : 0;
  useEffect(() => { setTimeout(() => setW(pct), 300 + delay * 150); }, [pct]);
  return (
    <div style={{ background: 'rgba(4,30,56,0.72)', border: '1px solid rgba(26,140,255,0.18)', borderLeft: `2px solid ${color}`, borderRadius: 8, padding: 20, backdropFilter: 'blur(12px)' }}>
      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6, color, opacity: .38 }}>{tag}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#d6eeff', marginBottom: 12 }}>{label}</div>
      <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginBottom: 7 }}>
        <div style={{ height: '100%', borderRadius: 2, width: `${w}%`, background: `linear-gradient(90deg,${color}88,${color})`, transition: 'width 2s cubic-bezier(.2,.8,.2,1)' }} />
      </div>
      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, opacity: .28 }}>{val}{suffix || ''}</div>
    </div>
  );
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);

  async function handleScan() {
    const clean = username.replace('@', '').trim();
    if (!clean) { setError('Enter a username'); return; }
    setError('');
    setResult(null);
    setLoading(true);
    setStep(0);
    const si = setInterval(() => setStep(s => s < STEPS.length - 1 ? s + 1 : s), 1800);
    try {
      const res = await fetch(`/api/scan?username=${encodeURIComponent(clean)}`);
      const data = await res.json();
      clearInterval(si);
      if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return; }
      setResult(data);
    } catch (e) {
      clearInterval(si);
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }

  const rank = result ? getRank(result.analysis.score) : null;
  const happy = result ? result.analysis.score >= 30 : false;

  return (
    <>
      <Head>
        <title>ARCED — How deep are you in Arc?</title>
        <meta name="description" content="Find out how arced you are based on real X engagement" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        @keyframes roll { to { transform: rotate(360deg); } }
        @keyframes cblink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fdown { from{opacity:0;transform:translateY(-28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fup { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.18} }
        @keyframes cMove { 0%{transform:translate(0,0)} 100%{transform:translate(25px,-18px)} }
        @keyframes gd { to{transform:translateY(48px)} }
        @keyframes bshift { 0%{background-position:0%} 100%{background-position:200%} }
        .sbtn:hover { transform:translateY(-2px)!important; box-shadow:0 10px 30px rgba(26,140,255,.38)!important; }
        .sbtn:disabled { opacity:.6!important; cursor:not-allowed!important; transform:none!important; }
        .share-btn:hover { background:#4db8ff!important; color:#010c18!important; }
        input:focus { outline:none; border-color:#4db8ff!important; box-shadow:0 0 0 2px rgba(26,140,255,.14)!important; }
        @media(max-width:540px) {
          .sgrid { grid-template-columns:1fr!important; }
          .irow { flex-direction:column!important; }
          .sbtn { width:100%!important; }
        }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse 90% 70% at 15% 0%,rgba(10,56,104,.85) 0%,transparent 60%),radial-gradient(ellipse 70% 90% at 85% 100%,rgba(4,30,56,.9) 0%,transparent 60%),radial-gradient(ellipse 100% 100% at 50% 50%,#021428 0%,#010c18 100%)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: .06, background: 'radial-gradient(ellipse 280px 90px at 28% 18%,#1a8cff,transparent),radial-gradient(ellipse 350px 110px at 72% 65%,#4db8ff,transparent)', animation: 'cMove 14s ease-in-out infinite alternate' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: .03, backgroundImage: 'linear-gradient(#1a8cff 1px,transparent 1px),linear-gradient(90deg,#1a8cff 1px,transparent 1px)', backgroundSize: '48px 48px', animation: 'gd 28s linear infinite' }} />

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '44px 20px 100px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52, animation: 'fdown .9s ease both' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, letterSpacing: 5, color: '#1a8cff', textTransform: 'uppercase', marginBottom: 20, opacity: .65 }}>
            // arc network — architect scanner v2.0
          </div>

          {/* Logo orbit */}
          <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 28px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#4db8ff', borderRightColor: 'rgba(77,184,255,.25)', animation: 'roll 2.8s linear infinite', boxShadow: '0 0 22px rgba(26,140,255,.28)' }} />
            <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', border: '1.5px solid transparent', borderBottomColor: '#f0c060', borderLeftColor: 'rgba(240,192,96,.2)', animation: 'roll 5.2s linear infinite reverse' }} />
            <div style={{ position: 'absolute', inset: 22, borderRadius: '50%', border: '1px dashed rgba(77,184,255,.08)', animation: 'roll 16s linear infinite' }} />
            <div style={{ position: 'absolute', width: 9, height: 9, borderRadius: '50%', background: '#4db8ff', top: -4, left: 'calc(50% - 4.5px)', transformOrigin: '4.5px 80px', boxShadow: '0 0 14px #4db8ff', animation: 'roll 2.8s linear infinite' }} />
            <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: '#f0c060', top: 12, left: 'calc(50% - 3px)', transformOrigin: '3px 68px', boxShadow: '0 0 10px #f0c060', animation: 'roll 5.2s linear infinite reverse' }} />
            <div style={{ position: 'absolute', inset: 26, borderRadius: '50%', background: 'linear-gradient(145deg,rgba(10,56,104,.92),rgba(4,30,56,.96))', border: '1.5px solid rgba(26,140,255,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 40px rgba(26,140,255,.18),inset 0 0 28px rgba(26,140,255,.06)' }}>
              <img src="/arc-logo.jpg" alt="Arc" style={{ width: 66, height: 66, objectFit: 'contain', borderRadius: '50%', filter: 'drop-shadow(0 0 10px rgba(77,184,255,.6)) brightness(1.1)' }} />
            </div>
          </div>

          <TypeWriter />
          <div style={{ fontSize: 15, fontWeight: 300, color: 'rgba(168,216,255,.42)', letterSpacing: .5 }}>
            Enter your X handle — see exactly how engaged you are with Arc.
          </div>
        </div>

        {/* Input */}
        <div style={{ background: 'rgba(4,30,56,0.72)', border: '1px solid rgba(26,140,255,0.18)', borderRadius: 8, padding: 28, marginBottom: 16, position: 'relative', overflow: 'hidden', backdropFilter: 'blur(12px)', animation: 'fup .9s ease .2s both' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,#1a8cff,#4db8ff,transparent)', animation: 'pulse 4s ease infinite' }} />
          <label style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, letterSpacing: 4, color: '#4db8ff', textTransform: 'uppercase', marginBottom: 14, display: 'block', opacity: .65 }}>
            // enter your x username
          </label>
          <div className="irow" style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 22, fontWeight: 700, color: '#1a8cff', display: 'flex', alignItems: 'center', opacity: .5 }}>@</div>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScan()}
              placeholder="yourhandle"
              style={{ flex: 1, background: 'rgba(26,140,255,.06)', border: '1px solid rgba(26,140,255,.22)', borderRadius: 4, padding: '15px 20px', color: '#d6eeff', fontFamily: 'Space Mono, monospace', fontSize: 15, letterSpacing: 1 }}
            />
            <button
              className="sbtn"
              onClick={handleScan}
              disabled={loading}
              style={{ background: 'linear-gradient(135deg,#1a8cff,#4db8ff)', border: 'none', borderRadius: 4, padding: '15px 32px', color: '#010c18', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: 2, cursor: 'pointer', transition: 'all .3s', textTransform: 'uppercase' }}
            >
              {loading ? '...' : 'SCAN'}
            </button>
          </div>
          {error && (
            <div style={{ marginTop: 10, background: 'rgba(255,60,60,.07)', border: '1px solid rgba(255,60,60,.25)', borderRadius: 4, padding: '10px 16px', fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#ff8080' }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding: '52px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, letterSpacing: 3, color: '#4db8ff', textTransform: 'uppercase', animation: 'pulse 1.1s ease infinite', marginBottom: 22 }}>
              {STEPS[step]}
            </div>
            <div style={{ height: 3, background: 'rgba(26,140,255,.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${((step + 1) / STEPS.length) * 95}%`, background: 'linear-gradient(90deg,#1a8cff,#4db8ff,#1a8cff)', backgroundSize: '200% 100%', borderRadius: 2, boxShadow: '0 0 12px #4db8ff', transition: 'width .6s ease', animation: 'bshift 1.5s linear infinite' }} />
            </div>
            <div style={{ marginTop: 24, textAlign: 'left' }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: i < step ? '#4db8ff' : i === step ? '#d6eeff' : 'rgba(168,216,255,.22)', padding: '5px 0', display: 'flex', alignItems: 'center', gap: 10, transition: 'color .4s' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0, boxShadow: i === step ? '0 0 8px currentColor' : 'none', animation: i === step ? 'pulse .8s ease infinite' : 'none' }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div style={{ animation: 'fup .7s ease both' }}>

            {/* Profile bar */}
            <div style={{ background: 'rgba(4,30,56,0.72)', border: '1px solid rgba(26,140,255,0.18)', borderRadius: 8, padding: '20px 24px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 16, backdropFilter: 'blur(12px)', flexWrap: 'wrap' }}>
              {result.user.avatar && (
                <img src={result.user.avatar} alt={result.user.name} style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid rgba(26,140,255,.3)' }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 17, color: '#d6eeff' }}>{result.user.name}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'rgba(77,184,255,.55)', letterSpacing: 2 }}>@{result.user.username}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, color: 'rgba(168,216,255,.4)', fontFamily: 'Space Mono, monospace', lineHeight: 1.8 }}>
                <div>{result.user.followers?.toLocaleString()} followers</div>
                <div>{result.user.tweets?.toLocaleString()} tweets</div>
              </div>
            </div>

            {/* Score hero */}
            <div style={{ background: 'rgba(4,30,56,0.72)', border: '1px solid rgba(26,140,255,0.18)', borderRadius: 8, padding: '44px 28px 38px', marginBottom: 14, textAlign: 'center', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% -10%,rgba(26,140,255,.1) 0%,transparent 65%)', pointerEvents: 'none' }} />
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, letterSpacing: 4, color: 'rgba(77,184,255,.5)', marginBottom: 28 }}>
                @{result.user.username}
              </div>
              <ScoreRing score={result.analysis.score} happy={happy} />
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: 3, padding: '7px 24px', borderRadius: 3, textTransform: 'uppercase', marginBottom: 14, background: `${rank.color}22`, color: rank.color, border: `1px solid ${rank.color}55` }}>
                {rank.emoji} {rank.label}
              </div>
              <br />
              <div style={{ fontSize: 15, color: 'rgba(214,238,255,.42)', fontWeight: 300, maxWidth: 420, margin: '0 auto', lineHeight: 1.65 }}>
                {happy
                  ? '🎉 Congrats! You are genuinely engaged with Arc. Keep building!'
                  : '😢 Not much Arc engagement found. Time to dive into the ecosystem!'}
              </div>
            </div>

            {/* Stats */}
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, letterSpacing: 4, color: '#4db8ff', textTransform: 'uppercase', marginBottom: 12, opacity: .45 }}>
              // engagement breakdown
            </div>
            <div className="sgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <StatCard label="Arc Tweets Found" tag="TOTAL" val={result.analysis.arcMatches} max={Math.max(result.analysis.totalTweets, 1)} color="#4db8ff" delay={0} />
              <StatCard label="Engagement Rate" tag="RATE" val={parseFloat(result.analysis.engagementRate)} max={100} color="#f0c060" suffix="%" delay={1} />
              <StatCard label="Replies to Arc" tag="REPLIES" val={result.analysis.replyCount} max={Math.max(result.analysis.arcMatches, 1)} color="#44ddaa" delay={2} />
              <StatCard label="Retweets of Arc" tag="RTs" val={result.analysis.retweetCount} max={Math.max(result.analysis.arcMatches, 1)} color="#cc88ff" delay={3} />
            </div>

            {/* Matched tweets */}
            {result.analysis.matchedTweets?.length > 0 && (
              <>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, letterSpacing: 4, color: '#4db8ff', textTransform: 'uppercase', marginBottom: 12, opacity: .45 }}>
                  // arc-related tweets
                </div>
                {result.analysis.matchedTweets.map((t, i) => (
                  <div key={i} style={{ background: 'rgba(4,30,56,0.6)', border: '1px solid rgba(26,140,255,.14)', borderLeft: '2px solid #4db8ff', borderRadius: 8, padding: '14px 16px', marginBottom: 10 }}>
                    <p style={{ fontSize: 14, color: '#a8d8ff', lineHeight: 1.55, marginBottom: 8 }}>{t.text}</p>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'rgba(168,216,255,.35)', fontFamily: 'Space Mono, monospace' }}>
                      <span>❤️ {t.public_metrics?.like_count || 0}</span>
                      <span>🔁 {t.public_metrics?.retweet_count || 0}</span>
                      <span>💬 {t.public_metrics?.reply_count || 0}</span>
                      {t.created_at && <span>{new Date(t.created_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* No tweets */}
            {result.analysis.arcMatches === 0 && (
              <div style={{ background: 'rgba(4,30,56,0.72)', border: '1px solid rgba(26,140,255,0.18)', borderRadius: 8, padding: 24, textAlign: 'center', color: 'rgba(168,216,255,.4)', fontSize: 14, marginBottom: 14 }}>
                😢 No Arc-related tweets found. Start engaging with @arc_network to boost your score!
              </div>
            )}

            {/* Share */}
            <div style={{ background: 'rgba(4,30,56,0.72)', border: '1px solid rgba(26,140,255,0.18)', borderRadius: 8, padding: 26, textAlign: 'center', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 3, color: '#4db8ff', marginBottom: 18 }}>
                // BROADCAST YOUR ARC STATUS
              </div>
              <button
                className="share-btn"
                onClick={() => {
                  const emoji = happy ? '🎉' : '😢';
                  const txt = `I just checked my Arc status ${emoji}\n\nI'm ${result.analysis.score}% ARCED on @arc_network\n\n${result.analysis.arcMatches} Arc engagements found!\n\nCheck yours 👇`;
                  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(txt), '_blank');
                }}
                style={{ background: 'transparent', border: '1.5px solid #4db8ff', borderRadius: 4, padding: '13px 32px', color: '#4db8ff', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 2, cursor: 'pointer', transition: 'all .3s', textTransform: 'uppercase' }}
              >
                SHARE ON X →
              </button>
            </div>

          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 56, fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(26,140,255,.18)', letterSpacing: 3 }}>
          ARC NETWORK — ARCHITECTS PROGRAM — COMMUNITY TOOL
        </div>

      </main>
    </>
  );
}
