import React from "react";
// import "components/Appointment/styles.scss";

export default function Empty(props) {
  return (
    <main className="appointment__add" onClick={props.onAdd}>
      <button className="appointment__add-text-button">
        +
      </button>
    </main>
  );
}