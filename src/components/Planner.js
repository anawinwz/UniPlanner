import React, { useContext, useState } from 'react';
import { Tabs, Modal, Layout } from 'antd';

import { planContext, courseContext } from '../contexts';
import Courses from '../components/Courses';

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

// const operations = <Button>เพิ่ม Plan</Button>;

export default (props) => {
  const [newIdx, setNewIdx] = useState(1);
  const { selected, plans, updatePlan } = useContext(planContext);
  const { courses } = useContext(courseContext);

  function onChange(activeKey) {
    updatePlan({selected: activeKey});
  }

  const actions = {
    add: () => {
      const activeKey = `plan${newIdx}`
      updatePlan({
        selected: activeKey,
        plans: [...plans, {name: `แผน ${newIdx}`, courses: courses.filter(course => course.required && course.sections.length === 1).map(course => course.key+'_'+course.sections[0].key), key: activeKey}]
      })
      setNewIdx(newIdx => newIdx + 1)
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider><Courses /></Sider>
      <Content>
        <Tabs
          type="editable-card"
          onEdit={onEdit}
          onChange={onChange}
          activeKey={`${selected}`}>
          {plans.map((plan, idx) => 
            <TabPane tab={plan.name} key={`${plan.key}`} closable={plans.length > 1}>
              
                Content
            </TabPane>
          )}
        </Tabs>
      </Content>
    </Layout>
  
  )
}
