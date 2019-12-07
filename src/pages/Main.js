import React from 'react';
import styled from 'styled-components';

import Planner from '../components/Planner';
import Courses from '../components/Courses';

import { Layout } from 'antd';
const { Sider, Content } = Layout;

const Container = styled.div`
  margin: 0 auto;
  text-align: center;
`

function Main(props) {
  return (
    <Container>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsedWidth={0} breakpoint="lg">
          <h1>
            UniPlanner<br/>
            <small><a href="https://github.com/anawinwz/" target="_blank">@AnawinWz</a></small>
          </h1>
          <p><small>บันทึกล่าสุด: {localStorage.lastUpdated || 'ไม่มี'}</small></p>
          <Courses />
        </Sider>
        <Content>
          <Planner />
        </Content>
      </Layout>
    </Container>
  )
}

export default Main;