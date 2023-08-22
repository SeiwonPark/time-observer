/**
 * Represents Line Chart's data types of Chart.js.
 */
type ChartData = import('chart.js').ChartData<'line'>

/**
 * Represents Line Chart's option types of Chart.js.
 */
type ChartOptions = import('chart.js').ChartOptions<'line'>

/**
 * Represents Line Chart's tooltip item types of Chart.js.
 */
type TooltipItem = import('chart.js').TooltipItem<'line'>

/**
 * Represents the SVG component property.
 */
type SVGProps = React.FC<React.SVGProps<SVGElement>>

/**
 * Represents the different units that can be displayed within a widget.
 */
type WidgetUnit = 'percent' | 'time'

/**
 * Daily storage data for each website.
 */
interface DailyStorageItem {
  /**
   * `YYYY-MM-DD` format date string.
   */
  date?: string
  /**
   * The time spent on the website.
   */
  timeSpent: number
  /**
   * Favicon URL of the website.
   */
  favicon: string
}

/**
 * Daily storage data for all websites.
 */
interface DailyStorageList {
  [key: string]: DailyStorageItem
}

/**
 * Weekly storage data for all websites.
 */
interface WeeklyStorageData {
  [key: string]: DailyStorageList
}

/**
 * This is notification item for the website where notification has been sent from.
 */
interface TimeNotification {
  /**
   * `YYYY-MM-DD` format date string.
   */
  date: string
  /**
   * Domain name of the website.
   */
  domain: string
  /**
   * The time spent on the website.
   */
  timeSpent: number
  /**
   * Favicon URL of the item.
   */
  favicon: string
  /**
   * The time when notification is sent. (milliseconds)
   */
  timestamp: number
}
