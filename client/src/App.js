import React, { useState } from 'react';
import './App.css'; // Assuming you have some CSS styling in App.css

function App() {
  // State variables for start date, end date, and events with subcategories

  const eventCategories = {
    "Cultural Events": { selected: false, subcategories: { "Festivals": true, "Art exhibitions": true} },
    conference: { selected: false, subcategories: { networking: true, panels: true } },
    webinar: { selected: false, subcategories: { liveQnA: true, recordings: true } },
    workshop: { selected: false, subcategories: { handsOn: true, groupWork: true } },
    art: { selected: false, subcategories: { craft: true, exhibit: true } },
    "Cultural Events": { selected: false, subcategories: { Festivals: true, "Art exhibitions": true } },
    "Sports Events": { selected: false, subcategories: { "Races": true, "Tournaments": true } },
    "Sports Events": { selected: false, subcategories: { "Races": true, "Tournaments": true } },
  };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [events, setEvents] = useState(eventCategories);

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
      <h2>Filter Events</h2>
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
        <button type="submit">Filter</button>
      </form>
    </div>
  );
}

export default App;
