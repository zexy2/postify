import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowDownRight, FiArrowUpRight, FiCheck, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import SEO from '../../components/SEO';
import styles from './GoalPage.module.css';

const copy = {
  tr: {
    edition: 'Postify / Neden varız?',
    kicker: 'Bir internet daha mümkün.',
    title: <>Bilgi, <span>işe yaramalı.</span></>,
    lead: 'İnternetin daha fazla cevaba değil, sınanabilir ve tekrar kullanılabilir bilgiye ihtiyacı var.',
    scroll: 'Fikrin nasıl çalıştığını gör',
    field: 'Bizim inandığımız şey',
    belief: 'Bir şeyin doğru görünüyor olması, doğru çalıştığı anlamına gelmez.',
    beliefDetail: 'Bir rehberi yalnızca okumakla yetinme. Çalıştığı ortamı öğren, adımlarını gör, yeniden dene. Bir şey değiştiyse fark edebil.',
    sequence: 'Bilginin yaşam döngüsü',
    sequenceIntro: 'Gösterişli iddialar değil, tekrar edilebilen sonuçlar.',
    steps: [
      { word: 'İddia', line: 'Neyi başarmaya çalışıyoruz?', detail: 'Önce hedefi ve sınırları açıkça yaz. Okuyucu neyin işe yaraması gerektiğini daha ilk satırda görsün.', note: 'BAŞLANGIÇ / SORU' },
      { word: 'Kanıt', line: 'Hangi koşullarda çalıştı?', detail: 'Komutlar, sürümler, örnekler ve sonuçlar iddianın yanında dursun. Güven, yalnızca kesin konuşmakla kazanılmaz.', note: 'DENEME / SONUÇ' },
      { word: 'Güncellik', line: 'Hâlâ aynı şekilde mi çalışıyor?', detail: 'Teknoloji değişir. Bir sonucun ne zaman yeniden kontrol edilmesi gerektiği görünür olmalı.', note: 'ZAMAN / BAĞLAM' },
    ],
    anatomy: 'Bir bilginin anatomisi',
    unverified: 'Bir fikir', verified: 'Sınanabilir kayıt',
    notEnough: '“Bende çalıştı.”', enough: '“Şu ortamda, şu adımlarla çalıştı.”',
    principleOne: 'Sınırlarıyla birlikte', principleTwo: 'Bağlamını kaybetmeden', principleThree: 'Başkasının tekrar edebileceği kadar açık',
    last: 'Daha az gürültü. Daha çok işe yarayan bilgi.',
    lastText: 'Postify tamamlanmış bir söz değil; uygulamayla gelişen bir yaklaşım. Mevcut doğrulama durumlarını açıkça gösteriyoruz.',
    action: 'Bilgiyi keşfet', secondary: 'Nasıl çalıştığımızı oku',
  },
  en: {
    edition: 'Postify / Why we exist',
    kicker: 'Another internet is possible.',
    title: <>Knowledge should <span>do something.</span></>,
    lead: 'The internet does not need more answers. It needs knowledge that can be tested, reused and revisited.',
    scroll: 'See how the idea works',
    field: 'What we believe',
    belief: 'Looking correct is not the same as actually working.',
    beliefDetail: 'Do more than read a guide. See the environment, follow the steps and repeat the result. Know when something has changed.',
    sequence: 'The life of useful knowledge',
    sequenceIntro: 'Less performance. More repeatable outcomes.',
    steps: [
      { word: 'Claim', line: 'What are we trying to achieve?', detail: 'Start with the outcome and its limits. Readers should know what success looks like before they invest their time.', note: 'START / QUESTION' },
      { word: 'Evidence', line: 'Under what conditions did it work?', detail: 'Keep commands, versions, examples and outcomes alongside the claim. Confidence alone is not verification.', note: 'TEST / RESULT' },
      { word: 'Freshness', line: 'Does it still work today?', detail: 'Technology changes. The context and need for a new check should remain visible.', note: 'TIME / CONTEXT' },
    ],
    anatomy: 'Anatomy of an idea',
    unverified: 'An opinion', verified: 'A reproducible record',
    notEnough: '“It worked for me.”', enough: '“It worked here, with these steps.”',
    principleOne: 'Including its limits', principleTwo: 'Keeping the context', principleThree: 'Clear enough to repeat',
    last: 'Less noise. More knowledge that works.',
    lastText: 'Postify is a work in progress, not a completed promise. We show the current verification state openly.',
    action: 'Explore knowledge', secondary: 'Read how we work',
  },
};

const GoalPage = () => {
  const { i18n } = useTranslation();
  const content = copy[i18n.language?.startsWith('en') ? 'en' : 'tr'];
  const [activeStep, setActiveStep] = useState(0);
  const step = content.steps[activeStep];

  return (
    <div className={styles.page}>
      <SEO title={content.edition} description={content.lead} canonicalUrl="https://postify.zekiakgul.dev/goal" />
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.masthead}><span>✳ POSTIFY</span><span>{content.edition}</span><span>EST. 2026</span></div>
          <div className={styles.heroComposition}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>{content.kicker}</p>
              <h1>{content.title}</h1>
              <p className={styles.lead}>{content.lead}</p>
              <a className={styles.scrollLink} href="#our-belief">{content.scroll}<FiArrowDownRight aria-hidden="true" /></a>
            </div>
            <div className={styles.signalArtwork} aria-hidden="true">
              <div className={styles.signalOuter}><div className={styles.signalMiddle}><span>✳</span></div></div>
              <span className={styles.signalCaption}>TEST / LEARN / REPEAT</span>
              <span className={styles.signalNo}>P—01</span>
            </div>
          </div>
          <div className={styles.heroFoot}><span>READ / TEST / REPEAT</span><span>↓</span><span>POSTIFY® — FIELD MANIFESTO</span></div>
        </div>
      </header>

      <section id="our-belief" className={styles.belief} aria-labelledby="belief-heading">
        <div className={styles.beliefInner}>
          <span className={styles.sectionIndex}>✳ {content.field}</span>
          <div className={styles.beliefCopy}>
            <h2 id="belief-heading">{content.belief}</h2>
            <p>{content.beliefDetail}</p>
          </div>
          <span className={styles.beliefMark} aria-hidden="true">“</span>
        </div>
      </section>

      <section className={styles.method} aria-labelledby="method-heading">
        <div className={styles.sectionHead}><span className={styles.sectionIndex}>02 / POSTIFY METHOD</span><h2 id="method-heading">{content.sequence}</h2><p>{content.sequenceIntro}</p></div>
        <div className={styles.methodGrid}>
          <div className={styles.stepList} role="group" aria-label={content.sequence}>
            {content.steps.map((item, index) => (
              <button key={item.word} className={`${styles.stepButton} ${activeStep === index ? styles.stepActive : ''}`} type="button" aria-pressed={activeStep === index} onClick={() => setActiveStep(index)}>
                <span className={styles.stepNumber}>0{index + 1}</span><span>{item.word}</span><FiArrowUpRight aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className={styles.methodDisplay} aria-live="polite" aria-atomic="true">
            <div className={styles.methodDisplayTop}><span>POSTIFY / FIELD SYSTEM</span><span>{step.note}</span></div>
            <div className={styles.methodOrbit} aria-hidden="true"><span className={styles.orbitTrack} /><span className={styles.orbitCore}>0{activeStep + 1}</span><span className={styles.orbitDot} /></div>
            <div className={styles.methodWords} key={activeStep}><p>{step.word}</p><h3>{step.line}</h3><div>{step.detail}</div></div>
            <div className={styles.methodDisplayBottom}><span>CONTEXT IS EVERYTHING</span><span>0{activeStep + 1} / 03</span></div>
          </div>
        </div>
      </section>

      <section className={styles.comparison} aria-labelledby="comparison-heading">
        <div className={styles.comparisonIntro}><span className={styles.sectionIndex}>03 / OUR STANDARD</span><h2 id="comparison-heading">{content.anatomy}</h2></div>
        <div className={styles.comparisonGrid}>
          <div className={styles.before}><span className={styles.comparisonLabel}>× {content.unverified}</span><p>{content.notEnough}</p><span className={styles.comparisonGlyph} aria-hidden="true">?</span></div>
          <div className={styles.after}><span className={styles.comparisonLabel}><FiCheck aria-hidden="true" /> {content.verified}</span><p>{content.enough}</p><span className={styles.comparisonGlyph} aria-hidden="true">✳</span></div>
        </div>
        <div className={styles.principles}><span>{content.principleOne}</span><span>{content.principleTwo}</span><span>{content.principleThree}</span></div>
      </section>

      <section className={styles.closing} aria-labelledby="closing-heading">
        <span className={styles.sectionIndex}>POSTIFY / THE OPEN INVITATION</span>
        <h2 id="closing-heading">{content.last}</h2><p>{content.lastText}</p>
        <div className={styles.closingActions}><Link to="/">{content.action}<FiArrowUpRight aria-hidden="true" /></Link><Link to="/about">{content.secondary}<FiExternalLink aria-hidden="true" /></Link></div>
        <FiRefreshCw className={styles.closingMark} aria-hidden="true" />
      </section>
    </div>
  );
};

export default GoalPage;
