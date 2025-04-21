import { X } from 'lucide-react';
import '../styles/ProfileInfo.css';

const ProfileInfo = ({ userData, onClose }) => {
  return (
    <div className="profile-info-overlay">
      <div className="profile-info-modal">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="profile-header">
          <div className="profile-avatar-large">
            <img src="/dp.jpeg" alt={userData.name} />
          </div>
          <h2>{userData.name}</h2>
          <p className="profile-role">{userData.designation}</p>
        </div>

        <div className="profile-details">
          <div className="info-group">
            <label>Email</label>
            <p>{userData.email}</p>
          </div>
          <div className="info-group">
            <label>Client Name</label>
            <p>{userData.clientName}</p>
          </div>
          <div className="info-group">
            <label>Age</label>
            <p>{userData.age}</p>
          </div>
          <div className="info-group">
            <label>Designation</label>
            <p>{userData.designation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;