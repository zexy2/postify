import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowUpRight, FiGithub, FiMail } from 'react-icons/fi';
import SEO from '../components/SEO';
import styles from './ContactPage.module.css';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const [intent, setIntent] = useState(0);
  const [reference, setReference] = useState('');
  const [message, setMessage] = useState('');

  const reasons = [
    ['01', isEn ? 'Correction' : 'Düzeltme', isEn ? 'A claim is stale, incomplete, or wrong.' : 'Bir iddia eski, eksik veya yanlış.'],
    ['02', isEn ? 'Useful topic' : 'Faydalı konu', isEn ? 'A practical problem deserves a maintained record.' : 'Pratik bir problem, bakımı yapılan bir kaydı hak ediyor.'],
    ['03', isEn ? 'Collaboration' : 'İş birliği', isEn ? 'You have evidence, experience, or a workflow worth combining.' : 'Birleştirmeye değer kanıtın, deneyimin veya iş akışın var.'],
  ];

  // This page never posts or saves a message. The user explicitly launches
  // their own email client with a locally prepared draft if they choose to.
  const selectedTitle = reasons[intent][1];
  const subject = `Postify / ${selectedTitle}`;
  const draft = [
    `${isEn ? 'Reason' : 'Konu'}: ${selectedTitle}`,
    ...(reference.trim() ? [`${isEn ? 'Reference' : 'Referans'}: ${reference.trim()}`] : []),
    `${isEn ? 'Details' : 'Açıklama'}: ${message.trim() || (isEn ? '(Add a description)' : '(Açıklama ekle)')}`,
  ].join('\n\n');
  const composeHref = `mailto:zekiakgul09@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`;
  const canCompose = message.trim().length > 0;

  return (
    <div className={styles.page}>
      <SEO title={t('contact.title')} description={t('contact.description')} />
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.editionLine} aria-hidden="true">
            <span>POSTIFY <span className={styles.editionMark}>✳</span> CONTACT</span>
            <span>{isEn ? 'A conversation worth having' : 'Değerli bir konuşmaya yer var'}</span>
          </div>
          <div className={styles.heroBody}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>{isEn ? 'CORRECTIONS / FEEDBACK / COLLABORATION' : 'DÜZELTME / GERİ BİLDİRİM / İŞ BİRLİĞİ'}</span>
              <h1>{isEn ? <>Useful knowledge gets better when readers can <em>challenge it.</em></> : <>Faydalı bilgi, okuyucu ona itiraz edebildiğinde <em>gelişir.</em></>}</h1>
              <p>{t('contact.description')}</p>
              <a className={styles.heroLink} href="#contact-channel-title">
                {isEn ? 'Find a direct channel' : 'Doğrudan iletişime geç'} <FiArrowUpRight aria-hidden="true" />
              </a>
            </div>
            <div className={styles.heroArtwork} aria-hidden="true">
              <span className={styles.artworkLabel}>{isEn ? 'AN OPEN CHANNEL' : 'AÇIK İLETİŞİM'}</span>
              <span className={styles.artworkGlyph}>↗</span>
              <span className={styles.artworkWordmark}>{isEn ? <>LET’S<br />CONNECT</> : <>BİRLİKTE<br />KONUŞALIM</>}<span>✳</span></span>
              <span className={styles.artworkFooter}>{isEn ? 'BETTER TOGETHER / POSTIFY' : 'BİRLİKTE DAHA İYİ / POSTIFY'}</span>
            </div>
          </div>
        </header>

        <section className={styles.channelSection} aria-labelledby="contact-channel-title">
          <div className={styles.sectionHeading}>
            <span>01</span>
            <h2 id="contact-channel-title">{isEn ? 'Direct channels' : 'Doğrudan kanallar'}</h2>
          </div>
          <div className={styles.channels}>
            <a href="mailto:zekiakgul09@gmail.com" className={styles.channel}>
              <span className={styles.channelIndex}>01</span>
              <FiMail aria-hidden="true" />
              <span className={styles.channelCopy}>
                <small>{t('contact.email')}</small>
                <strong>zekiakgul09@<wbr />gmail.com</strong>
              </span>
              <FiArrowUpRight aria-hidden="true" />
            </a>
            <a href="https://github.com/zexy2" target="_blank" rel="noopener noreferrer" className={styles.channel}>
              <span className={styles.channelIndex}>02</span>
              <FiGithub aria-hidden="true" />
              <span className={styles.channelCopy}>
                <small>GitHub</small>
                <strong>@zexy2</strong>
              </span>
              <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className={styles.reasonSection} aria-labelledby="contact-reasons-title">
          <div className={styles.sectionHeading}>
            <span>02</span>
            <h2 id="contact-reasons-title">{isEn ? 'Good reasons to reach out' : 'İletişim için iyi nedenler'}</h2>
          </div>
          <div className={styles.reasonRows}>
            {reasons.map(([index, title, text]) => (
              <div className={styles.reasonRow} key={index}>
                <span>{index}</span>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.draftSection} aria-labelledby="contact-draft-title">
          <div className={styles.sectionHeading}>
            <span>03</span>
            <h2 id="contact-draft-title">{isEn ? 'Give your message a useful shape.' : 'Mesajını işe yarar hale getir.'}</h2>
          </div>
          <div className={styles.draftDesk}>
            <div className={styles.draftEditor}>
              <p className={styles.draftIntro}>{isEn
                ? 'Choose a reason, add context, then open your own email app. This page does not send or store your message.'
                : 'Nedenini seç, bağlamı ekle, sonra kendi e-posta uygulamanda aç. Bu sayfa mesajını göndermez veya saklamaz.'}</p>
              <div className={styles.draftChoices} role="group" aria-label={isEn ? 'Message purpose' : 'Mesajın amacı'}>
                {reasons.map(([index, title], value) => (
                  <button key={index} type="button" className={styles.draftChoice}
                    aria-pressed={intent === value} onClick={() => setIntent(value)}>
                    <span aria-hidden="true">{index}</span>{title}
                  </button>
                ))}
              </div>
              <div className={styles.draftFields}>
                <label htmlFor="contact-draft-reference">{isEn ? 'Page or reference (optional)' : 'Sayfa veya referans (isteğe bağlı)'}</label>
                <input id="contact-draft-reference" value={reference} maxLength={200}
                  onChange={(event) => setReference(event.target.value)}
                  placeholder={isEn ? 'A URL or a short title' : 'Bağlantı veya kısa başlık'} />
                <label htmlFor="contact-draft-details">{isEn ? 'What should we know?' : 'Bilmemiz gereken nedir?'}</label>
                <textarea id="contact-draft-details" value={message} maxLength={750} rows={4}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={isEn ? 'Describe the issue, suggestion or collaboration…' : 'Sorunu, öneriyi veya iş birliği fikrini anlat…'} />
              </div>
            </div>
            <div className={styles.draftPreview} aria-label={isEn ? 'Prepared email preview' : 'Hazırlanan e-posta önizlemesi'}>
              <div className={styles.previewHeading}>
                <span>{isEn ? 'Your draft' : 'Mesaj taslağın'}</span>
                <span aria-hidden="true">↗ 03 / POSTIFY</span>
              </div>
              <div className={styles.previewMeta}>
                <span>{isEn ? 'TO' : 'ALICI'}</span><strong>zekiakgul09@gmail.com</strong>
                <span>{isEn ? 'SUBJECT' : 'KONU'}</span><strong>{subject}</strong>
              </div>
              <p className={styles.previewBody}>{draft}</p>
              {canCompose ? (
                <a className={styles.composeAction} href={composeHref}>
                  {isEn ? 'Open in email app' : 'E-posta uygulamasında aç'}
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              ) : (
                <button className={styles.composeAction} type="button" disabled>
                  {isEn ? 'Add details' : 'Açıklama ekle'}
                  <FiArrowUpRight aria-hidden="true" />
                </button>
              )}
              <p className={styles.previewPrivacy}>{isEn
                ? 'Only opening your email app starts the handoff. Sending stays your decision.'
                : 'Aktarım yalnızca e-posta uygulamanı açtığında başlar. Gönderme kararı sana aittir.'}</p>
            </div>
          </div>
        </section>

        <aside className={styles.note}>
          <span>{isEn ? 'A useful correction includes' : 'İyi bir düzeltmede şunlar olur'}</span>
          <p>{isEn ? 'The page or claim, what you expected, what you observed, and any evidence that helps reproduce it.' : 'Sayfa veya iddia, beklediğin sonuç, gözlemlediğin sonuç ve tekrar üretmeye yardımcı olan kanıt.'}</p>
        </aside>
      </div>
    </div>
  );
};

export default ContactPage;
