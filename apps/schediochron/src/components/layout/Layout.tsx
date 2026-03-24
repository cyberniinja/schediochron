import './layout.scss';
import { Navbar } from './navbar/Navbar';

export const Layout = ({
  children,
  top,
  nav,
  sidebar,
  details,
  footer,
}: {
  children: React.ReactNode;
  top?: React.ReactNode;
  nav?: React.ReactNode;
  sidebar?: React.ReactNode;
  details?: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <div className={`schediochron layout`} role="application">
      <Navbar />
      <aside className="sidebar">{sidebar}</aside>
      <main>{children}</main>
      <aside className="details">{details}</aside>
      <footer>{footer}</footer>
    </div>
  );
};
