const HolidayForm = ({ holidayForm, handleInputChange, handleFormSubmit, editingHoliday, setShowHolidayForm }) => (
    <div className="holiday-form-overlay">
      <div className="holiday-form">
        <h3>{editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="name">Holiday Name</label>
            <input
              type="text"
              id="name"
              value={holidayForm.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="holidayDate">Date</label>
            <input
              type="date"
              id="holidayDate"
              value={holidayForm.holidayDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={holidayForm.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => setShowHolidayForm(false)} 
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingHoliday ? 'Update Holiday' : 'Add Holiday'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

export default HolidayForm;