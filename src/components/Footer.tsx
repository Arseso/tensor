export const Footer = () => {
    return (
        <footer className="site-footer">
    <div className="footer-container">
      <div className="footer-links-container">
        <section className="footer-section">
          <h3 className="footer-heading">Company</h3>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">About Last.fm</a></li>
            <li><a href="#" className="footer-link">Contact Us</a></li>
            <li><a href="#" className="footer-link">Jobs</a></li>
          </ul>
        </section>
        
        <section className="footer-section">
          <h3 className="footer-heading">Help</h3>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Track My Music</a></li>
            <li><a href="#" className="footer-link">Community Support</a></li>
            <li><a href="#" className="footer-link">Community Guidelines</a></li>
            <li><a href="#" className="footer-link">Help</a></li>
          </ul>
        </section>
        
        <section className="footer-section">
          <h3 className="footer-heading">Goodies</h3>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Download Scrobbler</a></li>
            <li><a href="#" className="footer-link">Developer API</a></li>
            <li><a href="#" className="footer-link">Free Music Downloads</a></li>
            <li><a href="#" className="footer-link">Merchandise</a></li>
          </ul>
        </section>
        
        <section className="footer-section">
          <h3 className="footer-heading">Account</h3>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Inbox</a></li>
            <li><a href="#" className="footer-link">Settings</a></li>
            <li><a href="#" className="footer-link">Last.fm Pro</a></li>
            <li><a href="#" className="footer-link">Logout</a></li>
          </ul>
        </section>
        
        <section className="footer-section">
          <h3 className="footer-heading">Follow Us</h3>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Facebook</a></li>
            <li><a href="#" className="footer-link">X</a></li>
            <li><a href="#" className="footer-link">Instagram</a></li>
            <li><a href="#" className="footer-link">YouTube</a></li>
          </ul>
        </section>
      </div>
      
      <div className="language-selector">
        <span className="current-language">English</span>
        <ul className="language-list">
          <li><a href="#" className="language-link">Deutsch</a></li>
          <li><a href="#" className="language-link">Español</a></li>
          <li><a href="#" className="language-link">Français</a></li>
          <li><a href="#" className="language-link">Italiano</a></li>
          <li><a href="#" className="language-link">日本語</a></li>
          <li><a href="#" className="language-link">Polski</a></li>
          <li><a href="#" className="language-link">Português</a></li>
          <li><a href="#" className="language-link">Русский</a></li>
          <li><a href="#" className="language-link">Svenska</a></li>
          <li><a href="#" className="language-link">Türkçe</a></li>
          <li><a href="#" className="language-link">简体中文</a></li>
        </ul>
      </div>
      
      <div className="footer-branding">
        <a href="#" className="audioscrobbler-link">
          <img src="/img/logo/footer_logo.png" alt="Audioscrobbler" className="footer-logo" />
          <span>Audioscrobbler</span>
        </a>
      </div>
    </div>
  </footer>
    );
}