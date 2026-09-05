import { useEffect, useRef, useState } from 'react';
import './enhancements.css';

type Language = 'zh' | 'en';
type Theme = 'light' | 'dark' | 'contrast';
type Tab = 'teacher' | 'lesson' | 'output';
type GenerationMode = 'local' | 'provider';
const API_URL = 'http://localhost:3001';

function Info({ text }: { text: string }) {
  return <span className="info" title={text} aria-label={text} role="button" tabIndex={0}>ⓘ<span role="tooltip">{text}</span></span>;
}

const copy = {
  en: {
    title: 'AI Teacher Studio', teacher: 'Teacher setup', lesson: 'Lesson setup', output: 'Generate', saved: 'Changes saved',
    step1: 'Create the authorized teacher avatar', intro: 'Upload the teacher’s photo and record or attach a clear voice sample. They will be used to create an avatar resembling the teacher and narrating with their authorized voice.',
    name: 'Teacher name', nameHint: 'Example: Mtro. Wilson Suarez', photo: 'Teacher photo', photoHint: 'Use a clear, front-facing photo with good lighting.', voice: 'Teacher voice sample', quiet: 'Record in a quiet place. Speak clearly for at least 30 seconds.', record: 'Start recording', stop: 'Stop recording', uploadAudio: 'Or upload prerecorded audio', ready: 'Voice sample ready', consent: 'I confirm that this teacher gave explicit permission to use their photo and voice to create this AI-generated educational avatar.', saveTeacher: 'Save teacher profile', required: 'Name, photo, voice and consent are required.',
    step2: 'Configure the basic lesson', basicRule: 'Basic format only: short text, one illustrative image per slide, and the teacher avatar explaining.', topic: 'Lesson topic', topicHint: 'Example: Cultural exchange between China and the Dominican Republic', slides: 'Number of slides', language: 'Presentation language', duration: 'Video duration', minutes: 'minutes', style: 'Teaching style', friendly: 'Friendly and clear', formal: 'Formal and academic', children: 'Simple for children', next: 'Continue to generation',
    step3: 'Create the teaching materials', summary: 'The system will create 3–5 slides, a narration script, a PPTX presentation and an AI-avatar microvideo using the authorized teacher profile.', generate: 'Generate presentation and video', blocked: 'Complete the teacher profile and lesson topic first.', disclosure: 'The final video must indicate that it was generated with AI.', appearance: 'Appearance', light: 'Light', dark: 'Dark', contrast: 'High contrast', profileSaved: 'Teacher profile is ready.', preparing: 'Your local MP4 video is ready.', microphoneError: 'Microphone access failed. Check browser permissions.', generating: 'Creating your video', complete: 'Video complete', generationSteps: ['Uploading authorized files', 'Preparing the teacher photo', 'Preparing the original audio', 'Encoding the MP4 video', 'Saving the local video'], infoName: 'Identifies the teacher who will appear and speak in the video.', infoPhoto: 'This photo is the visual reference used to create the teacher avatar.', infoVoice: 'This recording is the authorized voice reference for the narration.', infoConsent: 'Required confirmation that the person authorized this use of their image and voice.', infoTopic: 'Describe only the subject the teacher should explain.', infoSlides: 'Choose a simple presentation containing 3, 4 or 5 slides.', infoLanguage: 'Select the language spoken by the avatar and written on the slides.', infoDuration: 'Sets the approximate length of the final microvideo.', infoStyle: 'Controls how formal or simple the explanation should sound.', localMode: 'Local video (FFmpeg)', localHelp: 'Creates a real MP4 with the still photo and original recording. No voice cloning or lip movement.', providerMode: 'Cloud AI provider', providerHelp: 'Uses an adapter for Azure, AWS or another provider to create new speech and an animated avatar.', providerMissing: 'Configure the provider URL, name and API key in the backend .env file.', download: 'Download MP4', error: 'The video could not be generated. Confirm that the backend is running and try again.',
  },
  zh: {
    title: 'AI教师工作室', teacher: '教师设置', lesson: '课程设置', output: '生成内容', saved: '更改已保存',
    step1: '创建已授权的教师数字人', intro: '上传教师照片，并录制或添加清晰的语音样本。这些资料将用于创建与教师相似的数字人，并使用经授权的声音讲解课程。',
    name: '教师姓名', nameHint: '例如：Wilson Suarez老师', photo: '教师照片', photoHint: '请使用光线良好、正面清晰的照片。', voice: '教师语音样本', quiet: '请在安静的地方录音，清晰朗读至少30秒。', record: '开始录音', stop: '停止录音', uploadAudio: '或上传预先录制的音频', ready: '语音样本已准备', consent: '我确认该教师已明确授权使用其照片和声音创建此AI教育数字人。', saveTeacher: '保存教师资料', required: '必须提供姓名、照片、语音和授权同意。',
    step2: '配置基础课程', basicRule: '仅使用基础格式：每张幻灯片包含简短文字、一张相关图片，并由教师数字人进行讲解。', topic: '课程主题', topicHint: '例如：中国与多米尼加共和国的文化交流', slides: '幻灯片数量', language: '演示语言', duration: '视频时长', minutes: '分钟', style: '教学风格', friendly: '亲切清晰', formal: '正式学术', children: '儿童简明版', next: '继续生成',
    step3: '创建教学材料', summary: '系统将使用已授权的教师资料，生成3至5张幻灯片、讲解稿、PPTX演示文稿和AI数字人微视频。', generate: '生成演示文稿和视频', blocked: '请先完成教师资料并填写课程主题。', disclosure: '最终视频必须注明由人工智能生成。', appearance: '外观', light: '浅色', dark: '深色', contrast: '高对比度', profileSaved: '教师资料已准备完成。', preparing: '本地MP4视频已生成。', microphoneError: '无法访问麦克风，请检查浏览器权限。', generating: '正在创建视频', complete: '视频已完成', generationSteps: ['上传已授权的文件', '准备教师照片', '准备原始音频', '编码MP4视频', '保存本地视频'], infoName: '用于识别视频中出镜并讲解的教师。', infoPhoto: '该照片是创建教师数字人形象的视觉参考。', infoVoice: '该录音是生成授权讲解声音的参考样本。', infoConsent: '必须确认本人已授权使用其照片和声音。', infoTopic: '只需填写教师要讲解的课程主题。', infoSlides: '选择包含3、4或5张幻灯片的基础演示文稿。', infoLanguage: '选择数字人讲解和幻灯片文字所使用的语言。', infoDuration: '设置最终微视频的大致时长。', infoStyle: '控制讲解的正式程度或简明程度。', localMode: '本地视频（FFmpeg）', localHelp: '使用静态照片和原始录音创建真实MP4，不克隆声音，也不制作口型动画。', providerMode: '云端AI服务', providerHelp: '通过适配器使用Azure、AWS或其他服务创建新语音和动态数字人。', providerMissing: '请在后端.env文件中配置服务名称、URL和API密钥。', download: '下载MP4', error: '视频生成失败。请确认后端正在运行，然后重试。',
  },
};

export default function App() {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('ai-teacher-settings') || '{}'); } catch { return {}; } })();
  const [language, setLanguage] = useState<Language>(saved.language || 'en');
  const [theme, setTheme] = useState<Theme>(saved.theme || 'light');
  const [tab, setTab] = useState<Tab>('teacher');
  const [name, setName] = useState(saved.name || '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | Blob | null>(null);
  const [consent, setConsent] = useState(false);
  const [topic, setTopic] = useState(saved.topic || '');
  const [slides, setSlides] = useState(saved.slides || '4');
  const [presentationLanguage, setPresentationLanguage] = useState(saved.presentationLanguage || 'en');
  const [duration, setDuration] = useState(saved.duration || '3');
  const [teachingStyle, setTeachingStyle] = useState(saved.teachingStyle || 'friendly');
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState('');
  const [generationStep, setGenerationStep] = useState(-1);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('local');
  const [videoUrl, setVideoUrl] = useState('');
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const t = copy[language];
  const profileReady = Boolean(name.trim() && photo && audio && consent);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
    document.title = `${t.title} · ${t[tab]}`;
    history.replaceState(null, '', `#${language}/${tab}`);
  }, [language, tab, theme, t]);

  useEffect(() => {
    localStorage.setItem('ai-teacher-settings', JSON.stringify({ language, theme, name, topic, slides, presentationLanguage, duration, teachingStyle }));
  }, [language, theme, name, topic, slides, presentationLanguage, duration, teachingStyle]);

  async function startRecording() {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream.current);
      chunks.current = [];
      mediaRecorder.ondataavailable = (event) => event.data.size && chunks.current.push(event.data);
      mediaRecorder.onstop = () => {
        setAudio(new Blob(chunks.current, { type: mediaRecorder.mimeType }));
        stream.current?.getTracks().forEach((track) => track.stop());
      };
      recorder.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
    } catch { setMessage(t.microphoneError); }
  }

  function stopRecording() { recorder.current?.stop(); setRecording(false); }

  async function generatePresentation() {
    setMessage('');
    setVideoUrl('');
    if (generationMode === 'provider') {
      setMessage(t.providerMissing);
      return;
    }
    if (!photo || !audio) return;
    setGenerationStep(0);
    const progressTimer = window.setInterval(() => setGenerationStep((current) => Math.min(current + 1, t.generationSteps.length - 1)), 700);
    const form = new FormData();
    form.append('photo', photo, photo.name);
    form.append('audio', audio, audio instanceof File ? audio.name : 'recorded-voice.webm');
    form.append('topic', topic);
    try {
      const response = await fetch(`${API_URL}/videos/local`, { method: 'POST', body: form });
      if (!response.ok) throw new Error(await response.text());
      const result = await response.json() as { downloadUrl: string };
      setVideoUrl(`${API_URL}${result.downloadUrl}`);
      setGenerationStep(t.generationSteps.length);
      setMessage(t.preparing);
    } catch (error) {
      console.error(error);
      setGenerationStep(-1);
      setMessage(t.error);
    } finally {
      window.clearInterval(progressTimer);
    }
  }

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => setTab('teacher')}>🎓 <span>{t.title}</span></button>
      <div className="header-tools">
        <span className="saved-badge">✓ {t.saved}</span>
        <select aria-label={t.language} value={language} onChange={(e) => setLanguage(e.target.value as Language)}><option value="en">🇺🇸 English</option><option value="zh">🇨🇳 中文</option></select>
        <select aria-label={t.appearance} value={theme} onChange={(e) => setTheme(e.target.value as Theme)}><option value="light">☀️ {t.light}</option><option value="dark">🌙 {t.dark}</option><option value="contrast">◐ {t.contrast}</option></select>
      </div>
    </header>
    <nav className="tabs" aria-label="Workflow">
      <button className={tab === 'teacher' ? 'active' : ''} onClick={() => setTab('teacher')}><b>1</b> 📷🎙️ {t.teacher}</button>
      <button className={tab === 'lesson' ? 'active' : ''} onClick={() => setTab('lesson')}><b>2</b> 📚 {t.lesson}</button>
      <button className={tab === 'output' ? 'active' : ''} onClick={() => setTab('output')}><b>3</b> 🎬 {t.output}</button>
    </nav>
    <main>
      {tab === 'teacher' && <section className="panel">
        <div className="section-title"><span>🧑‍🏫</span><div><p>STEP 1</p><h1>{t.step1}</h1></div></div><p className="lead">{t.intro}</p>
        <div className="form-grid">
          <label className="wide"><span>👤 {t.name} <Info text={t.infoName}/></span><input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.nameHint}/></label>
          <label className="upload-card"><span className="big-icon">📸</span><strong>{t.photo} <Info text={t.infoPhoto}/></strong><small>{t.photoHint}</small><input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}/>{photo && <em>✅ {photo.name}</em>}</label>
          <div className="upload-card"><span className="big-icon">🎙️</span><strong>{t.voice} <Info text={t.infoVoice}/></strong><small>🤫 {t.quiet}</small><button className={recording ? 'danger' : ''} onClick={recording ? stopRecording : startRecording}>{recording ? `⏹ ${t.stop}` : `⏺ ${t.record}`}</button><label className="audio-file">📁 {t.uploadAudio}<input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] ?? null)}/></label>{audio && <em>✅ {t.ready}</em>}</div>
        </div>
        <label className="consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}/><span>🛡️ {t.consent} <Info text={t.infoConsent}/></span></label>
        <button className="primary" disabled={!profileReady} onClick={() => { setMessage(t.profileSaved); setTab('lesson'); }}>💾 {t.saveTeacher}</button>
        {!profileReady && <p className="hint">ℹ️ {t.required}</p>}{message && <p role="status" className="message">{message}</p>}
      </section>}
      {tab === 'lesson' && <section className="panel">
        <div className="section-title"><span>📚</span><div><p>STEP 2</p><h1>{t.step2}</h1></div></div>
        <p className="notice" style={{ background: 'var(--soft)', color: 'inherit', borderLeftColor: 'var(--primary)' }}>🖼️ {t.basicRule}</p>
        <div className="form-grid settings-grid">
          <label className="wide"><span>💡 {t.topic} <Info text={t.infoTopic}/></span><textarea rows={3} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicHint}/></label>
          <label><span>🖼️ {t.slides} <Info text={t.infoSlides}/></span><select value={slides} onChange={(e) => setSlides(e.target.value)}><option>3</option><option>4</option><option>5</option></select></label>
          <label><span>🌐 {t.language} <Info text={t.infoLanguage}/></span><select value={presentationLanguage} onChange={(e) => setPresentationLanguage(e.target.value)}><option value="en">English</option><option value="zh">中文</option><option value="both">English + 中文</option></select></label>
          <label><span>⏱️ {t.duration} <Info text={t.infoDuration}/></span><div className="inline"><input type="number" min="1" max="15" value={duration} onChange={(e) => setDuration(e.target.value)}/><span>{t.minutes}</span></div></label>
          <label><span>🎨 {t.style} <Info text={t.infoStyle}/></span><select value={teachingStyle} onChange={(e) => setTeachingStyle(e.target.value)}><option value="friendly">{t.friendly}</option><option value="formal">{t.formal}</option><option value="children">{t.children}</option></select></label>
        </div><button className="primary" disabled={!topic.trim()} onClick={() => setTab('output')}>➡️ {t.next}</button>
      </section>}
      {tab === 'output' && <section className="panel">
        <div className="section-title"><span>🎬</span><div><p>STEP 3</p><h1>{t.step3}</h1></div></div>
        <div className="preview"><div className="avatar-placeholder">{photo ? <img src={URL.createObjectURL(photo)} alt={name}/> : '🧑‍🏫'}</div><div><h2>{name || t.teacher}</h2><p>{topic || t.summary}</p><ul><li>📑 PPTX · {slides} {t.slides}</li><li>🌐 {presentationLanguage === 'zh' ? '中文' : presentationLanguage === 'both' ? 'English + 中文' : 'English'}</li><li>🎙️ {t.voice}</li><li>🎥 {duration} {t.minutes}</li></ul></div></div>
        <div className="mode-grid" aria-label="Generation mode">
          <label className={generationMode === 'local' ? 'mode-card selected' : 'mode-card'}><input type="radio" name="generation-mode" checked={generationMode === 'local'} onChange={() => setGenerationMode('local')}/><span><strong>💻 {t.localMode}</strong><small>{t.localHelp}</small></span></label>
          <label className="mode-card future"><input type="radio" name="generation-mode" disabled/><span><strong>☁️ {t.providerMode}</strong><small>{t.providerHelp}</small><em>{language === 'zh' ? '未来功能' : 'Future option'}</em></span></label>
        </div>
        <p className="notice">🛡️ {t.disclosure}</p><button className="primary generate" disabled={!profileReady || !topic.trim() || (generationStep >= 0 && generationStep < t.generationSteps.length)} onClick={generatePresentation}>✨ {t.generate}</button>
        {generationStep >= 0 && <div className="loading-card" role="status" aria-live="polite"><div className={generationStep < t.generationSteps.length ? 'spinner' : 'done'}>{generationStep < t.generationSteps.length ? '🎞️' : '✅'}</div><strong>{generationStep < t.generationSteps.length ? t.generating : t.complete}</strong><span>{generationStep < t.generationSteps.length ? t.generationSteps[generationStep] : t.preparing}</span><progress max={t.generationSteps.length} value={generationStep < t.generationSteps.length ? generationStep + 1 : t.generationSteps.length}/><small>{Math.min(100, Math.round(((generationStep + 1) / t.generationSteps.length) * 100))}%</small></div>}
        {videoUrl && <div className="video-result"><video controls src={videoUrl}/><a className="download-button" href={videoUrl} download>⬇️ {t.download}</a><code>generated-output/</code></div>}
        {(!profileReady || !topic.trim()) && <p className="hint">ℹ️ {t.blocked}</p>}{message && <p role="status" className="message">{message}</p>}
      </section>}
    </main>
  </div>;
}
