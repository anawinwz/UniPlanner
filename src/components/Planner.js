import React, { useContext } from 'react';
import prompt from 'antd-prompt';
import { Tabs, Modal, Layout } from 'antd';

import { planContext, courseContext } from '../contexts';
import Courses from '../components/Courses';
import CourseTable from './CourseTable';
import Timetable from 'react-timetable-events'
import moment from 'moment';

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

export default (props) => {
  const { selected, plans, updatePlan } = useContext(planContext);
  const { courses } = useContext(courseContext);

  function onChange(activeKey) {
    updatePlan({selected: activeKey});
  }

  const actions = {
    add: async () => {
      const activeKey = require('randomkey')(6)
      
      try {
        const planName = await prompt({
          title: 'สร้างแผนใหม่',
          placeholder: 'ชื่อแผน',
          rules: [
            { required: true, message: 'กรุณากรอกชื่อแผนที่ต้องการสร้าง' }
          ],
          modalProps: {
            okText: 'สร้าง'
          }
        })
        updatePlan({
          selected: activeKey,
          plans: [...plans, {name: planName, courses: courses.filter(course => course.required && course.sections.length === 1).map(course => course.key+'_'+course.sections[0].key), key: activeKey}]
        })
      } catch (err) {

      }
      
    },
    remove: targetKey => {
      const target = plans.find(plan => plan.key === targetKey);
      Modal.confirm({
        title: 'ยืนยันการลบแผน',
        content: `คุณแน่ใจหรือว่าต้องการลบแผน [${target.name}]?`,
        onOk() {
          actions.removeConfirmed(targetKey);
        }
      });
    },
    removeConfirmed: targetKey => {
      if (plans.length === 1) {
        return false;
      }

      let activeKey = `${selected}`;
      let lastIndex;
      plans.forEach((plan, i) => {
        if (plan.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const newPlans = plans.filter(plan => plan.key !== targetKey);
      if (newPlans.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = newPlans[lastIndex].key;
        } else {
          activeKey = newPlans[0].key;
        }
      }
      updatePlan({ plans: newPlans, selected: activeKey });
    }
  };
  function onEdit(targetKey, action) {
    actions[action](targetKey);
  }

  let filteredCourses;
  let events;

  const createCourseList = () => {
    const plan = plans.find(plan => plan.key === selected);
    filteredCourses = courses.map(course => ({...course, sections: course.sections.filter(section => plan.courses.includes(`${course.key}_${section.key}`))}) )
                                    .filter(course => course.sections.length > 0)
    events = {M: [], T: [], W: [], Th: [], F: [], Sa: [], Su: []}
    filteredCourses.map(course => { course.sections[0].lects.map(lect => {
      lect.dow.map(dow => {
        if (typeof events[dow] === 'undefined') events[dow] = [];
        events[dow].push({
          id: `${course.key}_${course.sections[0].key}`,
          name: `${course.code} ${course.name} หมู่ ${course.sections[0].name}`,
          type: 'custom',
          startTime: moment(lect.start, 'H:mm'),
          endTime: moment(lect.end, 'H:mm')
        });
      });
    })});
  };

  createCourseList();
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsedWidth={0} breakpoint="lg">
        <p><small>บันทึกล่าสุด: {localStorage.lastUpdated || 'ไม่มี'}</small></p>
        <Courses />
      </Sider>
      <Content>
        <Tabs
          type="editable-card"
          onEdit={onEdit}
          onChange={onChange}
          activeKey={`${selected}`}
          tabBarStyle={{margin: 0}}>
          {plans.map((plan, idx) => {
            return <TabPane tab={plan.name} key={`${plan.key}`} closable={plans.length > 1}>
              <Timetable hoursInterval={[8,20]} timeLabel="เวลา" events={events} />
              <CourseTable filteredCourses={filteredCourses} />
            </TabPane>
          })}
        </Tabs>
        
      </Content>
    </Layout>
  
  )
}
