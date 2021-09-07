import React, { useState } from "react";
import classnames from "classnames"
import "components/Appointment/styles.scss";
import Show from "./Show";
import Empty from "./Empty"
import Status from "./Status"
import Form from "./Form"
import Confirm from "./Confirm";
import useVisualMode from "../hooks/useVisualMode"

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE"
const SAVING = "SAVING"
const DELETING = "DELETING"
const CONFIRM = "CONFIRM"
export default function Appointment(props) {

    const appointmentClass = classnames("appointment"
    );
    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );
    const [msg, setMsg] = useState(props.message || "");
    // useEffect(() => {
    //     if(props.interview && mode === EMPTY){
    //         transition(SHOW)

    //     }
    //     if(props.interview === null && mode === SHOW){
    //         transition(EMPTY)

    //     }

    // },[props.interview, transition, mode])
    function save(name, interviewer) {
        const interview = {
            student: name,
            interviewer
        };
        transition(SAVING)
        props.bookInterview(props.id, interview)
            .then(() => {
                transition(SHOW);
            })

    }
    function deleteInterview() {
        transition(DELETING)
        props.cancelInterview(props.id)
            .then(() => {
                transition(EMPTY);
            })
    } 
    function confirmDelete(){
        transition(CONFIRM)
    }
    console.log(props.interview)
    return (
        <article className={appointmentClass}>
            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode === SHOW && (
                <Show
                    student={props.interview.student}
                    interviewer={props.interview.interviewer}
                    onDelete={confirmDelete}
                />
            )}
            {mode === SAVING && <Status message={
                "Saving"
            } />}
            {mode === DELETING && <Status message={
                "Deleting"
            } />}
            {mode === CONFIRM && <Confirm
                message={"Delete the appointment?"}
                onDelete={deleteInterview}
                onCancel={back}
            />}
            {mode === CREATE && <Form
                interviewers={props.interviewers}
                onCancel={back}
                onSave={save}
            />}
        </article>
    );
}
