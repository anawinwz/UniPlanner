import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

function Main(props) {
  return (
    <Typography>
      <Title>Error</Title>
      <Paragraph>Page not found.</Paragraph>
    </Typography>
  )
}

export default Main;