import React, { useContext, createRef } from 'react';

import { Modal, Popconfirm, Button, Icon } from 'antd';
import { courseContext } from '../contexts';
import CourseForm from './CourseForm';

export default (props) => {
  const { courses, updateCourse } = useContext(courseContext);
  
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

      if (!values.key) values.key = values.name;
      values.sections = values.sections.map((section, idx) => {
        if (!section.name) section.name = idx + 1;
        section.key = section.name;
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
      if (typeof props.handleOk === 'function') props.handleOk();
    });
  }
  function handleCancel() {
    const { form } = formRef.current;
    const values = form.getFieldsValue()

    const isNonEmpty = obj => Object.values(obj).some(value => (typeof value !== 'undefined' && typeof value !== 'object') || (typeof value === 'object' && isNonEmpty(value)));

    if (isNonEmpty(values)) {
      Modal.confirm({
        title: 'ยืนยันการยกเลิก',
        content: `คุณแน่ใจหรือว่าต้องการยกเลิกความเปลี่ยนแปลง?`,
        onOk() {
          if (typeof props.handleCancel === 'function') props.handleCancel();
        },
        okText: 'ใช่',
        cancelText: 'ไม่'
      });
    } else if (typeof props.handleCancel === 'function') props.handleCancel();
  }
  function removeThisCourse() {
    if (mode !== 'edit') return;

    const newCourses = [...courses];
    delete newCourses[targetIdx];
    updateCourse({ courses: newCourses });
    if (typeof props.handleCancel === 'function') props.handleCancel();
  }

  return <Modal
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
        <Button type="danger">ลบทิ้ง</Button>
      </Popconfirm> : <span></span>,

      <Button key="submit" type="primary" onClick={handleOk}>
        <Icon type="check" /> {mode === 'edit' ? 'บันทึก' : 'เพิ่ม'}
      </Button>,
    ]}
    onCancel={handleCancel}
  >
    <CourseForm wrappedComponentRef={formRef} fields={(mode === 'edit') ? targetInfo : {}} />
  </Modal>
};