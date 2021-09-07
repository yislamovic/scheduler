
import "components/Application.scss";
import DayList from "components/DayList"
import React, { useState } from "react";
import Appointment from "components/Appointment/index";
import axios from "axios";
import { useEffect } from "react";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors"

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  let dailyAppointments = [];
  const setDay = day => setState({ ...state, day });
  //updating with prev
  // const setDays = days => setState(prev => ({ ...prev, days }));
  // const setApp = appointments => setState(prev => ({ ...prev, appointments }));
  // const setInter = interviewers => setState(prev => ({ ...prev, interviewers }));
  //useEffect loads sidebar for /api/days
  useEffect(() => {
    // Promise.all([
    //   axios.get(`http://localhost:8001/api/days`),
    //   axios.get(`http://localhost:8001/api/appointments`),
    //   axios.get(`http://localhost:8001/api/interviewers`)
    // ]).then((data) => {
    //   setDays([...data[0].data]);
    //   setApp(data[1].data);
    //   console.log(data[2].data, "this is application")
    //   setInter(data[2].data);
    // }).catch(err => {
    //   console.log(err)
    // })
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
  function cancelInterview(id){
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return (axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(() =>{
      setState({
        ...state,
        appointments
      });
    }));
  }
  //const interviewersForDay = getInterviewersForDay(state, state.day);
  dailyAppointments = getAppointmentsForDay(state, state.day);
  const timeSlots = Object.values(dailyAppointments).map(slot => {
    const interview = getInterview(state, slot.interview);
    const interviewersForDay = getInterviewersForDay(state, state.day);
    console.log(slot);
    return (
      <Appointment
        key={slot.id}
        {...slot}
        interview={interview}
        interviewers={interviewersForDay}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {timeSlots}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
