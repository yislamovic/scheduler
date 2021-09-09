import React from "react";
import classnames from "classnames"
import "../../components/Appointment/styles.scss";
import Show from "./Show";
import Empty from "./Empty"
import Status from "./Status"
import Form from "./Form"
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "../hooks/useVisualMode"
import Header from "./Header";

//these are the transition states/modes
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export const Appointment = (props) => {
    //classname
    const appointmentClass = classnames("appointment"
    );

    //custome hook useVisualMode; manages transition states
    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );
    
    //save function
    function save(name, interviewer) {
        //object that will contain the values from the form
        const interview = {
            student: name,
            interviewer
        };
        //transition to the saving mode
        transition(SAVING, true)
        //call the bookInterview function from Application
        props.bookInterview(props.id, interview)
            .then(() => {
                //transition to show
                transition(SHOW);
                
            })
            .catch(err => {
                console.log(err)
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
    //function that transitions mdoe to confirm
    function confirmDelete() {
        transition(CONFIRM)
    }
    //function that transitions the mode to edit
    function transitionEdit() {
        transition(EDIT)
    }
    //function that edits the interview
    function changeInterview(name, interviewer) {
        const interview = {
            student: name,
            interviewer
        };
        //transiton..
        transition(SAVING, true)
        //calls function from Application
        props.editInterview(props.id, interview)
            .then(() => {
                transition(SHOW);
            })
            .catch(err => {
                transition(ERROR_SAVE, true)
            })
    }
    //renders the header and appointment; renders all other components based on the mode state..
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
