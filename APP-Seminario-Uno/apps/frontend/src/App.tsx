import { useEffect, useRef, useState } from 'react';
import { CircleHelp, GraduationCap, Info, Languages, Settings, Sprout, Users } from 'lucide-react';
import { audioConfig, defaults, limits, messages, storageKeys, themes } from './config';
import type { GameSettings } from './config';

type Progress = { seedlings: number; trees: number; elapsed: number };
const load = <T,>(key: string, fallback: T): T => { try { return { ...fallback, ...JSON.parse(localStorage.getItem(key) ?? '{}') }; } catch { return fallback; } };
const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export function App() {
  const [settings, setSettings] = useState(() => { const saved = load(storageKeys.settings, defaults); const language = location.hash.split('/')[0].replace('#',''); return { ...saved, language: language === 'en' || language === 'zh' ? language : saved.language }; });
  const [draft, setDraft] = useState<GameSettings>(settings);
  const [progress, setProgress] = useState<Progress>(() => load(storageKeys.progress, { seedlings: 0, trees: 0, elapsed: 0 }));
  const [running, setRunning] = useState(false); const [level, setLevel] = useState(0); const [quietSeconds, setQuietSeconds] = useState(0); const [error, setError] = useState(''); const [activeTab, setActiveTab] = useState<'game' | 'about' | 'faq' | 'settings'>(() => { const route = location.hash.split('/')[1]; return route === 'about' || route === 'settings' || route === 'faq' || route === 'faqs' ? (route === 'faqs' ? 'faq' : route) : 'game'; });
  const audioRef = useRef<{ context: AudioContext; stream: MediaStream; frame: number } | undefined>(undefined);
  const t = messages[settings.language]; const isQuiet = running && level <= settings.noiseThreshold;

  useEffect(() => { document.documentElement.lang = settings.language; localStorage.setItem(storageKeys.settings, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { const route = activeTab === 'faq' ? 'faqs' : activeTab; history.replaceState(null,'',`${location.pathname}${location.search}#${settings.language}/${route}`); document.title = `${messages[settings.language][`${activeTab}Tab` as 'gameTab']} · 安静森林`; }, [activeTab, settings.language]);
  useEffect(() => { localStorage.setItem(storageKeys.progress, JSON.stringify(progress)); }, [progress]);
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => { setProgress(p => ({ ...p, elapsed: p.elapsed + 1 })); setQuietSeconds(q => isQuiet ? q + 1 : 0); }, 1000); return () => clearInterval(timer); }, [running, isQuiet]);
  useEffect(() => { const multiplier = settings.quietTimeUnit === 'seconds' ? 1 : settings.quietTimeUnit === 'hours' ? 3600 : 60; if (quietSeconds < settings.quietDurationSeconds * multiplier) return; setQuietSeconds(0); setProgress(p => { const total = p.seedlings + 1; return total >= settings.seedlingsPerTree ? { ...p, seedlings: 0, trees: p.trees + 1 } : { ...p, seedlings: total }; }); }, [quietSeconds, settings]);
  useEffect(() => () => stopAudio(), []);

  async function start() {
    setError('');
    if (audioRef.current) { setRunning(true); return; }
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext(); const source = context.createMediaStreamSource(stream); const analyser = context.createAnalyser(); analyser.fftSize = audioConfig.fftSize; analyser.smoothingTimeConstant = audioConfig.smoothingTimeConstant; source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount); let last = 0;
      const sample = (now: number) => { if (now - last >= audioConfig.sampleIntervalMs) { analyser.getByteFrequencyData(data); const average = data.reduce((sum, value) => sum + value, 0) / data.length; setLevel(Math.min(100, Math.round((average / 128) * 100))); last = now; } const frame = requestAnimationFrame(sample); if (audioRef.current) audioRef.current.frame = frame; };
      audioRef.current = { context, stream, frame: requestAnimationFrame(sample) }; setRunning(true);
    } catch { setError(t.micError); setRunning(false); }
  }
  function stopAudio() { const audio = audioRef.current; if (!audio) return; cancelAnimationFrame(audio.frame); audio.stream.getTracks().forEach(track => track.stop()); void audio.context.close(); audioRef.current = undefined; }
  function reset() { setRunning(false); setQuietSeconds(0); setProgress({ seedlings: 0, trees: 0, elapsed: 0 }); }
  function saveSettings() { setSettings(draft); setActiveTab('game'); }
  const status = !running ? t.waiting : isQuiet ? t.quiet : t.loud;
  const toggleLanguage = () => setSettings(current => ({ ...current, language: current.language === 'zh' ? 'en' : 'zh' }));
  const unitMultiplier = settings.studyTimeUnit === 'seconds' ? 1 : settings.studyTimeUnit === 'hours' ? 3600 : 60;
  const studySeconds = settings.studyMinutes * unitMultiplier;
  const goalMet = progress.trees >= settings.targetTrees;
  const timeIsUp = progress.elapsed >= studySeconds;
  const discipline = settings.language === 'zh'
    ? { title: '课堂纪律模式', positive: '🌿 正向激励', balanced: '⚖️ 平衡管理', strict: '🛡️ 严格纪律', duration: '活动时长', seconds: '秒', minutes: '分钟', hours: '小时' }
    : { title: 'Class discipline mode', positive: '🌿 Positive', balanced: '⚖️ Balanced', strict: '🛡️ Strict', duration: 'Activity duration', seconds: 'Seconds', minutes: 'Minutes', hours: 'Hours' };
  const durationRange = draft.studyTimeUnit === 'seconds' ? { min: 10, max: 3600 } : draft.studyTimeUnit === 'hours' ? { min: 1, max: 8 } : limits.studyMinutes;
  const quietDurationRange = draft.quietTimeUnit === 'seconds' ? { min: 1, max: 3600 } : draft.quietTimeUnit === 'hours' ? { min: 1, max: 8 } : { min: 1, max: 180 };
  const quietTargetSeconds = settings.quietDurationSeconds * (settings.quietTimeUnit === 'seconds' ? 1 : settings.quietTimeUnit === 'hours' ? 3600 : 60);

  return <div className="app" data-theme={settings.theme} data-language={settings.language}>
    <aside className="seminar-banner"><div className="seminar-icon" aria-hidden="true"><GraduationCap/></div><div className="seminar-copy"><span>{settings.language === 'zh' ? '国际学术培训 · 第一阶段' : 'International Academic Training · Phase 1'}</span><strong>{t.seminar}</strong><small>📅 {t.seminarDates}</small></div></aside>
    <nav className="tab-bar" aria-label={settings.language === 'zh' ? '主导航' : 'Main navigation'}>
      <button title={t.gameInfo} className={activeTab === 'game' ? 'active' : ''} aria-current={activeTab === 'game' ? 'page' : undefined} onClick={() => setActiveTab('game')}><Sprout/><span>{t.gameTab}</span><Info className="nav-info"/></button>
      <button title={t.aboutInfo} className={activeTab === 'about' ? 'active' : ''} aria-current={activeTab === 'about' ? 'page' : undefined} onClick={() => setActiveTab('about')}><Users/><span>{t.aboutTab}</span><Info className="nav-info"/></button>
      <button title={t.faqInfo} className={activeTab === 'faq' ? 'active' : ''} aria-current={activeTab === 'faq' ? 'page' : undefined} onClick={() => setActiveTab('faq')}><CircleHelp/><span>{t.faqTab}</span><Info className="nav-info"/></button>
      <button title={t.settingsInfo} className={activeTab === 'settings' ? 'active' : ''} aria-current={activeTab === 'settings' ? 'page' : undefined} onClick={() => { setDraft(settings); setActiveTab('settings'); }}><Settings/><span>{t.settingsTab}</span><Info className="nav-info"/></button>
      <button onClick={toggleLanguage} aria-label={t.changeLanguage} title={t.languageInfo}><Languages/><span>{settings.language === 'zh' ? 'EN' : '中文'}</span><Info className="nav-info"/></button>
    </nav>

    {activeTab === 'about' && <section className="about-cover tab-panel" aria-labelledby="about-title">
      <p className="eyebrow">{t.project}</p><h2 id="about-title">{t.about}</h2><p className="about-intro">{t.team}</p>
      <div className="team-grid"><article><span aria-hidden="true">👨‍🏫 01</span><h3>Mtro. Wilson Suarez</h3><p>UASD</p></article><article><span aria-hidden="true">👨‍💻 02</span><h3>Ing. Jorge Luis Pimentel</h3><p>APEC</p></article><article><span aria-hidden="true">👩‍💻 03</span><h3>Mtra. Marlenis Judith Concepcion Cuevas</h3><p>SDET · UASD</p></article></div>
      <button className="primary cover-link" onClick={() => setActiveTab('game')}>{t.enter} →</button>
    </section>}

    {activeTab === 'game' && <div className="tab-panel"><header><div><span className="eyebrow">CLASSROOM FOCUS LAB</span><h1>{t.title}</h1><p>{t.subtitle}</p></div></header><main>
      <section className="how-to" aria-labelledby="help-title"><h2 id="help-title">❔ {t.help}</h2><ol><li><span aria-hidden="true">🎙️</span><b>1</b><p>{t.stepMic}</p></li><li><span aria-hidden="true">🤫</span><b>2</b><p>{t.stepQuiet}</p></li><li><span aria-hidden="true">🌱</span><b>3</b><p>{t.stepGrow}</p></li></ol></section>
      {error && <div className="alert" role="alert">⚠ {error}</div>}
      <section className={`class-goal ${goalMet ? 'met' : timeIsUp ? 'missed' : ''}`} data-discipline={settings.disciplineMode} aria-live="polite"><div><span aria-hidden="true">🎯</span><strong>{t.classGoal}</strong><small className="discipline-badge">{discipline[settings.disciplineMode]}</small><p>🌳 {progress.trees} / {settings.targetTrees} · ⏱️ {formatTime(Math.min(progress.elapsed, studySeconds))} / {formatTime(studySeconds)}</p></div><b>{goalMet ? `✅ ${t.goalMet}` : timeIsUp ? `⚠️ ${t.goalMissed}` : `⌛ ${t.goalPending}`}</b>{timeIsUp && !goalMet && settings.consequenceEnabled && <p className="consequence">📣 {settings.consequenceText}</p>}</section>
      <section className="hero" aria-labelledby="sound-title"><div><span className={`status ${isQuiet ? 'quiet' : 'loud'}`} role="status">{status}</span><h2 id="sound-title">{t.sound}</h2><div className="meter" role="meter" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100} aria-label={t.sound}><span style={{ width: `${level}%` }}/><i style={{ left: `${settings.noiseThreshold}%` }}/></div><div className="meter-labels"><b>{level}</b><span>{t.target}: {settings.noiseThreshold}</span></div><small>{t.approximate}</small></div><div className="forest" aria-label={`${progress.seedlings} ${t.seedlings}, ${progress.trees} ${t.trees}`}><span>🌱 × {progress.seedlings}</span><span>🌳 × {progress.trees}</span></div></section>
      <section className="stats"><article><span>🌱</span><div><strong>{progress.seedlings}</strong><small>{t.seedlings}</small></div></article><article><span>🌳</span><div><strong>{progress.trees}</strong><small>{t.trees}</small></div></article><article><span>◷</span><div><strong>{formatTime(progress.elapsed)}</strong><small>{t.time}</small></div></article></section>
      <section className="progress"><label htmlFor="quiet-progress">{t.progress}: {formatTime(Math.min(quietSeconds, quietTargetSeconds))} / {formatTime(quietTargetSeconds)}</label><progress id="quiet-progress" max={quietTargetSeconds} value={quietSeconds}/></section>
      <div className="controls"><div><button title={t.startInfo} className="primary" onClick={start} disabled={running}>▶️ {t.start}</button><InfoTip text={t.startInfo}/></div><div><button title={t.pauseInfo} onClick={() => setRunning(false)} disabled={!running}>⏸️ {t.pause}</button><InfoTip text={t.pauseInfo}/></div><div><button title={t.resetInfo} onClick={reset}>🔄 {t.reset}</button><InfoTip text={t.resetInfo}/></div></div>
    </main></div>}

    {activeTab === 'faq' && <main className="faq-page tab-panel" aria-labelledby="faq-title"><section><span className="module-icon" aria-hidden="true">💡</span><h1 id="faq-title">{t.faqTitle}</h1>{[[t.q1,t.a1],[t.q2,t.a2],[t.q3,t.a3],[t.q4,t.a4],[t.q5,t.a5]].map(([question,answer], index) => <details key={question}><summary><span aria-hidden="true">{['🎙️','📊','🌱','🌳','⚙️'][index]}</span> {question}</summary><p>{answer}</p></details>)}</section></main>}

    {activeTab === 'settings' && <main className="settings-page tab-panel" aria-labelledby="settings-title"><section className="dialog"><div className="dialog-title"><h2 id="settings-title">⚙ {t.settings}</h2></div>
      <label><span>🌐 {t.language} <InfoTip text={t.languageInfo}/></span><select value={draft.language} onChange={e => setDraft({ ...draft, language: e.target.value as GameSettings['language'] })}><option value="zh">中文</option><option value="en">English</option></select></label>
      <label><span>🎨 {t.theme} <InfoTip text={t.themeInfo}/></span><select value={draft.theme} onChange={e => setDraft({ ...draft, theme: e.target.value as GameSettings['theme'] })}>{themes.map(theme => <option key={theme} value={theme}>{t[theme]}</option>)}</select></label>
      <NumberField icon="🔊" info={t.thresholdInfo} label={t.threshold} value={draft.noiseThreshold} range={limits.noiseThreshold} set={noiseThreshold => setDraft({ ...draft, noiseThreshold })}/><div className="duration-fields"><NumberField icon="🤫" info={t.durationInfo} label={settings.language === 'zh' ? '获得树苗所需安静时间' : 'Quiet time per seedling'} value={draft.quietDurationSeconds} range={quietDurationRange} set={quietDurationSeconds => setDraft({ ...draft, quietDurationSeconds })}/><label><span>⏱️ {settings.language === 'zh' ? '时间单位' : 'Time unit'}</span><select value={draft.quietTimeUnit} onChange={e => setDraft({ ...draft, quietTimeUnit: e.target.value as GameSettings['quietTimeUnit'] })}><option value="seconds">{discipline.seconds}</option><option value="minutes">{discipline.minutes}</option><option value="hours">{discipline.hours}</option></select></label></div><NumberField icon="🌳" info={t.ruleInfo} label={t.rule} value={draft.seedlingsPerTree} range={limits.seedlingsPerTree} set={seedlingsPerTree => setDraft({ ...draft, seedlingsPerTree })}/>
      <div className="duration-fields"><NumberField icon="🕒" info={t.studyInfo} label={discipline.duration} value={draft.studyMinutes} range={durationRange} set={studyMinutes => setDraft({ ...draft, studyMinutes })}/><label><span>⏱️ {settings.language === 'zh' ? '时间单位' : 'Time unit'}</span><select value={draft.studyTimeUnit} onChange={e => setDraft({ ...draft, studyTimeUnit: e.target.value as GameSettings['studyTimeUnit'] })}><option value="seconds">{discipline.seconds}</option><option value="minutes">{discipline.minutes}</option><option value="hours">{discipline.hours}</option></select></label></div>
      <NumberField icon="🎯" info={t.targetTreesInfo} label={t.targetTrees} value={draft.targetTrees} range={limits.targetTrees} set={targetTrees => setDraft({ ...draft, targetTrees })}/>
      <label><span>🛡️ {discipline.title}</span><select value={draft.disciplineMode} onChange={e => setDraft({ ...draft, disciplineMode: e.target.value as GameSettings['disciplineMode'] })}><option value="positive">{discipline.positive}</option><option value="balanced">{discipline.balanced}</option><option value="strict">{discipline.strict}</option></select></label>
      <label className="checkbox-field"><span>📣 {t.consequenceEnabled} <InfoTip text={t.consequenceInfo}/></span><input type="checkbox" checked={draft.consequenceEnabled} onChange={e => setDraft({ ...draft, consequenceEnabled: e.target.checked })}/></label>
      {draft.consequenceEnabled && <label><span>✍️ {t.consequenceText}</span><input type="text" maxLength={160} value={draft.consequenceText} onChange={e => setDraft({ ...draft, consequenceText: e.target.value })}/></label>}
      <button className="primary full" onClick={saveSettings}>💾 {t.save}</button></section></main>}

    <footer><p>🔒 {t.privacy}</p><div className="china-signature" aria-label="中华人民共和国, People's Republic of China"><span className="china-flag" aria-hidden="true">🇨🇳</span><strong>中华人民共和国</strong><span>People’s Republic of China</span></div></footer>
  </div>;
}
function InfoTip({ text }: { text: string }) { return <button type="button" className="info-tip" aria-label={text} data-tip={text}>ⓘ</button>; }
function NumberField({ icon, info, label, value, range, set }: { icon: string; info: string; label: string; value: number; range: { min: number; max: number }; set: (value: number) => void }) { return <label><span><span aria-hidden="true">{icon}</span> {label} <InfoTip text={info}/></span><input type="number" min={range.min} max={range.max} value={value} onChange={e => set(Math.min(range.max, Math.max(range.min, Number(e.target.value))))}/></label>; }
