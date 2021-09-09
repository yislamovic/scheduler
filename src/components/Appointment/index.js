import React, { useState } from "react";
import classnames from "classnames"
import "components/Appointment/styles.scss";
import Show from "./Show";
import Empty from "./Empty"
import Status from "./Status"
import Form from "./Form"
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "../hooks/useVisualMode"
import Header from "./Header";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";
export default function Appointment(props) {

    const appointmentClass = classnames("appointment"
    );
    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );
    
    function save(name, interviewer) {
        const interview = {
            student: name,
            interviewer
        };
        transition(SAVING, true)
        props.bookInterview(props.id, interview)
            .then(() => {
                transition(SHOW);
                
            })
            .catch(err => {
                transition(ERROR_SAVE, true)
            })

    }
    function deleteInterview() {
        transition(DELETING, true)
        props.cancelInterview(props.id)
            .then(() => {
                transition(EMPTY);
            })
            .catch(err => {
                transition(ERROR_DELETE, true)
            })
    }
    function confirmDelete() {
        transition(CONFIRM)
    }
    function transitionEdit() {
        transition(EDIT)
    }
    function changeInterview(name, interviewer) {
        const interview = {
            student: name,
            interviewer
        };
        transition(SAVING, true)
        props.editInterview(props.id, interview)
            .then(() => {
                transition(SHOW);
            })
            .catch(err => {
                transition(ERROR_SAVE, true)
            })
    }
    console.log(props.interview)
    return (
        <article className={appointmentClass}>
            <Header time={props.time}></Header>
            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode === SHOW && (
                <Show
                    student={props.interview.student}
                    interviewer={props.interview.interviewer}
                    onDelete={confirmDelete}
                    onEdit={transitionEdit}
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
            {mode === EDIT && <Form
                name={props.interview.student}
                interviewer={props.interview.interviewer.id}
                interviewers={props.interviewers}
                onCancel={back}
                onSave={changeInterview}
            />}
            {mode === ERROR_SAVE && <Error
                message={"Could not save interview."}
                onClose={() => back()}
            />}
            {mode === ERROR_DELETE && <Error
                message={"Could not cancel appointment."}
                onClose={() => back()}
            />}
        </article>
    );
}
