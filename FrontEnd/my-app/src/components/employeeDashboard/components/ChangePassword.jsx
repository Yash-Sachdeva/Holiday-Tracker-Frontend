import React, { useState } from 'react';
import '../styles/ChangePassword.css';
const ChangePassword = ({onClose,userData}) =>{
    const [oldPassword,setOldPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [error,setError] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(confirmPassword !== newPassword){
            setError("New Password and Confirm password does not match");
            return;
        }
        try{
            const eid = userData.eid;
            const response = await fetch(`http://localhost:8000/emps/employee/change-password/${eid}`,{
                    method:'PATCH',
                    credentials:'include',
                    headers:{
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        oldPassword:oldPassword,
                        newPassword:newPassword
                    })
                }
            );
            if(!response.ok){
                setError("Password Entered is Wrong");
            }
            else{
                alert("Password Change Successfully");
                onClose();
            }
        }
        catch(err){
            console.log(err);
            setError('Network Error or Server Down')
        }
        
    };
    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Change Password</h2>
                <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <label>Old Password</label>
                <input type="password" onChange = {(e)=> setOldPassword(e.target.value)} required />

                <label>New Password</label>
                <input type="password" onChange = {(e)=> setNewPassword(e.target.value)} required />

                <label>Confirm New Password</label>
                <input type="password" onChange = {(e)=> setConfirmPassword(e.target.value)} required />

                <div className="modal-actions">
                    <button type="submit" className="save-button">Submit</button>
                    <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                </div>
                </form>
            </div>
        </div>
    )
}
export default ChangePassword