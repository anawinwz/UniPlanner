import React from 'react';
import styled from 'styled-components';

import Planner from '../components/Planner';

const Container = styled.div`
  margin: 0 auto;
  text-align: center;
`

function Main(props) {
  return (
    <Container>
      <Planner />
    </Container>
  )
}

export default Main;