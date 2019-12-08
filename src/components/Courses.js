import React, { useContext, useState } from 'react';

import { Tree, Button, Icon, Empty, Dropdown, Menu, Modal } from 'antd';
import { planContext, courseContext } from '../contexts';

import CourseModal from './CourseModal';

export default (props) => {
  const [ modal, setModal ] = useState({ visible: false, key: null });
  
  const { courses, updateCourse } = useContext(courseContext);
  function showAddModal() { showEditModal(); }
  function showEditModal(key) {
    setModal({visible: true, key: (key) ? key : null});
  }
  function handleOk() {
    setModal({visible: false});
  }
  function handleCancel() {
    setModal({visible: false});
  }

  const { selected, plans, updatePlan } = useContext(planContext);

  const selectedIdx = plans.findIndex(plan => plan.key === selected);
  const selectedPlan = plans[selectedIdx];

  function onSelect(selectedKeys, info) {
    if (selectedKeys.length === 1) showEditModal(selectedKeys[0].split('_')[0]);
  }

  function onCheck(checkedKeys, info) {
    const newPlan = [...plans];
    const courseKey = info.node.props.eventKey.split('_')[0];
    const courseInfo = courses.find(course => course.key === courseKey);

    if (!courseInfo.multiple) {
      if (info.checked && info.node.props.halfChecked) {
        checkedKeys = checkedKeys.filter(key => key.indexOf(courseKey) === -1);
      } else {
        const newItems = checkedKeys.filter(key => !selectedPlan.courses.includes(key));
        newItems.map(item => {
          if (item.indexOf('_') < 0) return;

          const courseKey = item.split('_')[0];
          const dupIdx = checkedKeys.findIndex(key => key !== item && courseKey === key.split('_')[0]);
          if (dupIdx >= 0) {
            checkedKeys.splice(dupIdx, 1);
            
            const mainIdx = checkedKeys.findIndex(key => key === courseKey);
            if (mainIdx >= 0) checkedKeys.splice(mainIdx, 1);
          }
        });
      }
    }
    newPlan[selectedIdx].courses = checkedKeys;
    updatePlan({ plans });
  }

  const wrappedTitle = {width: '100%', margin: '0', textOverflow: 'ellipsis', overflowX: 'hidden', whiteSpace: 'no-wrap'};

  const resetMenuName = {
    thisPlan: 'เคลียร์วิชาในแผนนี้',
    courses: 'ลบวิชาทั้งหมด',
    plans: 'ลบแผนทั้งหมด',
    all: 'ลบข้อมูลทั้งหมด'
  }
  const resetMenuItems = ['thisPlan', null, 'courses', 'plans', null, 'all'];
  const resetEnabled = mode => {
    switch (mode) {
      case 'all':
      case 'courses': return courses.length > 0;
      case 'thisPlan': return selectedPlan.courses.length > 0;
      case 'plans': return selected !== 'default' || plans.length > 1 || selectedPlan.courses.length > 0;
      default: return false;
    }
  }
  const resetMenu = (
    <Menu onClick={handleResetClick}>
      {resetMenuItems.map((item, idx) => item !== null ? 
        <Menu.Item key={item} disabled={!resetEnabled(item)}>{resetMenuName[item]}</Menu.Item> :
        <Menu.Divider key={idx} />)}
    </Menu>
  );
  function handleResetClick(e) {
    const name = resetMenuName[e.key];
    Modal.confirm({
      title: `ยืนยันการ${name}`,
      content: <span>คุณแน่ใจหรือว่าต้องการ{name}?<br />การกระทำนี้ไม่สามารถยกเลิกได้</span>,
      onOk() {
        switch (e.key) {
          case 'thisPlan':
            const newPlan = [...plans];
            newPlan[selectedIdx].courses = [];
            updatePlan({ plans });
            break;
          case 'all':
          case 'plans':
            updatePlan({
              plans: [{
                name: 'แผนเริ่มต้น',
                courses: [],
                key: 'default'
              }],
              selected: 'default'
            });
            if (e.key !== 'all') break;
          case 'courses':
              updateCourse({ courses: [] });
              if (e.key !== 'all') {
                const newPlan = [...plans];
                newPlan.map(plan => {
                  plan.courses = [];
                })
                updatePlan({ plans: newPlan });
                break;
              }
          default:
        }
      }
    });
  }

  return (
    <div>
      <Button type="primary" onClick={showAddModal}><Icon type="plus" /> เพิ่ม</Button>
      &nbsp;
      <Dropdown overlay={resetMenu}>
        <Button type="danger" title="ลบ/เคลียร์ข้อมูล"><Icon type="delete" /><Icon type="down" /></Button>
      </Dropdown>
      <Tree
        checkable
        checkedKeys={selectedPlan.courses}
        defaultExpandedKeys={courses.filter(course => course.sections.length > 1).map(course => course.key)}
        selectedKeys={[]}
        onSelect={onSelect}
        onCheck={onCheck}
        style={{textAlign: 'left'}}
        treeData={
          courses.map(course => ({
            title: <div title={course.name} style={wrappedTitle}>{course.required ? '**':''}{course.name}</div>,
            key: course.key,
            expanded: course.sections.length > 1,
            children: course.sections.map(section => ({
              title: `หมู่เรียน ${section.name}`,
              key: `${course.key}_${section.key}`
            }))
          }))
        }
      />
      {courses.length === 0 && <Empty style={{marginTop: '10px'}} />}
      <CourseModal visible={modal.visible} courseKey={modal.key} handleOk={handleOk} handleCancel={handleCancel} />
    </div>
  );
  
};