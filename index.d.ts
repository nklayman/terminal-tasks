import OraOptions from './ora'

interface Task {
  /**
   * Text to show next to spinner
   */
  name: string
  /**
   * Options to pass to Ora for this task
   */
  ora?: OraOptions
}
declare interface Options {
  /**
   * Character to show in front of pending tasks, defaults to "- "
   */
  pendingChar: string
  /**
   * Options to pass to Ora for this task
   */
  ora?: OraOptions
}

declare class TaskList {
  constructor(tasks?: (string | Task)[], options?: Options)
  /**
   * Pass the current task and start spinner on the next
   * @param message Text to show on pass, defaults to task name
   */
  next(message?: string?)
  /**
   * Pass the current task with warn icon and start spinner on the next
   * @param message Text to show on pass, defaults to task name
   */
  warn(message?: string?)
  /**
   * Pass the current task with info icon and start spinner on the next
   * @param message Text to show on pass, defaults to task name
   */
  info(message?: string?)
  /**
   * Fail current task
   * @param message Text to show on failure, defaults to task name
   */
  fail(message?: string?)
  /**
   * Add a task to list
   * @param task Name of task or task object to add
   */
  add(task: string | Task)
  /**
   * Re-display list
   */
  showList()

}

export = TaskList
