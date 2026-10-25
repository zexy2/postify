import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';
import SEO from '../../components/SEO';
import styles from './GoalPage.module.css';

const copy = {
  tr: {
    seo: 'Hedefimiz',
    title: 'Bilgi, biri onu çalıştırana kadar bir iddiadır.',
    lead: 'İnternetin daha fazla cevaba ihtiyacı yok. Sınanabilen, tekrar kullanılabilen ve eskidiğinde bunu söyleyen bilgiye ihtiyacı var.',
    scroll: 'Bir kaydın hayatını izle',
    sequence: 'Bir bilginin hayatı',
    steps: [
      { word: 'İddia', line: 'Neyi başarmaya çalışıyoruz?', detail: 'Hedefi ve sınırları ilk satırda yaz. Okur, zaman ayırmadan önce başarının neye benzediğini bilsin.' },
      { word: 'Kanıt', line: 'Hangi koşullarda çalıştı?', detail: 'Komut, sürüm, ortam ve çıktı iddianın hemen yanında dursun. Kendinden emin bir dil doğrulama değildir.' },
      { word: 'Zaman', line: 'Ne zaman ve nerede denendi?', detail: 'Her kayıt bir tarih ve bir çalışma ortamı taşır. Bağlam, sonucun bir parçasıdır.' },
      { word: 'Güncellik', line: 'Hâlâ aynı şekilde çalışıyor mu?', detail: 'Ortam değiştiğinde kayıt bunu söyler. Eski bir kanıt silinmez; yeniden kontrol gerektiği açıkça görünür.' },
    ],
    record: {
      head: 'Kayıt',
      claim: 'JSON doğrulaması Node.js içinde bir assertion ile geçer.',
      command: 'node node-json-parse-v1.mjs',
      env: 'Ortam', date: 'Tarih', status: 'Durum',
      verified: 'Doğrulandı', recheck: 'Yeniden kontrol',
      stampOk: 'POSTIFY DOĞRULADI · TEKRARLANABİLİR · ',
      stampRe: 'YENİDEN KONTROL · ORTAM DEĞİŞTİ · ',
      note: 'Bu sahne, Postify’ın yayınlanmış ilk doğrulama kaydının yapısını gösterir.',
    },
    compare: 'Yeterli olmayan, ve yeterli olan',
    notEnough: '“Bende çalıştı.”',
    enough: '“Node 24.20.0 üzerinde, şu komutla, şu çıktıyı verdi.”',
    last: 'Daha az gürültü. Daha çok işe yarayan bilgi.',
    lastText: 'Postify tamamlanmış bir söz değil; uygulamayla gelişen bir yaklaşım. Bugün yalnızca deterministik Node.js örneklerini otomatik doğruluyoruz ve bunu açıkça söylüyoruz.',
    action: 'Bilgiyi keşfet', secondary: 'Nasıl çalıştığımızı oku',
  },
  en: {
    seo: 'Our goal',
    title: 'Knowledge is a claim until someone runs it.',
    lead: 'The internet does not need more answers. It needs knowledge that can be tested, reused, and that says so when it goes stale.',
    scroll: 'Follow the life of a record',
    sequence: 'The life of a piece of knowledge',
    steps: [
      { word: 'Claim', line: 'What are we trying to achieve?', detail: 'Write the outcome and its limits on the first line. Readers should know what success looks like before they spend their time.' },
      { word: 'Evidence', line: 'Under what conditions did it work?', detail: 'Keep the command, version, environment and output right next to the claim. Confident wording is not verification.' },
      { word: 'Time', line: 'When and where was it tried?', detail: 'Every record carries a date and a runtime. Context is part of the result.' },
      { word: 'Freshness', line: 'Does it still work the same way?', detail: 'When the environment moves on, the record says so. Old evidence is not deleted; the need for a recheck becomes visible.' },
    ],
    record: {
      head: 'Record',
      claim: 'JSON validation passes inside Node.js with an assertion.',
      command: 'node node-json-parse-v1.mjs',
      env: 'Runtime', date: 'Date', status: 'Status',
      verified: 'Verified', recheck: 'Recheck',
      stampOk: 'POSTIFY VERIFIED · REPRODUCIBLE · ',
      stampRe: 'RECHECK REQUIRED · RUNTIME CHANGED · ',
      note: 'This scene shows the structure of Postify’s first published verification record.',
    },
    compare: 'Not enough, and enough',
    notEnough: '“It worked for me.”',
    enough: '“On Node 24.20.0, with this command, it printed this output.”',
    last: 'Less noise. More knowledge that works.',
    lastText: 'Postify is a work in progress, not a finished promise. Today we only verify deterministic Node.js examples automatically, and we say so plainly.',
    action: 'Explore knowledge', secondary: 'Read how we work',
  },
};

const GoalPage = () => {
  const { i18n } = useTranslation();
  const content = copy[i18n.language?.startsWith('en') ? 'en' : 'tr'];
  const [activeStep, setActiveStep] = useState(0);
  const sceneRef = useRef(null);
  const stepRefs = useRef([]);
  const step = content.steps[activeStep];
  const r = content.record;

  // Scroll drives the active step; the buttons remain the accessible control.
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let cleanup = () => {};
    let cancelled = false;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !sceneRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const triggers = stepRefs.current.filter(Boolean).map((element, index) => ScrollTrigger.create({
        trigger: element,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => { if (self.isActive) setActiveStep(index); },
      }));
      cleanup = () => triggers.forEach((trigger) => trigger.kill());
    });
    return () => { cancelled = true; cleanup(); };
  }, []);

  return (
    <div className={styles.page}>
      <SEO title={content.seo} description={content.lead} canonicalUrl="https://postify.zekiakgul.dev/goal" />

      <header className={`${styles.hero} paper-sheet`}>
        <div className={styles.heroInner}>
          <h1 className="ink-title">{content.title}</h1>
          <div className={styles.heroFoot}>
            <p className={styles.lead}>{content.lead}</p>
            <a className={styles.scrollLink} href="#life-of-a-record">{content.scroll}<FiArrowDown aria-hidden="true" /></a>
          </div>
        </div>
      </header>

      <section id="life-of-a-record" ref={sceneRef} className={styles.scene} aria-labelledby="method-heading">
        <div className={styles.sceneInner}>
          <div className={styles.narrative}>
            <h2 id="method-heading" className={styles.sceneTitle}>{content.sequence}</h2>
            <div className={styles.stepList} role="group" aria-label={content.sequence}>
              {content.steps.map((item, index) => (
                <div key={item.word} ref={(element) => { stepRefs.current[index] = element; }} className={styles.stepBlock} data-active={activeStep === index || undefined}>
                  <button
                    className={styles.stepButton}
                    type="button"
                    aria-pressed={activeStep === index}
                    onClick={() => setActiveStep(index)}
                  >
                    {item.word}
                  </button>
                  <p className={styles.stepLine}>{item.line}</p>
                  <p className={styles.stepDetail}>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.stage}>
            <figure className={styles.record} data-step={activeStep} aria-live="polite" aria-atomic="true">
              <div className={styles.recordHead}>
                <span>{r.head}</span>
                <span className={styles.recordProgress} aria-hidden="true">
                  {content.steps.map((item, index) => <i key={item.word} data-on={index <= activeStep || undefined} />)}
                </span>
              </div>
              <h3 className={styles.recordLine}>{step.line}</h3>

              <div className={styles.layer} data-layer="claim">
                <span className={styles.layerKey}>{content.steps[0].word}</span>
                <p>{r.claim}</p>
              </div>
              <div className={styles.layer} data-layer="evidence">
                <span className={styles.layerKey}>{content.steps[1].word}</span>
                <code className={styles.terminal}><span aria-hidden="true">$ </span>{r.command}<b>PASS</b></code>
              </div>
              <dl className={styles.layer} data-layer="time">
                <div><dt>{r.env}</dt><dd>Node v24.20.0</dd></div>
                <div><dt>{r.date}</dt><dd>2026</dd></div>
                <div><dt>{r.status}</dt><dd className={styles.statusValue}>{activeStep >= 3 ? r.recheck : r.verified}</dd></div>
              </dl>

              <div className={styles.stamp} data-recheck={activeStep >= 3 || undefined} aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <defs><path id="goal-stamp-ring" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" /></defs>
                  <circle cx="60" cy="60" r="56" />
                  <circle cx="60" cy="60" r="34" />
                  <text><textPath href="#goal-stamp-ring">{activeStep >= 3 ? r.stampRe : r.stampOk}</textPath></text>
                  {activeStep >= 3 ? <path d="M60 44v20M60 74v2" /> : <path d="M46 61l10 10 19-22" />}
                </svg>
              </div>
            </figure>
            <p className={styles.stageNote}>{r.note}</p>
          </div>
        </div>
      </section>

      <section className={styles.comparison} aria-labelledby="comparison-heading">
        <h2 id="comparison-heading" className={styles.comparisonTitle}>{content.compare}</h2>
        <div className={styles.comparisonGrid}>
          <p className={styles.before}>{content.notEnough}</p>
          <p className={styles.after}>{content.enough}</p>
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="closing-heading">
        <h2 id="closing-heading">{content.last}</h2>
        <p>{content.lastText}</p>
        <div className={styles.closingActions}>
          <Link to="/" className={styles.primary}>{content.action}<FiArrowUpRight aria-hidden="true" /></Link>
          <Link to="/about" className={styles.secondary}>{content.secondary}</Link>
        </div>
      </section>
    </div>
  );
};

export default GoalPage;
