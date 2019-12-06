import React, { useState, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';

import { isNonEmpty } from '../utils/check';
import { Form, Input, InputNumber, Divider, Select, TimePicker, Button, Icon, Checkbox, Card, Popconfirm } from 'antd';

const { Option } = Select;

const transform = obj => {
  let transformed = {};
  if (!obj.sections) return transformed;

  ['key', 'code', 'credits', 'name', 'required'].map(key => {
    if (typeof obj[key] === 'undefined') return;
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

  const { getFieldDecorator, getFieldsValue, getFieldValue, setFieldsValue } = form;
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
  const injectedProps = {};
  const injectedOptions = {onChange: (e) => setFieldsValue({isChanged: {value: true}})};
  const styles = {
    timePickerInline: {margin: 0, display: 'inline-block', width: 'calc(50% - 12px)'},
    halfWidth: {width: '50%'}
  };

  const timePickerOptions = {minuteStep: 5, format: "H:mm", hideDisabledOptions: true};

  const disabledHours = [1, 2, 3, 4, 5, 6, 7, 22, 23];
  const disabledStartHours = () => disabledHours;
  const disabledEndHours = start => {
    let ret = [...disabledHours];
    if (typeof start !== 'object') return ret;
    for (let i = 0; i < start.hour(); i++){
      ret.push(i);
    }
    return ret;
  };
  const disabledEndMinutes = (start, selectedHour) => {
    let ret = [];
    if (typeof start !== 'object') return ret;

    if (selectedHour === start.hour()) {
      for (let i = 0; i <= start.minute(); i+=5){
        ret.push(i);
      }
    }
    return ret;
  }

  const getNextHour = obj => {
    if (typeof obj !== 'object') return obj;
    return moment(obj).add(1, 'hours');
  };

  return <Form {...formItemLayout} colon={false}>
    {getFieldDecorator('isChanged', { initialValue: false })}
    {getFieldDecorator('key')}
    <Form.Item label=" ">
      <Input.Group>
        {getFieldDecorator('code', injectedOptions)(<Input {...injectedProps} style={styles.halfWidth} placeholder="รหัสวิชา" maxLength={10} />)}
        {getFieldDecorator('credits', injectedOptions)(<InputNumber {...injectedProps} style={styles.halfWidth} placeholder="หน่วยกิต" min={1} max={25} />)}
      </Input.Group>
    </Form.Item>
    <Form.Item label="ชื่อวิชา">
      {getFieldDecorator('name', {
        rules: [
          {
            required: true,
            message: 'ต้องระบุชื่อวิชา',
          }
        ],
        ...injectedOptions
      })(<Input {...injectedProps} placeholder="ชื่อวิชา" />)}
    </Form.Item>
    <Form.Item label=" ">
      {getFieldDecorator('required', { valuePropName: 'checked', ...injectedOptions})(<Checkbox {...injectedProps}>วิชาบังคับ (ต้องอยู่ในทุกแผน)</Checkbox>)}
    </Form.Item>
    <Divider>หมู่เรียน</Divider>
    {sections.map((section, sIdx) => 
      <div>
        <Form.Item label="ชื่อแทนหมู่เรียน">
          {getFieldDecorator(`sections[${sIdx}][key]`)}
          {getFieldDecorator(`sections[${sIdx}][name]`, injectedOptions)(<Input {...injectedProps} placeholder={`${sIdx+1}`} />)}
          {section.lects.map((lect, lectIdx) => {
            const startTime = getFieldValue(`sections[${sIdx}][lects][${lectIdx}][start]`);
            return <Card size="small" actions={
              (section.lects.length === 1 || section.lects.length - 1 !== lectIdx) ? [] : 
              [
                isNonEmpty(getFieldsValue([`sections[${sIdx}][lects][${lectIdx}][dow]`, `sections[${sIdx}][lects][${lectIdx}][start]`, `sections[${sIdx}][lects][${lectIdx}][end]`])) ? 
                <Popconfirm
                  title="ต้องการลบชุดเวลาเรียนนี้หรือไม่?"
                  onConfirm={() => removeLastLect(sIdx)}
                  okText="ลบ"
                  cancelText="ไม่"
                >
                  <Icon type="delete" key="delete" />
                </Popconfirm> : <Icon type="delete" key="delete" onClick={() => removeLastLect(sIdx)} />
              ]
            }>
              <Form.Item style={{margin: 0}}>
                {getFieldDecorator(`sections[${sIdx}][lects][${lectIdx}][dow]`, {
                  rules: [
                    {
                      required: true,
                      message: 'ต้องระบุวันเรียนในสัปดาห์'
                    }
                  ], ...injectedOptions
                })(
                <Select {...injectedProps} mode="multiple" placeholder={`วันเรียนในสัปดาห์`}>
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
                <Form.Item style={styles.timePickerInline}>
                {getFieldDecorator(`sections[${sIdx}][lects][${lectIdx}][start]`, {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'ต้องระบุเวลาเริ่มเรียน'
                    }
                  ], ...injectedOptions
                })(<TimePicker
                    {...injectedProps}
                    {...timePickerOptions}
                    disabledHours={disabledStartHours}
                    defaultOpenValue={moment('9:00')}
                    placeholder="เวลาเริ่ม" />)}
                </Form.Item>
                <Form.Item style={styles.timePickerInline}>
                {getFieldDecorator(`sections[${sIdx}][lects][${lectIdx}][end]`, {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'ต้องระบุเวลาเลิกเรียน'
                    }
                  ], ...injectedOptions
                })(<TimePicker
                    {...injectedProps}
                    {...timePickerOptions}
                    disabledHours={() => disabledEndHours(startTime)}
                    disabledMinutes={(selectedHour) => disabledEndMinutes(startTime, selectedHour)}
                    defaultOpenValue={getNextHour(startTime)}
                    placeholder="เวลาเลิก" />)}
                </Form.Item>
              </Input.Group>
            </Card>
          })}
          <Button type="dashed" ghost onClick={() => addLect(sIdx)}><Icon type="plus" /> เพิ่มเวลาเรียน</Button>
        </Form.Item>
      </div>
    )}
    
    <Button type="dashed" ghost style={{width: '50%'}} onClick={() => addSection()}><Icon type="plus" /> เพิ่มหมู่เรียน</Button>
    {sections.length > 1 && (
      (isNonEmpty(getFieldsValue([`sections[${sections.length-1}][name]`, `sections[${sections.length-1}][lects][0][dow]`, `sections[${sections.length-1}][lects][0][start]`, , `sections[${sections.length-1}][lects][0][end]`])) && <Popconfirm
        title="ต้องการลบหมู่เรียนล่าสุดหรือไม่?"
        onConfirm={removeLastSection}
        okText="ลบ"
        cancelText="ไม่"
      >
        <Button type="dashed" ghost style={{width: '50%'}}><Icon type="minus" /> ลบหมู่เรียนล่าสุด</Button>
      </Popconfirm>) ||
        <Button type="dashed" ghost style={{width: '50%'}} onClick={removeLastSection}><Icon type="minus" /> ลบหมู่เรียนล่าสุด</Button>
      )
    }

    
    
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