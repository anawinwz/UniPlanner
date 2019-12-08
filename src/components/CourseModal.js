import React, { useContext, createRef } from 'react';

import { Modal, Popconfirm, Button, Icon, message } from 'antd';

import { isNonEmpty } from '../utils/check';
import { courseContext, planContext } from '../contexts';
import CourseForm from './CourseForm';

export default (props) => {
  const { courses, updateCourse } = useContext(courseContext);
  const { plans, updatePlan } = useContext(planContext);
  
  const mode = (props.courseKey) ? 'edit' : 'add';
  let targetIdx, targetInfo
  if (mode === 'edit') {
    targetIdx = courses.findIndex(course => course.key === props.courseKey);
    targetInfo = courses[targetIdx];
  }
  
  const formRef = createRef();
  function handleOk() {
    const { form } = formRef.current;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      delete values.isChanged;
      if (!values.key) values.key = require('randomkey')(6);
      values.sections = values.sections.map((section, idx) => {
        if (!section.name) section.name = idx + 1;
        if (!section.key) section.key = require('randomkey')(6);
        section.lects = section.lects.map(lect => {
          lect.start = lect.start.format('H:mm');
          lect.end = lect.end.format('H:mm');
          return lect;
        })
        return section;
      });

      if (mode === 'edit') {
        const newCourses = [...courses];
        newCourses[targetIdx] = values;
        updateCourse({ courses: newCourses });
      } else {
        updateCourse({ courses: [...courses, values] });
      }

      if (values.required && !targetInfo.required) {
        if (values.sections.length > 1) {
          message.info('วิชาบังคับนี้มีมากกว่า 1 หมู่เรียน โปรดจัดวางลงในแผนด้วยตนเอง', 4000);
        } else {
          Modal.confirm({
            title: 'วิชาบังคับใหม่',
            content: <p>คุณเพิ่งเปลี่ยนให้ [{values.name}] เป็นวิชาบังคับ<br />ต้องการนำไปจัดวางในทุกแผนหรือไม่?</p>,
            onOk() {
              const newPlans = [...plans];
              let addedCount = 0;
              plans.map((plan, idx) => {
                if (!plan.courses.find(key => key.indexOf(values.key) !== -1)) {
                  newPlans[idx].courses.push(`${values.key}_${values.sections[0].key}`);
                  addedCount++;
                }
              });
              
              if (addedCount > 0) {
                message.success(`เพิ่มวิชาบังคับนี้ลงไปใน ${addedCount} แผนแล้ว`)
                updatePlan({plans: newPlans});
              } else { 
                message.info(`ทุกแผนจัดวางวิชานี้ไว้อยู่แล้ว`)
              }
            },
            okText: 'ใช่',
            cancelText: 'ไม่'
          });
        }
      }

      if (typeof props.handleOk === 'function') props.handleOk();
    });
  }
  function handleCancel() {
    const { form } = formRef.current;
    const values = form.getFieldsValue()

    if (values.isChanged && isNonEmpty(values)) {
      Modal.confirm({
        title: 'ยืนยันการยกเลิก',
        content: `คุณแน่ใจหรือว่าต้องการยกเลิกความเปลี่ยนแปลง?`,
        onOk() {
          if (typeof props.handleCancel === 'function') props.handleCancel();
        },
        okText: 'ใช่',
        cancelText: 'ไม่'
      });
    } else {
      if (typeof props.handleCancel === 'function') props.handleCancel();
    }
  }
  function removeThisCourse() {
    if (mode !== 'edit') return;

    const newCourses = [...courses];
    newCourses.splice(targetIdx, 1);
    updateCourse({ courses: newCourses });
    if (typeof props.handleCancel === 'function') props.handleCancel();
  }

  return <Modal
    centered
    title={mode === 'edit' ? `แก้ไขข้อมูลรายวิชา` : `เพิ่มข้อมูลรายวิชา`}
    visible={props.visible}
    footer={[
      <Button key="back" onClick={handleCancel}>
        ยกเลิก
      </Button>,

      mode === 'edit' ? <Popconfirm
        title="ต้องการลบวิชานี้หรือไม่?"
        onConfirm={removeThisCourse}
        okText="ลบ"
        cancelText="ไม่">
        <Button type="danger" key="remove">ลบทิ้ง</Button>
      </Popconfirm> : <span key="remove"></span>,

      <Button key="submit" type="primary" onClick={handleOk}>
        <Icon type="check" /> {mode === 'edit' ? 'บันทึก' : 'เพิ่ม'}
      </Button>,
    ]}
    onCancel={handleCancel}
  >
    <CourseForm wrappedComponentRef={formRef} fields={(mode === 'edit') ? targetInfo : {}} />
  </Modal>
};