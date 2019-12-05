import React from 'react';

import { Table, Tag, Input } from 'antd';

export default (props) => {

  const dowTag = dow => {
    switch (dow) {
      case 'M': return <Tag color="gold" key={dow}>จันทร์</Tag>
      case 'T': return <Tag color="magenta" key={dow}>อังคาร</Tag>
      case 'W': return <Tag color="green" key={dow}>พุธ</Tag>
      case 'Th': return <Tag color="volcano" key={dow}>พฤหัสบดี</Tag>
      case 'F': return <Tag color="blue" key={dow}>ศุกร์</Tag>
      case 'Sa': return <Tag color="purple" key={dow}>เสาร์</Tag>
      case 'Su': return <Tag color="red" key={dow}>อาทิตย์</Tag>
    }
  };

  const columns = [
    { title: 'รหัสวิชา', dataIndex: 'key', width: '15%' },
    { title: 'ชื่อวิชา', dataIndex: 'name', width: '20%',
      render(text, record, index) {
        return <span>{text} {record.required && <Tag color="#f50">บังคับ</Tag>}</span>
      }
    },
    { title: 'หน่วยกิต', dataIndex: 'credits', width: '10%' },
    { title: 'หมู่เรียน', dataIndex: 'sections[0].name', width: '15%'},
    {
      title: 'เวลาเรียน',
      render(text, record, index) {
        return record.sections[0].lects.map((lect, lectIdx) => <p key={lectIdx}>{lect.dow.map(dow => dowTag(dow))} {lect.start}-{lect.end}</p>)
      }
    },
    {
      title: 'หมายเหตุ',
      render(text, record, index) {
        return <Input />
      }
    }
  ]
  const tableFooter = pageData => {
    return <span>หน่วยกิตรวม: {pageData.reduce((previous, current) => (previous.credits || previous) + (current.credits || 0))}</span>
  }
  return <Table size="small" dataSource={props.filteredCourses} columns={columns} footer={tableFooter} rowKey="key" pagination={false} />
};