import React, { useState, useEffect } from 'react';
import Form from 'antd/es/form';
import 'antd/es/form/style/css';
import Radio from 'antd/es/radio';
import 'antd/es/radio/style/css';
import DatePicker from 'antd/es/date-picker';
import 'antd/es/date-picker/style/css';
import Icon from '../../icon';
import Button from '../../button';
import Modal from '../../modal';
import VirtualSelect from '../../select';
import { Row, Col } from '../../grid';
import VirtualAutoComplete from '../../auto-complete';
import {
  types,
  transformWord,
  rawDateFormat,
  dateFormat,
  formatMoment,
  formatValue,
  text2Moment,
} from './common';

const firstField = { condition: 'condition', value: 'value' };
const secondField = { condition: 'condition1', value: 'value1' };
const connectField = 'andOr';

function CalenderAndSelect({ value, onChange }) {
  const [dateOpen, setDateOpen] = useState(false);
  return (
    <Col span={3} offset={1} className="iron-table-filter-cal-wrap">
      <DatePicker
        disabled
        value={text2Moment(value, dateFormat)}
        open={dateOpen}
        showToday={false}
        allowClear={false}
        className="date-picker"
        getCalendarContainer={triggerNode => triggerNode.parentNode}
        style={{ visibility: 'hidden' }}
        onOpenChange={status => setDateOpen(status)}
        onChange={onChange}
      />
      <Icon
        type="calendar"
        className="cal-icon"
        onClick={() => setDateOpen(true)}
      />
    </Col>
  );
}

function Condtion({ columnType, searchList, field }) {
  const [curDateVal, setDateVal] = useState(null);
  const [form] = Form.useForm();
  const { setFieldsValue } = form;
  const isDate = columnType === 'date';

  return (
    <>
      <Col span={8}>
        <Form.Item name={field.condition}>
          <VirtualSelect placeholder="Condition">
            {types.map(({ id, name }) => (
              <div key={id}>{name}</div>
            ))}
          </VirtualSelect>
        </Form.Item>
      </Col>
      <Col span={15} style={{ marginLeft: 10 }}>
        <Row align="bottom" justify="space-between">
          <Col style={{ flex: 1 }}>
            <Form.Item name={field.value}>
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
  visible,
  columnType,
  filterList,
  isReset,
  onCancel,
  onOk,
}) {
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    if (filterList.length > 0) {
      setSearchList(filterList);
    }
  }, [filterList]);

  function handleCommit(values) {
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
    >
      <div style={{ marginBottom: 20 }}>
        Custom AutoFilter - {transformWord(columnType)}
      </div>
      <Form onFinish={handleCommit}>
        {[firstField, { condition: connectField }, secondField].map(item => (
          <Row key={item.condition}>
            {item.condition === connectField ? (
              <Form.Item name={connectField}>
                <Radio.Group>
                  <Radio value="and">And</Radio>
                  <Radio value="or">Or</Radio>
                </Radio.Group>
              </Form.Item>
            ) : (
              <Condtion
                field={item}
                columnType={columnType}
                searchList={searchList}
              />
            )}
          </Row>
        ))}
      </Form>
      <div className="iron-table-filter-btns">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" style={{ width: 80 }} onClick={handleCommit}>
          Ok
        </Button>
      </div>
    </Modal>
  );
}

export default AdvanceFilter;
