"use client";

import React from 'react';
import { FaGithub, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-bg border-t border-accent text-accent py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Campus Underground</h3>
            <p className="text-sm opacity-75">Stay connected with campus life</p>
          </div>
          
          <div className="mb-4 md:mb-0">
            <h4 className="text-sm font-bold mb-2">Quick Links</h4>
            <div className="flex flex-col text-sm">
              <a href="/feed" className="hover:text-accent-hover mb-1">Live Feed</a>
              <a href="/spotted" className="hover:text-accent-hover mb-1">Spotted</a>
              <a href="/events" className="hover:text-accent-hover mb-1">Events</a>
              <a href="/polls" className="hover:text-accent-hover">Polls</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-2">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent-hover">
                <FaGithub size={20} />
              </a>
              <a href="#" className="hover:text-accent-hover">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-accent-hover">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-accent-hover">
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-accent/30 text-center text-xs opacity-75">
          <p>Powered by "Engineering failure"</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
