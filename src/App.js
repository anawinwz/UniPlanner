import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import NotFound from './pages/NotFound';

import './App.css'

import { planContext, courseContext } from './contexts';

function App() {
  const [plan, setPlan] = useState({
    selected: 'default',
    plans: [{
      name: 'แผนเริ่มต้น',
      courses: ["01204322_1","01205386_11"],
      key: 'default'
    }],
    updatePlan: update => setPlan(plan => ({...plan, ...update}))
  })
  const [course, setCourse] = useState({
    courses: [
      {"key":"01204322","credits":3,"name":"Embedded","required":true,"sections":[{"name":1,"lects":[{"dow":["M"],"start":"13:00","end":"16:00"}],"key":1}]},
      {"key":"01205386","credits":1,"name":"Elect.Lab.","required":true,"sections":[{"name":"11","lects":[{"dow":["Th"],"start":"13:00","end":"16:00"}],"key":"11"}]}
    ],
    updateCourse: update => setCourse(course => ({...course, ...update}))
  })
  return (
    <planContext.Provider value={plan}>
      <courseContext.Provider value={course}>
        <Router>
          <Switch>
            <Route exact={true} path="/" component={Main} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Router>
      </courseContext.Provider>
    </planContext.Provider>
  );
}

export default App;
