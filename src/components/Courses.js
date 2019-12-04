import React, { useContext } from 'react';

import { Tree, Button, Icon } from 'antd';
import { planContext, courseContext } from '../contexts';

const { TreeNode } = Tree;

export default (props) => {
  const { courses } = useContext(courseContext);
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
      <Button type="primary"><Icon type="plus" /> เพิ่ม</Button>
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
    </div>
  );
  
};