
import "components/Application.scss";
import DayList from "components/DayList"
import React, { useState } from "react";
import Appointment from "components/Appointment/index";
import axios from "axios";
import { useEffect } from "react";
import { getAppointmentsForDay, getInterview } from "helpers/selectors"

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
  const setDays = days => setState(prev => ({ ...prev, days }));
  const setApp = appointments => setState(prev => ({ ...prev, appointments }));
  const setInter = interviewers => setState(prev => ({ ...prev, interviewers }));
  //useEffect loads sidebar for /api/days
  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`)
    ]).then((data) => {
      setDays([...data[0].data]);
      setApp(data[1].data);
      setInter(data[2].data);
      console.log(data[2].data);
    }).catch(err => {
      console.log(err)
    })
  }, []);
  dailyAppointments = getAppointmentsForDay(state, state.day);
  const timeSlots = Object.values(dailyAppointments).map(slot => {
    const interview = getInterview(state, slot.interview);
    return (
      <Appointment
        key={slot.id}
        {...slot}
        interview={interview}
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
