import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });
  useEffect(() => {
    const getData = async () => {
      try {
        const [days, appointments, interviewers] = await Promise.all([
          axios.get(`http://localhost:8001/api/days`).then((response) => {
            return response.data
          }),
          axios.get(`http://localhost:8001/api/appointments`).then((response) => {
            return response.data
          }),
          axios.get(`http://localhost:8001/api/interviewers`).then((response) => {
            return response.data
          })
        ]);
        setState(prev => ({ ...prev, days, appointments, interviewers }))
      } catch (err) {
        console.log(err)
      }
    }
    getData();
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({
      ...state,
      appointments
    });
    return axios.put(`http://localhost:8001/api/appointments/${id}`, {
      interview
    })
  }
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return (axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        setState({
          ...state,
          appointments
        });
      }));
  }
  function editInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return (axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
        setState({
          ...state,
          appointments
        });
      }));
  }
  return {
    state, setDay, bookInterview, cancelInterview
    , editInterview
  }
}