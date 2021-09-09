import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
export default function useApplicationData() {
  //this is the useState object for day, days, appointments and interviewers
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  //this function sets the day using setState
  const setDay = day => setState({ ...state, day });
  //useEffect handles changes in the while rendering
  useEffect(() => {
    const getData = async () => {
      try {
        //axios requests for days, appointments, and interviewers from sheduler-api
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
        //setState with the data from the axios requests
        setState(prev => ({ ...prev, days, appointments, interviewers }))
      } catch (err) {
        console.log(err)
      }
    }
    getData();
  }, []);
  //this function is responisble for updating the spots count
  function updateSpots(state, appointments){
    //find the data based on the state.day data
    const dayObj = state.days.find(day => day.name === state.day);

    //this counts the null apointments within the dayObj
    let spots = 0;
    for (const id of dayObj.appointments){
      const appointment = appointments[id];
      if(!appointment.interview){
        spots++
      }
    }
    //take the day obj and spread it; update it with the new spots count
    const day = {...dayObj, spots}
    //this returns the updated day object 
    const days = state.days.map(obj => obj.name === state.day ? day : obj)
    return days;
  }
  //function that books the interview 
  function bookInterview(id, interview) {
    //create a new appointment object that spreads the state
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    //add appointment and spreads state
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    //calls updateSpots and returns with a put request; updating the server
    const days = updateSpots(state, appointments);
    return (axios.put(`http://localhost:8001/api/appointments/${id}`, {
      interview
    })
    .then(() => {
      //updated the setState with the fresh data
      setState({
        ...state,
        appointments, days
      });
    }))
  }
  //function that cancels the interview
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    //calls updateSpots and returns with delete record in server
    const days = updateSpots(state, appointments);
    return (axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        setState({
          ...state,
          appointments, days
        });
      }));
  }
  //this is similar to bookInterview but this only changes records in server
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
  //returns all the functions 
  return {
    state, setDay, bookInterview, cancelInterview
    , editInterview
  }
}
