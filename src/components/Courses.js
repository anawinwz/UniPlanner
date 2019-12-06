import React, { useContext, useState } from 'react';

import { Tree, Button, Icon, Empty } from 'antd';
import { planContext, courseContext } from '../contexts';

import CourseModal from './CourseModal';

const { TreeNode } = Tree;

export default (props) => {
  const [ modal, setModal ] = useState({ visible: false, key: null });
  
  const { courses } = useContext(courseContext);
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
    newPlan[selectedIdx].courses = checkedKeys;
    updatePlan({ plans });
  }

  const wrappedTitle = {width: '100%', margin: '0', textOverflow: 'ellipsis', overflowX: 'hidden', whiteSpace: 'no-wrap'};

  return (
    <div>
      <Button type="primary" onClick={showAddModal}><Icon type="plus" /> เพิ่ม</Button> <Button type="danger" title="รีเซ็ต (เร็วๆ นี้)" disabled><Icon type="undo" /></Button>
      <Tree
        checkable
        checkedKeys={selectedPlan.courses}
        selectedKeys={[]}
        onSelect={onSelect}
        onCheck={onCheck}
        style={{textAlign: 'left'}}
      >
        {courses.map(course => 
          <TreeNode 
            title={<div title={course.name} style={wrappedTitle}>{course.required ? '**':''}{course.name}</div>}
            key={course.key}
            expanded={course.sections.length > 1}>
              {course.sections.map(section => <TreeNode title={`หมู่เรียน ${section.name}`} key={`${course.key}_${section.key}`} />)}
          </TreeNode>
        )}
      </Tree>
      {courses.length === 0 && <Empty style={{marginTop: '10px'}} />}
      <CourseModal visible={modal.visible} courseKey={modal.key} handleOk={handleOk} handleCancel={handleCancel} />
    </div>
  );
  
};