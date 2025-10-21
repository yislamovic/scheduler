
// import "components/Application.scss";
import DayList from "components/DayList"
import React from "react";
import Appointment from "components/Appointment/index";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors"
import useApplicationData from "./hooks/useApplicationData"
import SessionBadge from "components/SessionBadge"

export default function Application(props) {
  //state and functions from useApplicationData
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    editInterview
  } = useApplicationData();

  //call interviewersForDay from helpers; gets all the interviewer data for that day
  const interviewersForDay = getInterviewersForDay(state, state.day);

  //calls getAppointmentForDay and maps through the values of appointment
  const timeSlots = Object.values(getAppointmentsForDay(state, state.day)).map(slot => {

    //returns a unique Appointment components with props
    return (
      <Appointment
        key={slot.id}
        {...slot}
        interview={getInterview(state, slot.interview)}
        interviewers={interviewersForDay}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
        editInterview={editInterview}
      />
    );
  });

  //renders DayList and Appointment components
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
      <SessionBadge sessionId={state.sessionId} />
    </main>
  );
}
