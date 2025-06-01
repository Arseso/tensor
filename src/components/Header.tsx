import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <header className="site-header">
    <div className="header-container">
      <a href="index.html" className="logo-link">
        <img src="/img/logo/logo.png" alt="Last.fm" className="logo" />
      </a>
      
      <nav className="main-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link className="nav-link" to='/search'>
              <img src="/img/icons/search.svg" alt="Search" className="nav-icon" />
              <span className="sr-only">Search</span>
            </Link>
          </li>
          <li className="nav-item"><a href="index.html" className="nav-link">Home</a></li>
          <li className="nav-item"><a href="#" className="nav-link">Live</a></li>
          <li className="nav-item"><Link className="nav-link active" to='/'>Music</Link></li>
          <li className="nav-item"><a href="#" className="nav-link">Charts</a></li>
          <li className="nav-item"><a href="#" className="nav-link">Events</a></li>
          <li className="nav-item"><a href="#" className="nav-link">Features</a></li>
        </ul>
      </nav>
    </div>
  </header>
    ); 
}