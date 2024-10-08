import axios from 'axios';

// Define your backend API base URL
const base_url = process.env.REACT_APP_FLASK_URL; // Replace with your actual backend URL
console.log("[URL]: ", base_url)

// Example function to fetch events from the backend
export const fetchEvents = async (start, end, type) => {
  try {
    console.log("[FETCH] fetching events between ", start, "-", end, " of type: ",type);
    const response = await axios.get(`${base_url}/events?start=${start}&end=${end}&type=${type}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error; // Rethrow the error if you want to handle it elsewhere
  }
};

// Example function to fetch event detailed information from the backend
export const fetchEventDetails = async (start, end, event) => {
  try {
    const response = await axios.get(`${base_url}/events/details?start=${start}&end=${end}&event=${event}`);
    return response.data;
  } catch (error) {
    console.error('Error submitting filter:', error);
    throw error;
  }
};

