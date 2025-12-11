import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

// 加载插件
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

// 设置默认语言
dayjs.locale('zh-cn')

export default dayjs
