import React from 'react';
import { Table, Input, Button, Popconfirm, Form, DatePicker } from 'antd';

import { courseContext } from '../contexts';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        try { 
          this.input.focus();
        } catch (err) {

        }
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    const isDatePicker = ['midterm','final'].includes(dataIndex);
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              type: (isDatePicker) ? 'array' : undefined,
              required: true,
              message: `ต้องระบุ${title}`,
            },
          ],
          initialValue: record[dataIndex],
        })(isDatePicker ? <DatePicker.RangePicker showTime format="DD MMM YY HH:mm" onOpenChange={status => {if (!status) this.save();}} /> : <Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} placeholder={title} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {record[dataIndex] ? (isDatePicker ? record[dataIndex][0].format('DD MMM YY HH:mm')+'-'+record[dataIndex][1].format('HH:mm') : children) : (<span style={{color: '#525151'}}>{title}</span>)}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  static contextType = courseContext;

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'ชื่อ/รหัสแทนวิชา',
        dataIndex: 'codename',
        width: '25%',
        editable: true,
      },
      {
        title: 'เวลาเรียน',
        dataIndex: 'classdays',
        width: '20%',
        editable: true,
      },
      {
        title: 'สอบกลางภาค',
        dataIndex: 'midterm',
        width: '24.67%',
        editable: true,
      },
      {
        title: 'สอบปลายภาค',
        dataIndex: 'final',
        width: '24.67%',
        editable: true,
      },
      {
        title: '',
        width: '5%',
        dataIndex: 'operation',
        render: (text, record) => <Popconfirm title="แน่ใจหรือว่าต้องการลบ?" onConfirm={() => this.handleDelete(record.key)}>
              <a>ลบ</a>
            </Popconfirm>
      },
    ];
  }

  handleDelete = key => {
    const dataSource = [...this.context.courses];
    this.context.updateCourse({ courses: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const newData = {
      key: Math.random(),
      codename: '',
      classdays: '',
      midterm: '',
      final: ''
    };
    this.context.updateCourse({
      courses: [...this.context.courses, newData]
    });
  };

  handleSave = row => {
    const newData = [...this.context.courses];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.context.updateCourse({ courses: newData });
  };

  onSelectChange = selectedRowKeys => {
    this.props.updatePlanCourse(selectedRowKeys);
  };

  render() {
    const rowSelection = {
      selectedRowKeys: this.props.courses,
      onChange: this.onSelectChange,
    };
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          เพิ่มวิชาใหม่
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          rowSelection={rowSelection}
          bordered
          dataSource={this.context.courses}
          columns={columns}
          size="middle"
        />
      </div>
    );
  }
}

export default EditableTable;