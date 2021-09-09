export function getAppointmentsForDay(state, day) {
  //checks for undefined values
  const check = typeof state.days;
  const check2 = typeof state.appointments
  const results = [];
  if (check !== "undefined" && check2 !== "undefined") {
    //gets values of objects
    const days = Object.values(state.days)
    const appointments = Object.values(state.appointments)
    const appointmentsID = [];

    //finds the day; pushes id into array
    for (const d of days) {
      if (day === d.name) {
        appointmentsID.push(d.appointments)
      }
    }

    //finds the ID nad pushed appointment to results
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
  return results ? results : []
}

export function getInterview(state, interview) {
  //checks if interview exists
  if (!interview) {
    return null
  }
 
  //adds the interviewer and student object into new obj 
  let results = null;
  const interviewerObj = {};
  const interviewerID = interview.interviewer;
  interviewerObj.student = interview.student;
  interviewerObj.interviewer = state.interviewers[interviewerID];
  results = interviewerObj;

  return results;
}

//gets interviewers for day; similar code get appointments for day
export function getInterviewersForDay(state, day) {
  const check = typeof state.days;
  const check2 = typeof state.interviewers
  const results = [];
  if (check !== "undefined" && check2 !== "undefined") {
    const days = Object.values(state.days)
    const interviewers = Object.values(state.interviewers)
    const interviewersID = [];

    for (const d of days) {
      if (day === d.name) {
        interviewersID.push(d.interviewers)
      }
    }

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