import React from "react";
import classnames from "classnames"
import Button from "components/Button";
import "components/Appointment/styles.scss";

export default function Status(props) {
  const headerClass = classnames("appointment"
  );

  return (
    <main className="appointment__card appointment__card--status">
      <img
        className="appointment__status-image"
        src="images/status.png"
        alt="Loading"
      />
      <h1 className="text--semi-bold">{props.message}</h1>
    </main>
  );
}