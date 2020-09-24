import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Radio, DatePicker } from 'antd';
import Icon from '../../icon';
import VirtualAutoComplete from '../../auto-complete';
import VirtualSelect from '../../select';

import {
  types,
  transformWord,
  rawDateFormat,
  dateFormat,
  formatMoment,
  formatValue,
  text2Moment,
} from './common';

import styles from './index.less';

const firstField = { condition: 'condition', value: 'value' };
const secondField = { condition: 'condition1', value: 'value1' };
const connectField = 'andOr';

function CalenderAndSelect({ value, onChange }) {
  const [dateOpen, setDateOpen] = useState(false);
  return (
    <Col span={3} offset={1} className={styles['cal-wrap']}>
      <DatePicker
        disabled
        value={text2Moment(value, dateFormat)}
        open={dateOpen}
        showToday={false}
        allowClear={false}
        className={styles['date-picker']}
        getCalendarContainer={triggerNode => triggerNode.parentNode}
        onOpenChange={status => setDateOpen(status)}
        onChange={onChange}
      />
      <Icon
        type="iconicon_calenderx"
        className={styles['cal-icon']}
        onClick={() => setDateOpen(true)}
      />
    </Col>
  );
}

function Condtion({ form, columnType, searchList, field }) {
  const [curDateVal, setDateVal] = useState(null);
  const { getFieldDecorator, setFieldsValue } = form;
  const isDate = columnType === 'date';

  return (
    <>
      <Col span={8}>
        <Form.Item>
          {getFieldDecorator(field.condition)(
            <VirtualSelect placeholder="Condition">
              {types.map(({ id, name }) => (
                <div key={id}>{name}</div>
              ))}
            </VirtualSelect>
          )}
        </Form.Item>
      </Col>
      <Col span={15} offset={1}>
        <Row type="flex" align="bottom" justify="space-between">
          <Col style={{ flex: 1 }}>
            <Form.Item>
              {getFieldDecorator(field.value)(
                <VirtualAutoComplete isFixedMode onChange={v => setDateVal(v)}>
                  {searchList.map(({ value }) => {
                    const fVal = formatValue(columnType, value);
                    const val = isDate ? fVal : value;
                    return (
                      <div key={val} value={val}>
                        {fVal}
                      </div>
                    );
                  })}
                </VirtualAutoComplete>
              )}
            </Form.Item>
          </Col>
          {isDate && (
            <CalenderAndSelect
              value={curDateVal}
              onChange={date => {
                const fDate = date.format(dateFormat);
                setDateVal(fDate);
                setFieldsValue({ [field.value]: fDate });
              }}
            />
          )}
        </Row>
      </Col>
    </>
  );
}

function AdvanceFilter({
  form,
  visible,
  columnType,
  filterList,
  isReset,
  onCancel,
  onOk,
}) {
  const [searchList, setSearchList] = useState([]);
  const { validateFields, getFieldDecorator } = form;

  useEffect(() => {
    if (filterList.length > 0) {
      setSearchList(filterList);
    }
  }, [filterList]);

  function handleCommit() {
    validateFields((err, values) => {
      if (!err) {
        const isDate = columnType === 'date';

        const result = [firstField, secondField].reduce((acc, item) => {
          const { condition: cField, value: vField } = item;
          const condition = values[cField];
          const value = values[vField];
          if (condition && value) {
            acc[cField] = condition;
            const fVal = isDate
              ? formatMoment(value, dateFormat, rawDateFormat)
              : value;
            acc[vField] = [fVal];
          }
          return acc;
        }, {});

        result[connectField] = values[connectField];

        onOk(Object.keys(result).length >= 3 ? result : null);
      }
    });
  }

  return (
    <Modal
      centered
      width={450}
      closable={false}
      visible={visible}
      onCancel={onCancel}
      title={null}
      footer={null}
      destroyOnClose={isReset}
      className={styles.advance}
    >
      <div style={{ marginBottom: 20 }}>
        Custom AutoFilter - {transformWord(columnType)}
      </div>
      <Form>
        {[firstField, { condition: connectField }, secondField].map(item => (
          <Row key={item.condition}>
            {item.condition === connectField ? (
              <Form.Item>
                {getFieldDecorator(connectField, {
                  initialValue: 'and',
                })(
                  <Radio.Group>
                    <Radio value="and">And</Radio>
                    <Radio value="or">Or</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            ) : (
              <Condtion
                field={item}
                form={form}
                columnType={columnType}
                searchList={searchList}
              />
            )}
          </Row>
        ))}
      </Form>
      <div className={styles['bottom-btns']}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" style={{ width: 80 }} onClick={handleCommit}>
          Ok
        </Button>
      </div>
    </Modal>
  );
}

export default Form.create({ name: 'advance-filter' })(AdvanceFilter);
