import { NavLink } from 'react-router-dom';

const Navigation = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) => isActive ? 'nav-item active' : 'nav-item';

  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-list-item">
          <NavLink to="/" className={getLinkClass}>Home</NavLink>
        </li>
        <li className="nav-list-item">
          <NavLink to="/SavedCandidates" className={getLinkClass}>Potential Candidates</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
