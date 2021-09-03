
import "components/Application.scss";
import DayList from "components/DayList"
import React, { useState } from "react";
import Appointment from "components/Appointment/index";
import axios from "axios";
import { useEffect } from "react";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
  },
  {
    id: 4,
    time: "3pm",
  },
  {
    id: 5,
    time: "4pm",
  },
];


export default function Application(props) {
  const [days, setDay] = useState([]);
  //useEffect loads sidebar for /api/days
  useEffect(() => {
    axios.get(`http://localhost:8001/api/days`)
      .then((response) => {
        console.log(response.data);
        setDay(response.data);
        console.log(days)
      });
  }, []);

  const timeSlots = appointments.map(slot => {

    return (
      <Appointment
        key={slot.id}
        {...slot}
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
            days={days}
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
