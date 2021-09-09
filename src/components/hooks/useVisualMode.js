import { useState } from "react";
//custom hook that handles transitions between modes
export default function useVisualMode(initial) {
  //setStates for mode and history
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  function transition(state, replace = false) {
    if (!replace) {
      //sets mode to transition to state
      setMode(() => state);
      //sets the history
      setHistory((prev) => [...prev, state]);
    }
    //if replace is true..
    else{
      //replace the current mode in history and replace it with new mode
      setHistory((prev) => [...prev.slice(0, history.length - 1), state]);
      setMode(() => state);
    }
  }
  function back() {
    //check to see if there are at least more than one items in history to move back to
    if (history.length > 1) {
      //sets mode with previous state/mode from history
      setMode(() => {
        return history[history.length - 2];
      });
      //sets the new history
      setHistory((prev) => [...prev.slice(0, history.length - 1)]);
    }
  }
  return { mode, transition, back };
}
