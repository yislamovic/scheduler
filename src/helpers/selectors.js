export function getAppointmentsForDay(state, day) {
  const check = typeof state.days;
  const check2 = typeof state.appointments
  const results = [];
  if (check !== "undefined" && check2 !== "undefined") {

    const days = Object.values(state.days)
    const appointments = Object.values(state.appointments)
    const appointmentsID = [];

    for (const d of days) {

      if (day === d.name) {

        appointmentsID.push(d.appointments)
      }
    }

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
  let results = null;
  if (interview !== null) {
    for (const info in state.interviewers) {
      if (state.interviewers[info].id === interview.interviewer) {
        return results = { student: interview.student, interviewer: state.interviewers[info] }
      }
    }
  }
  return results
}