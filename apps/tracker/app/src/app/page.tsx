'use client';
import styles from './page.module.scss';
import { Components } from '../../../../libs/tracker/data/src';
export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  return (
    <div className={styles.page}>
      <h1>Welcome to TrackingTi.me</h1>
      <p>Your time tracking solution.</p>
      <Components />
    </div>
  );
}
