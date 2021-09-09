import React from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";
import { useState } from 'react'
import "components/Appointment/styles.scss";

export default function Form(props) {
  //set states for the defualt values of name, inteviewer and error
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");
  //resets the fields and set interviewer to null
  const reset = () => {
    setName("");
    setInterviewer(null);
  };
  //cancels the form; calls reset
  const cancel = () => {
    reset();
    props.onCancel();
  };
  //function to validate if the form input is not empty
  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    setError("");
    props.onSave(name, interviewer);
  }
  
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off"
          onSubmit={event => event.preventDefault()}
        >
          <input
            data-testid="student-name-input"
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList 
        interviewers={props.interviewers} 
        value={interviewer} 
        setInterviewer={setInterviewer} 
        interviewer={interviewer}/>
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel </Button>
          <Button confirm
            onClick={() => validate()}
          >Save</Button>
        </section>
      </section>
    </main>
  );
}