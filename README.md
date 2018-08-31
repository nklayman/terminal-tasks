# Terminal Tasks

> A simple terminal task list powered by [Ora](https://github.com/sindresorhus/ora).

<p align="center">
	<br>
    <img width="600" src="./example.svg">
	<br>
</p>

## Install

With Yarn

```shell
yarn add terminal-tasks
```

or with NPM

```shell
npm install terminal-tasks
```

## Usage

```javascript
const TaskList = require('terminal-tasks')

const list = new TaskList(['First Task', 'Second Task'])

someTask().then(() => {
  // Move to next task
  list.next()
})
```

## API

### new TaskList(tasks, options)

#### tasks

type: `array`

Array of tasks. Tasks can be a string (alias for `name`) or a task object.

#### task object

```javascript
{
  name: 'text to display next to spinner',
  ora: {} // ora options for the spinner (optional)
}
```

See [ora options](https://github.com/sindresorhus/ora/blob/master/readme.md#api)

#### options

type: `object` (optional)

```javascript
{
  // Character to show in front of pending tasks
  //Should be 2 chars long
  pendingChar: '- ',
  // ora options to set for every task
  ora: { color: 'magenta' }
}
```

### Instance

#### .next(message)

Set current task status to `succeed` and start spinner on next task. Optionally takes a `message` argument which will show instead of the task name.

#### .info(message)

Set current task status to `info` and start spinner on next task. Optionally takes a `message` argument which will show instead of the task name.

#### .warn(message)

Set current task status to `warn` and start spinner on next task. Optionally takes a `message` argument which will show instead of the task name.

#### .fail(message)

Fail the current task and display it's name or the `message` argument. Will not start the next task.

#### .add(task)

Add a task to the list. Can be a string or task object.
