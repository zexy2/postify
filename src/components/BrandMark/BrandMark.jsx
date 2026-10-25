import styles from './BrandMark.module.css';

// Proof seal: a stamped disc whose "P" closes with a check stroke.
const BrandMark = ({ size = 'md', className = '' }) => (
  <svg
    className={`${styles.mark} ${styles[size]} ${className}`}
    viewBox="0 0 40 40"
    aria-hidden="true"
  >
    <circle className={styles.seal} cx="20" cy="20" r="19" />
    <path
      className={styles.letter}
      d="M13.5 30.5V10.5h7.2c4.6 0 7.4 2.5 7.4 6.3 0 3.9-2.8 6.4-7.4 6.4h-3.1v7.3h-4.1Zm4.1-11h2.9c2.3 0 3.5-1 3.5-2.7s-1.2-2.7-3.5-2.7h-2.9v5.4Z"
    />
    <path className={styles.tick} d="M21.5 27.2l2.6 2.6 5.6-6.1" />
  </svg>
);

export default BrandMark;
