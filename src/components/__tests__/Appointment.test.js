import React from "react";

import { render, cleanup } from "@testing-library/react";

import Appointment from "../Appointment/index"

afterEach(cleanup);

it("renders without crashing", () => {
  render(<Appointment />);
});
