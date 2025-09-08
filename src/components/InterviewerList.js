import React from "react";
// import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";
import PropTypes from 'prop-types';
export default function InterviewerList(props, id) {

  //maps through interviewers and renders them to InterviewListItem Component
  const interviewers = props.interviewers && props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem
        key={interviewer.id}
        id={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={interviewer.id === props.interviewer}
        setInterviewer={() => props.setInterviewer(interviewer.id)}
      />
    )
  });
  InterviewerList.propTypes = {
    interviewers: PropTypes.array.isRequired
  };
  // Find the selected interviewer to display their name
  const selectedInterviewer = props.interviewers && props.interviewers.find(interviewer => interviewer.id === props.interviewer);
  const selectedName = selectedInterviewer ? selectedInterviewer.name : '';

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">
        Interviewer{selectedName ? ` - ${selectedName}` : ''}
      </h4>
      <ul className="interviewers__list">
        {interviewers}
      </ul>
    </section>
  );

}