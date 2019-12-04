import React, { useContext, useState } from 'react';

import { Tree, Button, Icon } from 'antd';
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
    console.log('selected', selectedKeys, info);
  }

  function onCheck(checkedKeys, info) {
    const newPlan = [...plans];
    newPlan[selectedIdx].courses = checkedKeys;
    updatePlan({ plans });
  }

  return (
    <div>
      <Button type="primary" onClick={showAddModal}><Icon type="plus" /> เพิ่ม</Button>
      <Tree
        selectable={false}
        checkable
        defaultExpandedKeys={courses.filter(course => course.sections.length > 1).map(course => course.key)}
        defaultCheckedKeys={selectedPlan.courses}
        onSelect={onSelect}
        onCheck={onCheck}
      >
        {courses.map(course => 
          <TreeNode title={course.name} key={course.key}>
            {course.sections.map(section => <TreeNode title={`หมู่เรียน ${section.name}`} key={`${course.key}_${section.key}`} />)}
          </TreeNode>
        )}
      </Tree>
      <CourseModal visible={modal.visible} handleOk={handleOk} handleCancel={handleCancel} />
    </div>
  );
  
};