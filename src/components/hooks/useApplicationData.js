import { useState, useRef } from "react";
import { useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8001";

// Generate a unique session ID for this browser tab
// Using a ref to ensure it persists across renders but NOT across page refreshes
let sessionId = null;

// Axios interceptor to add session ID to all requests
axios.interceptors.request.use((config) => {
  if (sessionId && config.url.includes(API_BASE_URL)) {
    config.headers['x-session-id'] = sessionId;
  }
  return config;
});

export default function useApplicationData() {
  //useState that manages data
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
    sessionId: null
  });

  //function to set the day
  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    const initSession = async () => {
      try {
        // Create a new session on every mount (page refresh = new session)
        const response = await axios.post(`${API_BASE_URL}/api/session/init`);
        sessionId = response.data.sessionId;
        console.log('Session initialized:', sessionId);

        // Fetch data with the new session ID
        const [days, appointments, interviewers] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/days`).then((response) => {
            return response.data
          }),
          axios.get(`${API_BASE_URL}/api/appointments`).then((response) => {
            return response.data
          }),
          axios.get(`${API_BASE_URL}/api/interviewers`).then((response) => {
            return response.data
          })
        ]);

        //setState with the retrieved data from axios
        setState(prev => ({ ...prev, days, appointments, interviewers, sessionId }))
      } catch (err) {
        console.log('Session initialization error:', err)
      }
    }
    initSession();
  }, []);

  function updateSpots(state, appointments) {
    const dayObj = state.days.find(day => day.name === state.day);

    let spots = 0;
    //counts all the null interview spots
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++
      }
    }
    //places updated spots values in object
    const day = { ...dayObj, spots }
    const days = state.days.map(obj => obj.name === state.day ? day : obj)
    return days;
  }

  function bookInterview(id, interview) {
    //spread state and add the interview in obj
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    //add new obj to appointments 
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(state, appointments);
    return (axios.put(`${API_BASE_URL}/api/appointments/${id}`, {
      interview
    })
      //when the put request is succesful; update appointments and spots with setState
      .then(() => {
        setState({
          ...state,
          appointments, days
        });
      }))
  }
  //cancels interview.. similar code as before
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(state, appointments);
    //delete request instead of put..
    return (axios.delete(`${API_BASE_URL}/api/appointments/${id}`)
      .then(() => {
        setState({
          ...state,
          appointments, days
        });
      }));
  }
  //edits the interviews in server
  function editInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    //put request to change data in server
    return (axios.put(`${API_BASE_URL}/api/appointments/${id}`, { interview })
      .then(() => {
        setState({
          ...state,
          appointments
        });
      }));
  }
  return { //returns all the functions
    state, setDay, bookInterview, cancelInterview
    , editInterview
  }
}
