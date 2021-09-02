import React from "react";
import classnames from "classnames"
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty"

export default function Appointment(props) {
    const appointmentClass = classnames("appointment"
    );

    return (
        <article className={appointmentClass}>
            <Header time={props.time}></Header>
            {props.interview ?
                <Show student={props.interview.student} interviewer={props.interview.interviewer}>
                </Show> :
                <Empty>
                    
                </Empty>}
        </article>
    );
}
