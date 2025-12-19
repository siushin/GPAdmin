import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

/**
 * 日期范围预设配置
 * 用于 DatePicker.RangePicker 的 presets 属性
 */
export const dateRangePresets: Array<{
  label: string;
  value: [Dayjs, Dayjs];
}> = [
  { label: '今天', value: [dayjs().startOf('day'), dayjs().startOf('day')] },
  {
    label: '昨天',
    value: [
      dayjs().subtract(1, 'day').startOf('day'),
      dayjs().subtract(1, 'day').startOf('day'),
    ],
  },
  {
    label: '近7天',
    value: [dayjs().subtract(6, 'day').startOf('day'), dayjs().startOf('day')],
  },
  {
    label: '近30天',
    value: [dayjs().subtract(29, 'day').startOf('day'), dayjs().startOf('day')],
  },
  {
    label: '近90天',
    value: [dayjs().subtract(89, 'day').startOf('day'), dayjs().startOf('day')],
  },
  {
    label: '本月',
    value: [dayjs().startOf('month'), dayjs().startOf('day')],
  },
  {
    label: '上月',
    value: [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month'),
    ],
  },
];

/**
 * 日期范围字段配置
 * 用于 ProTable 的 fieldProps
 */
export const dateRangeFieldProps = {
  presets: dateRangePresets,
};
