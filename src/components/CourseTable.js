import React from 'react';

import { Table, Tag } from 'antd';

export default (props) => {

  const dowTag = dow => {
    switch (dow) {
      case 'M': return <Tag color="gold">จันทร์</Tag>
      case 'T': return <Tag color="magenta">อังคาร</Tag>
      case 'W': return <Tag color="green">พุธ</Tag>
      case 'Th': return <Tag color="volcano">พฤหัสบดี</Tag>
      case 'F': return <Tag color="blue">ศุกร์</Tag>
      case 'Sa': return <Tag color="purple">เสาร์</Tag>
      case 'Su': return <Tag color="red">อาทิตย์</Tag>
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
        return record.sections[0].lects.map(lect => <p>{lect.dow.map(dow => dowTag(dow))} {lect.start}-{lect.end}</p>)
      }
    }
  ]
  return <Table size="small" dataSource={props.filteredCourses} columns={columns} />
};