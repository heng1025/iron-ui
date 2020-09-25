import React from 'react';
import { Row, Col } from '../components/grid';

export default {
  title: 'components/Grid',
  component: Col,
};

export const Primary = args => {
  return (
    <>
      <Row>
        <Col span={6}>123</Col>
        <Col span={6}>456</Col>
        <Col span={6}>789</Col>
      </Row>
      <Row>
        <Col span={6}>aaa</Col>
        <Col span={6}>bbb</Col>
        <Col span={6}>ccc</Col>
      </Row>
    </>
  );
};
