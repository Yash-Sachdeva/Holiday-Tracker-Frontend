import { useState } from 'react';
import '../styles/MobileMenuToggle.css';

const MobileMenuToggle = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen);
  };

  return (
    <button 
      className={`mobile-menu-toggle ${isOpen ? 'open' : ''}`}
      onClick={handleToggle}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default MobileMenuToggle;