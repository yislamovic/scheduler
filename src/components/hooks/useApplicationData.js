import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:8001";

export default function useApplicationData() {
  //useState that manages data
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  //function to set the day
  const setDay = day => setState({ ...state, day });
  useEffect(() => {
    const getData = async () => {
      try {
        //promise for all get requests wrapped in a try/Catch
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
        setState(prev => ({ ...prev, days, appointments, interviewers }))
      } catch (err) {
        console.log(err)
      }
    }
    getData();
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
