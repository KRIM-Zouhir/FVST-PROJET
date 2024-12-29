import React, { useEffect } from 'react';
import './styles/footer.css'; // Create a separate CSS file for the footer




const Footer = () => {


  return (
    <footer className="FOOTER">
      <div className="ContainerFooter">
        <div className="TEXT4">
          <h1 className="Logo1">FVST</h1>
        </div>

        <div className="FOOTER_NAV">
          <h2 className="TITLEP2">
            The platform that connects merchants and couriers for fast and efficient deliveries.
          </h2>
        </div>

        <div className="COPYRIGHT">
          <p className="COPYRIGHT">© 2024 FVST. All rights reserved.</p>
        </div>



      </div>
    </footer>
  );
};

export default Footer;
