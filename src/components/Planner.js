import React, { useContext } from 'react';
import prompt from 'antd-prompt';
import { Tabs, Modal, message } from 'antd';

import { planContext, courseContext } from '../contexts';
import CourseTable from './CourseTable';
import TimeTable from './TimeTable';

const { TabPane } = Tabs;

export default (props) => {
  const { selected, plans, updatePlan } = useContext(planContext);
  const planIdx = plans.findIndex(plan => plan.key === selected);
  const plan = plans[planIdx];

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
        const requiredCourses = courses.filter(course => course.required);
        const autoAddCourses = requiredCourses.filter(course => course.sections.length === 1).map(course => course.key+'_'+course.sections[0].key);

        updatePlan({
          selected: activeKey,
          plans: [...plans, {name: planName, courses: autoAddCourses, key: activeKey}]
        })

        if (requiredCourses.length === 0 || requiredCourses.length === autoAddCourses.length) {
          message.success(requiredCourses.length > 0 ? `สร้างแผนใหม่ที่มี ${requiredCourses.length} วิชาบังคับสำเร็จ` : `สร้างแผนใหม่สำเร็จ`);
        } else {
          message.info(`มี ${requiredCourses.length - autoAddCourses.length} วิชาบังคับที่มีมากกว่า 1 หมู่เรียน โปรดจัดวางด้วยตนเองอีกครั้ง`);
        }
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
  async function onTabClick(key) {
    if (key !== selected) return;
    try {
      let planName = await prompt({
        title: 'แก้ไขชื่อแผน',
        placeholder: plan.name,
        value: plan.name,
        modalProps: {
          okText: 'แก้ไข'
        }
      })
      
      if (!planName) planName = plan.name;

      const newPlan = [...plans];
      newPlan[planIdx].name = planName;
      updatePlan({ plans: newPlan });
    } catch (err) {

    }
  }

  const filteredCourses = courses.map(course => ({...course, sections: course.sections.filter(section => plan.courses.includes(`${course.key}_${section.key}`))}) )
                                .filter(course => course.sections.length > 0);
  
  return (
    <Tabs
      type="editable-card"
      onEdit={onEdit}
      onChange={onChange}
      activeKey={`${selected}`}
      tabBarStyle={{margin: 0}}
      onTabClick={onTabClick}>
      {plans.map((plan, idx) => {
        return <TabPane tab={plan.name} key={`${plan.key}`} closable={plans.length > 1}>
          <TimeTable filteredCourses={filteredCourses} />
          <CourseTable filteredCourses={filteredCourses} />
        </TabPane>
      })}
    </Tabs>
  )
}
