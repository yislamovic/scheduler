//this function gets the appointments for the day
export function getAppointmentsForDay(state, day) {
  //checks these for undefined
  const check = typeof state.days;
  const check2 = typeof state.appointments
  const results = [];
  //the said 'check'..
  if (check !== "undefined" && check2 !== "undefined") {
    const days = Object.values(state.days)
    const appointments = Object.values(state.appointments)
    const appointmentsID = [];
    //loops through days
    for (const d of days) {
      //finds day
      if (day === d.name) {
        //push the id to array
        appointmentsID.push(d.appointments)
      }
    }
    //this process gets the appointment 
    if (appointmentsID[0]) {
      for (const id of appointmentsID[0]) {
        for (const app of appointments) {
          if (id === app.id) {
            results.push(app)
          }
        }
      }
    }
  }
  //returns the results; returns empty array if not match..
  return results ? results : []
}

//this function gets interview
export function getInterview(state, interview) {
  //checks the interview if it exists
  if (!interview) {
    return null
  }
  //defualt values of results is null
  let results = null;
  const interviewerObj = {};
  //set the interviewer id
  const interviewerID = interview.interviewer;
  //add the values to object
  interviewerObj.student = interview.student;
  //add the correct interviewer data based on the ID
  interviewerObj.interviewer = state.interviewers[interviewerID];
  //results is equal to the object
  results = interviewerObj;
  //return results
  return results;
}

//this function returns the interview for the day
export function getInterviewersForDay(state, day) {
  //checks the values id they are undefined
  const check = typeof state.days;
  const check2 = typeof state.interviewers
  const results = [];
  //check
  if (check !== "undefined" && check2 !== "undefined") {
    //gets the value of days object and interviewers
    const days = Object.values(state.days)
    const interviewers = Object.values(state.interviewers)
    const interviewersID = [];
    //loops thorugh days
    for (const d of days) {
      if (day === d.name) {
        interviewersID.push(d.interviewers)
      }
    }
    //finds the interview and pushed it results
    if (interviewersID[0]) {
      for (const id of interviewersID[0]) {
        for (const inter of interviewers) {
          if (id === inter.id) {
            results.push(inter)
          }
        }
      }
    }
  }
  return results ? results : []
}