import React from "react";
import classnames from "classnames"
import "components/Appointment/styles.scss";

export default function Header(props) {
  const headerClass = classnames("appointment"
  );

  return (
    <main className="appointment__add">
      <img
        className="appointment__add-button"
        src="images/add.png"
        alt="Add"
        onClick={props.onAdd}
      />
    </main>
  );
}