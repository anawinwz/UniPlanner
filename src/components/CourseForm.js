import React, { useState, forwardRef, useImperativeHandle } from 'react';

import { Form, Input, InputNumber, Divider, Select, TimePicker, Button, Icon, Checkbox, Card, Popconfirm } from 'antd';
import moment from 'moment';
const { Option } = Select;

const transform = obj => {
  let transformed = {};
  if (!obj.sections) return transformed;

  ['key', 'credits', 'name', 'required'].map(key => {
    transformed[key] = Form.createFormField({
      value: obj[key]
    });
  });
  obj.sections.map((section, sIdx) => {
    transformed[`sections[${sIdx}][key]`] = Form.createFormField({ value: section.key });
    transformed[`sections[${sIdx}][name]`] = Form.createFormField({ value: section.name });
    section.lects.map((lect, idx) => {
      transformed[`sections[${sIdx}][lects][${idx}][dow]`] = Form.createFormField({ value: lect.dow });
      transformed[`sections[${sIdx}][lects][${idx}][start]`] = Form.createFormField({ value: moment(lect.start, 'H:mm') });
      transformed[`sections[${sIdx}][lects][${idx}][end]`] = Form.createFormField({ value: moment(lect.end, 'H:mm') });
    });
  });
  return transformed;
};

const CourseForm = forwardRef(({form, fields}, ref) => {
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
  const isEdit = typeof fields.sections !== 'undefined';
  const [sections, setSections] = useState((isEdit) ? fields.sections :
    [{ lects: [{}] }]
  );

  function addLect(sIdx) {
    const newSections = [...sections];
    newSections[sIdx].lects.push({});
    setSections(newSections);
  }

  function removeLastLect(sIdx) {
    const newSections = [...sections];
    newSections[sIdx].lects.pop();
    setSections(newSections);
  }

  function addSection() {
    setSections([...sections, { lects: [{}] }]);
  }

  function removeLastSection() {
    const newSections = [...sections];
    newSections.pop();
    setSections(newSections);
  }

  return <Form {...formItemLayout} colon={false}>
    <Form.Item label=" ">
      <Input.Group>
        {getFieldDecorator('key')(<Input style={{ width: '50%' }} placeholder="รหัสวิชา" disabled={isEdit} />)}
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
      {getFieldDecorator('required', { valuePropName: 'checked' })(<Checkbox>วิชาบังคับ (ต้องอยู่ในทุกแผน)</Checkbox>)}
    </Form.Item>
    <Divider>หมู่เรียน</Divider>
    {sections.map((section, sIdx) => 
      <div>
        <Form.Item label="ชื่อแทนหมู่เรียน">
          {getFieldDecorator(`sections[${sIdx}][key]`)}
          {getFieldDecorator(`sections[${sIdx}][name]`)(<Input placeholder={`${sIdx+1}`} />)}
          {section.lects.map((lect, lectIdx) => {
            return <Card size="small" actions={
              (section.lects.length === 1 || section.lects.length - 1 !== lectIdx) ? [] : 
              [
                <Popconfirm
                  title="ต้องการลบชุดเวลาเรียนนี้หรือไม่?"
                  onConfirm={() => removeLastLect(sIdx)}
                  okText="ลบ"
                  cancelText="ไม่"
                >
                  <Icon type="delete" key="delete" />
                </Popconfirm>
              ]
            }>
              <Form.Item style={{margin: 0}}>
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
                </Form.Item>
              <Input.Group>
                <Form.Item style={{margin: 0, display: 'inline-block', width: 'calc(50% - 12px)'}}>
                {getFieldDecorator(`sections[${sIdx}][lects][${lectIdx}][start]`, {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'ต้องระบุเวลาเริ่มเรียน'
                    }
                  ]
                })(<TimePicker format="H:mm" minuteStep={5} defaultOpenValue={moment('9:00')} placeholder="เวลาเริ่ม" />)}
                </Form.Item>
                <Form.Item style={{margin: 0, display: 'inline-block', width: 'calc(50% - 12px)'}}>
                {getFieldDecorator(`sections[${sIdx}][lects][${lectIdx}][end]`, {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'ต้องระบุเวลาเลิกเรียน'
                    }
                  ]
                })(<TimePicker format="H:mm" minuteStep={5} placeholder="เวลาเลิก"  />)}
                </Form.Item>
              </Input.Group>
            </Card>
          })}
          <Button type="dashed" ghost onClick={() => addLect(sIdx)}><Icon type="plus" /> เพิ่มเวลาเรียน</Button>
        </Form.Item>
      </div>
    )}
    
    <Button type="dashed" ghost onClick={() => addSection()}><Icon type="plus" /> เพิ่มหมู่เรียน</Button>
    {sections.length > 1 && <Popconfirm
      title="ต้องการลบหมู่เรียนล่าสุดหรือไม่?"
      onConfirm={removeLastSection}
      okText="ลบ"
      cancelText="ไม่"
    >
      <Button type="dashed" ghost><Icon type="minus" /> ลบหมู่เรียนล่าสุด</Button>
    </Popconfirm>}

    
    
  </Form>
});

export default (props) => {
  const WrappedCourseForm = Form.create({
    name: 'course_form',
    mapPropsToFields(props) {
      return transform(props.fields)
    },
  })(CourseForm);
  return <WrappedCourseForm {...props}></WrappedCourseForm>
}