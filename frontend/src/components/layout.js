import React from 'react';
import Header from '../pages/header.js';
import Footer from '../pages/footer.jsx';

const Layout = ({ children }) => {
  return (
    <div>
    <Header />
      {children}
    <Footer />
    </div>
  );
};

export default Layout;
