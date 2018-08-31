const TaskList = require('./index')
const ora = require('ora')
const mockOra = {
  fail: jest.fn(),
  succeed: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  stop: jest.fn()
}
mockOra.start = jest.fn(() => mockOra)
jest.mock('ora', () => jest.fn(() => mockOra))

describe('constructor', () => {
  test('Converts strings to objects with pending status', () => {
    const list = new TaskList([
      { name: 'object', status: 'expected' },
      'string'
    ])
    expect(list.tasks).toEqual([
      { name: 'object', status: 'expected' },
      { name: 'string', status: 'pending' }
    ])
  })

  test.each([
    [{ name: 'first', status: 'running' }, 'second'],
    ['first', 'second']
  ])('First task is running automatically', (...tasks) => {
    const list = new TaskList(tasks)
    expect(list.tasks).toEqual([
      { name: 'first', status: 'running' },
      { name: 'second', status: 'pending' }
    ])
  })

  test('Does not show spinner if no tasks are provided', () => {
    new TaskList()
    expect(ora).not.toBeCalled()
  })

  test('Options are set', () => {
    const list = new TaskList(['A task'], { option: 'expected' })
    expect(list.options).toEqual({ option: 'expected', pendingChar: '- ' })
  })
})

describe('showList', () => {
  test('Ora spinner is started', () => {
    new TaskList(['task'])
    expect(ora).toBeCalled()
    expect(mockOra.start).toBeCalled()
  })

  test('Custom pending char icon is used', () => {
    new TaskList(['runningTask', 'pendingTask'], {
      pendingChar: 'pending-'
    })

    expect(ora.mock.calls[0][0]).toEqual({
      text: 'runningTask\npending-pendingTask'
    })
  })

  test('Global ora options are used', () => {
    new TaskList(['someTask'], {
      ora: { shouldBe: 'expected' }
    })

    expect(ora.mock.calls[0][0]).toEqual({
      text: 'someTask',
      shouldBe: 'expected'
    })
  })

  test('task Ora options are used', () => {
    new TaskList([{ name: 'someTask', ora: { shouldBe: 'expected' } }], {
      ora: { shouldBe: 'replaced' }
    })

    expect(ora.mock.calls[0][0]).toEqual({
      text: 'someTask',
      shouldBe: 'expected'
    })
  })
})

describe('add', () => {
  test.each(['someTask', { name: 'someTask' }])(
    'add() adds to taskList',
    task => {
      const list = new TaskList(['existingTask'])
      expect(list.tasks).toEqual([{ name: 'existingTask', status: 'running' }])
      list.add(task)
      expect(list.tasks).toEqual([
        { name: 'existingTask', status: 'running' },
        { name: task.name || task, status: 'pending' }
      ])
    }
  )

  test('Calls showList after task is added', () => {
    const list = new TaskList(['one'])
    list.add('two')
    expect(ora).toHaveBeenCalledTimes(2)
  })

  test('Stop old spinner when task is added', () => {
    const list = new TaskList(['one'])
    list.add('two')
    expect(mockOra.stop).toHaveBeenCalledTimes(1)
  })
})

describe.each(['next', 'warn', 'info'])('%s', fn => {
  const oraFn = fn === 'next' ? 'succeed' : fn
  test.each([['oneTask'], ['firstTask', 'secondTask']])(
    'Spinner is succeeded with task name',
    (...tasks) => {
      const taskName = tasks[0]
      const list = new TaskList(tasks)
      list[fn]()
      expect(mockOra[oraFn]).toBeCalledWith(taskName)
    }
  )

  test('If there are tasks left the spinner is restarted', () => {
    const list = new TaskList(['first', 'second'])
    list[fn]()

    // Old task is removed
    expect(Object.keys(list.tasks).length).toBe(1)
    // Spinner was restarted
    expect(ora).toHaveBeenCalledTimes(2)
    // Called with next task
    expect(ora).toBeCalledWith({ text: 'second' })
  })

  test('custom message is shown', () => {
    const list = new TaskList(['task'])
    list[fn]('success message')
    expect(mockOra[oraFn]).toBeCalledWith('success message')
  })
})

describe('fail', () => {
  test('Ora is failed with custom message if provided', () => {
    const list = new TaskList(['task'])
    list.fail('fail message')
    expect(mockOra.fail).toBeCalledWith('fail message')
  })

  test('Ora is failed with task name', () => {
    const list = new TaskList(['task'])
    list.fail()
    expect(mockOra.fail).toBeCalledWith('task')
  })
})
