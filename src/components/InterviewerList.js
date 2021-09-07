import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";
export default function InterviewerList(props, id) {
  // const findInterviewer = (props) => {

  //   for(const i of props){
  //     if(i.id === id){
  //       return <li className="interviewers__item">
  //     <img
  //       className="interviewers__item-image"
  //       src={i.avatar}
  //       alt={i.name}
  //     />
  //     {i.name}
  //   </li>
  //     }
  //   }
  // };
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
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers}
      </ul>
    </section>
  );
}