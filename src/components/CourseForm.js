import React from 'react';

import { Form, Input, InputNumber } from 'antd';

function CourseForm(props) {
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  }; 
  return <Form {...formItemLayout} colon={false}>
    <Form.Item label=" ">
      <Input.Group>
        {getFieldDecorator('key')(<Input style={{ width: '50%' }} placeholder="รหัสวิชา" />)}
        {getFieldDecorator('credits')(<InputNumber style={{ width: '50%' }} placeholder="หน่วยกิต" type="number" min="1" max="25" />)}
      </Input.Group>
    </Form.Item>
    <Form.Item label="ชื่อวิชา">
      {getFieldDecorator('name', {
        rules: [
          {
            required: true,
            message: 'ต้องระบุชื่อวิชา',
          }
        ]})(<Input placeholder="ชื่อวิชา" />)}
    </Form.Item>
    
  </Form>
}

const WrappedCourseForm = Form.create({ name: 'course_form' })(CourseForm);
export default WrappedCourseForm;