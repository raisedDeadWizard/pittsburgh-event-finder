import React, { useState } from 'react';
import { fetchEvents, fetchEventDetails } from './api';
import './App.css'; // Assuming you have some CSS styling in App.css
import { ClipLoader } from 'react-spinners';

function App() {
  // State variables for start date, end date, and events with subcategories

  const eventCategories = {
    "Nightlife": { selected: false, subcategories: { "Concerts": false, "Theater": false, "Clubs/Bars": false, } },
    "Sports": { selected: false, subcategories: { "Games": false, "Fitness": false, "Outdoor": false, } },
    "Arts": { selected: false, subcategories: { "Exhibits": false, "Festivals": false, "Classes": false, } },
    "Food/Drink": { selected: false, subcategories: { "Festivals": false, "Classes": false, "Dinners": false, } },
    "Civic": { selected: false, subcategories: { "Town Hall": false, "Voting": false, "Volunteer": false, } },
    "Education": { selected: false, subcategories: { "Talks": false, "Clases": false, "Tours": false, } },
    "Wellness": { selected: false, subcategories: { "Retreats": false, "Screenings": false, "Support": false, } },
    "Shopping": { selected: false, subcategories: { "Markets": false, "Flea Market": false, "Pop-ups": false, } },
    "Tech": { selected: false, subcategories: { "Conferences": false, "Hackathon": false, "Launches": false, } },
    "Outdoor": { selected: false, subcategories: { "Walks": false, "Festivals": false, "Adventure": false, } },
  };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [events, setEvents] = useState(eventCategories);
  const [eventList, setEventList] = useState([]);
  const [customCategory, setCustomCategory] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function to get today's date in YYYY-MM-DD format
  const getToday = () => new Date().toISOString().split('T')[0];

  // Helper function to get the date 7 days from today
  const getSevenDaysFromToday = () => {
    const today = new Date();
    const nextWeek = new Date(today.setDate(today.getDate() + 7));
    return nextWeek.toISOString().split('T')[0];
  };

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Set defaults for the start and end dates
    let finalStartDate = startDate || getToday(); // Default to today if start date not set
    let finalEndDate = endDate || (startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 7)).toISOString().split('T')[0] : getSevenDaysFromToday()); // Default to 7 days later

    if (endDate && !startDate) {
      finalStartDate = endDate; // Set start date to end date if only end date is provided
    }

    // Gather selected categories and subcategories
    const selectedCategories = [];
    for (const [category, data] of Object.entries(events)) {
      if (data.selected) {
        const selectedSubcategories = Object.entries(data.subcategories)
          .filter(([_, isChecked]) => isChecked)
          .map(([subcategory]) => subcategory);
        selectedCategories.push(`${category}: ${selectedSubcategories.join(', ')}`);
      }
    }

    const category = selectedCategories.join('; '); // Create formatted string of selected categories

    console.log('Start Date:', finalStartDate);
    console.log('End Date:', finalEndDate);
    console.log('Categories:', category);

    // Pass these to the API or logic that fetches events
    try {
      let resp = await fetchEvents(finalStartDate, finalEndDate, category || customCategory);
      setEventList(resp.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false); // Set loading to false once the fetch completes
    }
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
          <button type="submit" className="btn btn-primary">
            Search Events
          </button>
        </div>
      </form>
      
      {/* Loading spinner */}
      {loading ? (
        <div className="loading">
          <ClipLoader size={50} color={"#123abc"} loading={true} />
          <p>Loading events...</p>
        </div>
      ) : (
        <div className="event-list">
          {eventList.length > 0 ? (
            eventList.map((event, index) => (
              <div key={index} className="event-item">
                <h3>{event.event.name}</h3>
                <p><b>Date:</b> {event.event.date}</p>
                <p><b>Time:</b> {event.event.time}</p>
                <p><b>Location:</b> {event.event.location}</p>
                <p><b>Description:</b> {event.event.description}</p>
                <p><b>Sources:</b> {event.event["web-sources"] && event.event["web-sources"].map((source, i) => (
                  <a key={i} href={source} target="_blank" rel="noopener noreferrer">Source {1 + i}, </a>
                ))}
                </p>
              </div>
            ))
          ) : (
            <p>No events found. Please search to display events.</p>
          )}
        </div>
      )}

      <p>Event listings are generated via AI webscraping of at least three different sources. Before attending an event, do a personal confirmation of the information's correctness.</p>
    </div>
  );
}

export default App;
