import { useState } from 'react';
import styles from './Calendar.module.scss';

const getWeekArray = (year: number, month: number): Date[][] => {
  // expected result array for weekdays [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  // [[27.02, 28.02, 01.03, 02.03, 03.03, 04.03, 05.03],
  // [06.03, 07.03, 08.03, 09.03, 10.03, 11.03, 12.03],
  // [13.03, 14.03, 15.03, 16.03, 17.03, 18.03, 19.03],
  // [20.03, 21.03, 22.03, 23.03, 24.03, 25.03, 26.03],
  // [27.03, 28.03, 29.03, 30.03, 31.03, 01.04, 02.04]]
  const result: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const numDays = lastDay.getDate();

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 7 : startDay; // Adjust so that Monday = 1, ..., Sunday = 7

  // Fill in the days from the previous month
  for (let i = startDay - 1; i > 0; i--) {
    const prevDate = new Date(year, month, 1 - i);
    result.push(prevDate);
  }

  // Fill in the days of the current month
  for (let i = 1; i <= numDays; i++) {
    result.push(new Date(year, month, i));
  }

  // Fill in the days from the next month to complete the last week
  const remainingCells = 7 - (result.length % 7);
  if (remainingCells < 7) {
    for (let i = 1; i <= remainingCells; i++) {
      result.push(new Date(year, month + 1, i));
    }
  }

  // Convert the flat array into a 2D array representing weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < result.length; i += 7) {
    weeks.push(result.slice(i, i + 7));
  }

  return weeks;
};

export function Calendar() {
  const [now, setNow] = useState<Date>(new Date());
  const daysArray = getWeekArray(now.getFullYear(), now.getMonth());

  return (
    <table className={styles['calendar']}>
      <thead>
        <tr>
          <th colSpan={7}>
            <div className={styles['calendar-header']}>
              <h2 className={styles['month-year']}>
                <b>
                  {now.toLocaleString('default', {
                    month: 'long',
                  })}
                </b>{' '}
                {now.toLocaleString('default', {
                  year: 'numeric',
                })}
              </h2>
              <nav className={styles['view-nav']}>
                <label>
                  <input type="radio" name="view" />
                  Day
                </label>
                <label>
                  <input type="radio" name="view" />
                  Week
                </label>
                <label>
                  <input type="radio" name="view" />
                  Month
                </label>
                <label>
                  <input type="radio" name="view" />
                  Year
                </label>
              </nav>
              <nav className={styles['seq-nav']}>
                <button>&lt;</button>
                <button>Today</button>
                <button>&gt;</button>
              </nav>
            </div>
          </th>
        </tr>
        <tr>
          <th>
            <span>Mon</span>
          </th>
          <th>
            <span>Tue</span>
          </th>
          <th>
            <span>Wed</span>
          </th>
          <th>
            <span>Thu</span>
          </th>
          <th>
            <span>Fri</span>
          </th>
          <th>
            <span>Sat</span>
          </th>
          <th>
            <span>Sun</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {daysArray.map((week, week_index) => (
          <tr key={week_index}>
            {week.map((date, dayIndex) => {
              const isCurrentMonth = date.getMonth() === now.getMonth();
              const isToday = date.getDate() === now.getDate();
              const isWeekend = dayIndex === 5 || dayIndex === 6;
              const dayNumber = date.getDate();
              return (
                <td
                  key={dayNumber}
                  className={`${!isCurrentMonth ? styles['other-month'] : ''} ${
                    isWeekend ? styles['weekend'] : ''
                  }`.trim()}
                >
                  <span
                    className={`${
                      isToday && isCurrentMonth ? styles['today'] : ''
                    }`}
                  >
                    {dayNumber}
                  </span>
                  {isToday && (
                    <div className={styles['time-log']}>
                      <div className={styles['entry']}>07:30 - 11:30</div>
                      <div className={styles['entry']}>12:15 - 17:00</div>
                      <div
                        className={`${styles['summary']} ${styles['positive']}`}
                      >
                        8h 45min (+21min)
                      </div>
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Calendar;
