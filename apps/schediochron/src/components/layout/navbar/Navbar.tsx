import {
  faCalendarDays as calendarDaysActive,
  faGear as gearActive,
  faUserCircle as userCircleActive,
} from '@awesome.me/kit-ce1dfad8cc/icons/sharp-duotone/regular';
import { faHourglass2 } from '@awesome.me/kit-ce1dfad8cc/icons/sharp-duotone/solid';
import {
  faCalendarDays as calendarDays,
  faGear as gear,
  faUserCircle as userCircle,
} from '@awesome.me/kit-ce1dfad8cc/icons/sharp/regular';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import style from './Navbar.module.scss';

export function Navbar() {
  return (
    <nav className={`navbar ${style.navbar}`}>
      <div className="logo">
        <FontAwesomeIcon icon={faHourglass2} size="3x" />
      </div>
      <div className={style.spacer} />
      <NavLink className="nav-link" to="/">
        {({ isActive }) => (
          <>
            <FontAwesomeIcon
              icon={isActive ? calendarDaysActive : calendarDays}
              size="3x"
            />
            <span>Time Sheet</span>
          </>
        )}
      </NavLink>
      <div className={style.spacer} />
      <NavLink className="nav-link" to="/profile">
        {({ isActive }) => (
          <>
            <FontAwesomeIcon
              icon={isActive ? userCircleActive : userCircle}
              size="3x"
            />
            <span>Elias Mjøen</span>
          </>
        )}
      </NavLink>
      <NavLink className="nav-link" to="/settings">
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={isActive ? gearActive : gear} size="3x" />
            <span>Settings</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}

export default Navbar;
