import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SettingPage.css'; 
import ChangePassword from '../components/ChangePassword';
const SettingPage = ({userData}) => {
  const [showModal,setShowModal] = useState(false);
  const cards = [
    { title: 'Change Password', onClick: () => setShowModal(true) }
  ];

  return (
    <div className="settings-container">
      <h1 className="settings-heading">Settings</h1>
      <div className="settings-card-grid">
        {cards.map(({ title, link,onClick }) => (
          link ? (
          <Link key={title} to={link} className="settings-card">
            {title}
          </Link> )
          : (
            <div key={title} className = "settings-card" onClick={onClick}>
              {title}
            </div>
          )
        ))}
      </div>
      {showModal && <ChangePassword onClose = {() => setShowModal(false)} userData = {userData}/>}
    </div>

  );
};

export default SettingPage;
