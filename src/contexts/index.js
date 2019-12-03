import React from "react";

export const planContext = React.createContext({
  selected: null,
  plans: [],
  updatePlan: () => {}
});

export const courseContext = React.createContext({
  courses: {},
  updateCourse: () => {}
})