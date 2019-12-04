import React, { useContext } from 'react';

import { Modal } from 'antd';
import { courseContext } from '../contexts';
import CourseForm from './CourseForm';

export default (props) => {
  const { courses, updateCourse } = useContext(courseContext);
  
  const mode = (props.key) ? 'edit' : 'add';
  if (mode === 'edit') {
    const targetIdx = courses.findIndex(course => course.key === props.key);
    const targetInfo = courses[targetIdx];
  }

  return <Modal
    title={mode === 'edit' ? `แก้ไขข้อมูลรายวิชา` : `เพิ่มข้อมูลรายวิชา`}
    visible={props.visible}
    onOk={props.handleOk}
    onCancel={props.handleCancel}
  >
    <CourseForm />
  </Modal>
};