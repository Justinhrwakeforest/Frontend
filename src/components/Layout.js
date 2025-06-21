// src/components/Layout.js - Main layout wrapper with footer
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
