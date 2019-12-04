import React, { useState, forwardRef, useImperativeHandle } from 'react';

import { Form, Input, InputNumber, Divider, Select, TimePicker, Button, Icon, Checkbox } from 'antd';
import moment from 'moment';
const { Option } = Select;

const CourseForm = forwardRef(({form}, ref) => {
  useImperativeHandle(ref, () => ({
    form,
  }));

  const { getFieldDecorator, getFieldValue } = form;
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
  const [sections, setSections] = useState([
    { lects: [{}] }
  ]);

  function addLect(sIdx) {
    const newSections = [...sections];
    newSections[sIdx].lects.push({});
    setSections(newSections);
  }

  function addSection() {
    setSections([...sections, { lects: [{}] }]);
  }

  return <Form {...formItemLayout} colon={false}>
    <Form.Item label=" ">
      <Input.Group>
        {getFieldDecorator('key')(<Input style={{ width: '50%' }} placeholder="รหัสวิชา" />)}
        {getFieldDecorator('credits')(<InputNumber style={{ width: '50%' }} placeholder="หน่วยกิต" min={1} max={25} />)}
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
    <Form.Item label=" ">
      {getFieldDecorator('required')(<Checkbox>วิชาบังคับ (ต้องอยู่ในทุกแผน)</Checkbox>)}
    </Form.Item>
    <Divider>หมู่เรียน</Divider>
    {sections.map((section, sIdx) => 
      <div>
        <Form.Item label="ชื่อแทนหมู่เรียน">
          {getFieldDecorator(`sections[${sIdx}][name]`)(<Input placeholder={`${sIdx+1}`} />)}
          <Divider>เวลาเรียน</Divider>
          {section.lects.map((lect, lectIdx) => {
            return <div>
              {getFieldDecorator(`sections[${sIdx}][lects][${lectIdx}][dow]`, {
                rules: [
                  {
                    required: true,
                    message: 'ต้องระบุวันเรียนในสัปดาห์'
                  }
                ]
              })(
              <Select mode="multiple" placeholder={`วันเรียนในสัปดาห์`}>
                  <Option key="M">จันทร์</Option>
                  <Option key="T">อังคาร</Option>
                  <Option key="W">พุธ</Option>
                  <Option key="Th">พฤหัสบดี</Option>
                  <Option key="F">ศุกร์</Option>
                  <Option key="Sa">เสาร์</Option>
                  <Option key="Su">อาทิตย์</Option>
                </Select>)}
              <Input.Group>
                {getFieldDecorator(`sections[${sIdx}][lects][${lectIdx}][start]`, {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'ต้องระบุเวลาเริ่มเรียน'
                    }
                  ]
                })(<TimePicker format="H:mm" minuteStep={5} defaultOpenValue={moment('9:00')} placeholder="เวลาเริ่ม" />)}
                {getFieldDecorator(`sections[${sIdx}][lects][${lectIdx}][end]`, {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'ต้องระบุเวลาเลิกเรียน'
                    }
                  ]
                })(<TimePicker format="H:mm" minuteStep={5} placeholder="เวลาเลิก"  />)}
              </Input.Group>
            </div>
          })}
          <Button type="dashed" onClick={() => addLect(sIdx)}><Icon type="plus" /> เพิ่มเวลาเรียน</Button>
        </Form.Item>
      </div>
    )}
    <Button type="dashed" onClick={() => addSection()}><Icon type="plus" /> เพิ่มหมู่เรียน</Button>
    
    
  </Form>
});

export default (props) => {
  const WrappedCourseForm = Form.create({
    name: 'course_form',
    // mapPropsToFields(props) {
    //   return {
    //     username: Form.createFormField({
    //       ...props.username,
    //       value: props.username.value,
    //     }),
    //   };
    // },
  })(CourseForm);
  return <WrappedCourseForm {...props}></WrappedCourseForm>
}