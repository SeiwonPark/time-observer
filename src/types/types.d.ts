/**
 * Represents the SVG component property.
 */
type SVGProps = React.FC<React.SVGProps<SVGElement>>

/**
 * Represents the different units that can be displayed within a widget.
 */
type WidgetUnit = 'percent' | 'time'

/**
 * Daily storage data for each website
 */
interface DailyStorageItem {
  /**
   * `YYYY-MM-DD` format date string.
   */
  date?: string
  /**
   * The time spent on the item.
   */
  timeSpent: number
  /**
   * Favicon URL of the item.
   */
  favicon: string
}

/**
 * Daily storage data for all websites
 */
interface DailyStorageList {
  [key: string]: DailyStorageItem
}

/**
 * Weekly storage data for all websites
 */
interface WeeklyStorageData {
  [key: string]: DailyStorageList
}
