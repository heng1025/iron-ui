import moment from 'dayjs';

export const rawDateFormat = 'YYYYMMDD';
export const rawTimestampFormat = 'YYYYMMDDHHmmss';

export const rawMonthFormat = 'YYYYMM';
export const monthFormat = 'MM-YYYY';
export const reqFormat = 'YYYYMMDD';
export const dateFormat = 'DD-MMM-YYYY';
export const timeFormat = 'HH:mm:ss';
export const reqDateFormat = 'YYYY-MM-DD';
export const reqTimeFormat = `${reqDateFormat} ${timeFormat}`;
export const timestampFormat = `${dateFormat} ${timeFormat}`;

export const isMomomentValid = (text, beforeFormat) => {
  // true --> strict validate
  const m = moment(text, beforeFormat, true);
  return m.isValid();
};

export const formatMoment = (text, beforeFormat, afterFormat) => {
  // true --> strict validate
  const m = moment(text, beforeFormat, true);
  if (m.isValid()) {
    return m.format(afterFormat);
  }
  return text;
};

export const formatNumWithComma = num => {
  if (typeof num !== 'number') {
    return num;
  }
  const numString = String(num);
  // float (with dot)
  if (/\./g.test(numString)) {
    return numString.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }
  return numString.replace(/(\d)(?=(\d{3})+$)/g, '$&,');
};

// 20200428
const dateRe = /(\d{4})(\d{2})(\d{2})/;

export const types = [
  { id: 1, name: '=' },
  { id: 2, name: '!=' },
  { id: 3, name: '>' },
  { id: 4, name: '>=' },
  { id: 5, name: '<' },
  { id: 6, name: '<=' },
  { id: 11, name: 'begin with' },
  { id: 13, name: 'not begin with' },
  { id: 12, name: 'end with' },
  { id: 14, name: 'not end with' },
  { id: 8, name: 'contain' },
  { id: 15, name: 'not contain' },
];

const columnTypeMap = {
  text: 'Text',
  date: 'Date',
  number: 'Number',
};

export const transformWord = word => columnTypeMap[word] || 'Text';

function dateToTree(dateList) {
  if (dateList.length <= 0) return [];
  const [current, ...rest] = dateList;
  const { value: curVal, count: curCount } = current;
  let [, curYear, curMon, curDay] = curVal.match(dateRe);
  let [yearCount, monCount, dayCount] = [curCount, curCount, curCount];
  let [tempDaysMap, tempMonsMap] = [[], []];

  const yearsMap = [];

  for (let i = 0, len = rest.length; i < len; i++) {
    const { value, count } = rest[i];
    const [, year, mon, day] = value.match(dateRe);
    // valid date
    if (curYear === year) {
      // equal year
      yearCount += count;
      if (curMon === mon) {
        // equal month
        monCount += count;
        if (curDay === day) {
          // equal day
          dayCount += count;
        } else {
          // not equal day
          tempDaysMap.push({
            id: `${curYear}${curMon}${curDay}`,
            value: curDay,
            count: dayCount,
          });
          dayCount = count;
          curDay = day;
        }
      } else {
        // not equal month
        tempDaysMap.push({
          id: `${curYear}${curMon}${curDay}`,
          value: curDay,
          count: dayCount,
        });
        dayCount = count;
        curDay = day;

        tempMonsMap.push({
          id: `${curYear}${curMon}`,
          value: curMon,
          count: monCount,
          children: tempDaysMap,
        });
        curMon = mon;
        monCount = count;
        tempDaysMap = [];
      }
    } else {
      // not equal year
      tempDaysMap.push({
        id: `${curYear}${curMon}${curDay}`,
        value: curDay,
        count: dayCount,
      });
      curDay = day;
      dayCount = count;

      tempMonsMap.push({
        id: `${curYear}${curMon}`,
        value: curMon,
        count: monCount,
        children: tempDaysMap,
      });
      curMon = mon;
      monCount = count;
      tempDaysMap = [];

      yearsMap.push({
        id: curYear,
        value: curYear,
        count: yearCount,
        children: tempMonsMap,
      });
      curYear = year;
      yearCount = count;
      tempMonsMap = [];
    }
  }

  // last one
  tempDaysMap.push({
    id: `${curYear}${curMon}${curDay}`,
    value: curDay,
    count: dayCount,
  });

  tempMonsMap.push({
    id: `${curYear}${curMon}`,
    value: curMon,
    count: monCount,
    children: tempDaysMap,
  });

  yearsMap.push({
    id: curYear,
    value: curYear,
    count: yearCount,
    children: tempMonsMap,
  });

  return yearsMap;
}

export function transformDate(dateList) {
  const { validDateList, inValidDateList } = dateList.reduce(
    (acc, item) => {
      const { value, count } = item;
      if (isMomomentValid(value, rawDateFormat) && dateRe.test(value)) {
        acc.validDateList.push(item);
      } else {
        acc.inValidDateList.push({
          id: value,
          value,
          count,
        });
      }
      return acc;
    },
    {
      validDateList: [],
      inValidDateList: [],
    }
  );
  return dateToTree(validDateList).concat(inValidDateList);
}

export function getDays(arr) {
  return arr.reduce((acc, node) => {
    if (node.children) {
      getDays(node.children);
    } else if (node.props && node.props.children) {
      // ReactNode
      getDays(node.props.children);
    } else {
      acc.push(node.key);
    }
    return acc;
  }, []);
}

function formatDateTime(columnType, strVal) {
  const formatMonthVal = formatMoment(strVal, rawMonthFormat, monthFormat);
  const formatDateVal = formatMoment(strVal, rawDateFormat, dateFormat);
  const formatTimeVal = formatMoment(
    strVal,
    rawTimestampFormat,
    timestampFormat
  );
  const strValMap = {
    month: formatMonthVal,
    date: formatDateVal,
    dateTime: formatTimeVal,
  };
  return strValMap[columnType] || strVal;
}

export function formatValue(columnType, value) {
  if (columnType === 'date' || columnType === 'dateTime') {
    return formatDateTime(columnType, value);
  }
  if (columnType === 'number') {
    return formatNumWithComma(value);
  }
  return value;
}

export function text2Moment(text, format = rawDateFormat) {
  return isMomomentValid(text, format) ? moment(text) : null;
}
