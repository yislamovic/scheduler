import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  function transition(state, replace = false) {
    if (!replace) {
      setMode(() => state);
      setHistory((prev) => [...prev, state]);
    }
    else{
      setHistory((prev) => [...prev.slice(0, history.length - 1), state]);
      setMode(() => state);
    }
  }
  function back() {
    if (history.length > 1) {
      setMode(() => {
        return history[history.length - 2];
      });
      setHistory((prev) => [...prev.slice(0, history.length - 1)]);
    }
  }
  return { mode, transition, back };
}
