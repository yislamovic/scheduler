import { useState } from "react";

//custom hook that allows us to transition modes and setHistory
export default function useVisualMode(initial) {
  //state mode and history
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  //transition function that takes in state/mode and defualt replace argument
  function transition(state, replace = false) {
    if (!replace) {
      //set the mode to the current state
      setMode(() => state);
      //update the history
      setHistory((prev) => [...prev, state]);
    }
    //if replace is true..
    else{
      //set the history; change the previous mode and replace it with the current mode
      setHistory((prev) => [...prev.slice(0, history.length - 1), state]);
      //set the mode to current state
      setMode(() => state);
    }
  }
  //function that transtions to the previous state
  function back() {
    //checks to see if the history has more than one mode
    if (history.length > 1) {
      //set the mode to its previous value
      setMode(() => {
        return history[history.length - 2];
      });
      //change the history accordingly
      setHistory((prev) => [...prev.slice(0, history.length - 1)]);
    }
  }
  //return the functions
  return { mode, transition, back };
}
