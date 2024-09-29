import React, { useState } from 'react';
import { fetchEvents, fetchEventDetails } from './api';
import './App.css'; // Assuming you have some CSS styling in App.css

function App() {
  // State variables for start date, end date, and events with subcategories

  const eventCategories = {
    "Nightlife": { selected: false, subcategories: { "Concerts": true, "Theater": true, "Clubs/Bars": true, } },
    "Sports": { selected: false, subcategories: { "Games": true, "Fitness": true, "Outdoor": true, } },
    "Arts": { selected: false, subcategories: { "Exhibits": true, "Festivals": true, "Classes": true, } },
    "Food/Drink": { selected: false, subcategories: { "Festivals": true, "Classes": true, "Dinners": true, } },
    "Community": { selected: false, subcategories: { "Volunteer": true, "Meetups": true, "Charity": true, } },
    "Education": { selected: false, subcategories: { "Talks": true, "Clases": true, "Tours": true, } },
    "Wellness": { selected: false, subcategories: { "Retreats": true, "Screenings": true, "Support": true, } },
    "Shopping": { selected: false, subcategories: { "Markets": true, "Flea Market": true, "Pop-ups": true, } },
    "Tech": { selected: false, subcategories: { "Conferences": true, "Hackathon": true, "Launches": true, } },
    "Outdoor": { selected: false, subcategories: { "Walks": true, "Festivals": true, "Adventure": true, } },
  };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [events, setEvents] = useState(eventCategories);
  const [customCategory, setCustomCategory] = useState('');

  // Function to handle changes in event checkboxes
  const handleEventChange = (event) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [event]: {
        ...prevEvents[event],
        selected: !prevEvents[event].selected,
        subcategories: Object.fromEntries(
          Object.entries(prevEvents[event].subcategories).map(([key, _]) => [key, !prevEvents[event].selected])
        ),
      },
    }));
  };

  // Function to handle changes in subcategory checkboxes
  const handleSubcategoryChange = (event, subcategory) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [event]: {
        ...prevEvents[event],
        subcategories: {
          ...prevEvents[event].subcategories,
          [subcategory]: !prevEvents[event].subcategories[subcategory],
        },
      },
    }));
  };

  // Function to select all categories and subcategories
  const handleSelectAll = () => {
    setEvents((prevEvents) => {
      const updatedEvents = {};
      for (const [event, data] of Object.entries(prevEvents)) {
        updatedEvents[event] = {
          ...data,
          selected: true,
          subcategories: Object.fromEntries(Object.entries(data.subcategories).map(([key]) => [key, true])),
        };
      }
      return updatedEvents;
    });
  };

  // Function to deselect all categories and subcategories
  const handleDeselectAll = () => {
    setEvents((prevEvents) => {
      const updatedEvents = {};
      for (const [event, data] of Object.entries(prevEvents)) {
        updatedEvents[event] = {
          ...data,
          selected: false,
          subcategories: Object.fromEntries(Object.entries(data.subcategories).map(([key]) => [key, false])),
        };
      }
      return updatedEvents;
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Selected Events and Subcategories:', events);
  };

  return (
    <div className="App">
      <h1>Pittsburgh Event Finder</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="start-date">Start Date:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="end-date">End Date:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="form-group event-options">
          <label>Event Types:</label>
          {Object.entries(events).map(([event, { selected, subcategories }]) => (
            <div key={event} className="event-option">
              <label>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleEventChange(event)}
                />
                {event.charAt(0).toUpperCase() + event.slice(1)}
              </label>
              {selected && (
                <div className="subcategories">
                  {Object.entries(subcategories).map(([subcategory, checked]) => (
                    <label key={subcategory} className="subcategory-option">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleSubcategoryChange(event, subcategory)}
                      />
                      {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={handleSelectAll}>
            Select All
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleDeselectAll}>
            Deselect All
          </button>
          <input
            type="text"
            className="custom-category-input"
            maxLength="20"
            placeholder="Add custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" 
            onClick={async () => {
              let resp = await fetchEvents("september 28th 2024", "october 1st 2024", customCategory)
              console.log("[RESPONSE]: ", resp);
            }
            }>
            Search Events
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
