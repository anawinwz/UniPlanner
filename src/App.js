import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import NotFound from './pages/NotFound';

import { planContext, courseContext } from './contexts';

function App() {
  const [plan, setPlan] = useState({
    selected: 'default',
    plans: [{
      name: 'แผนเริ่มต้น',
      courses: [],
      key: 'default'
    }],
    updatePlan: update => setPlan(plan => ({...plan, ...update}))
  })
  const [course, setCourse] = useState({
    courses: [],
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
