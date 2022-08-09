import{createLoadMoreButtonTemplate} from './components/load-more-button'
import{createFilterTemplate} from './components/filter'
import{createBoardTemplate} from './components/board'
import{createSiteMenuTemplate} from './components/site-menu'
import{createTaskTemplate} from './components/task'
import{createTaskEditTemplate} from './components/task-edit'
import {generateFilters} from "./mock/filter"
import {generateTasks} from "./mock/task"

const TASK_COUNT = 22

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template)
}

const siteMainElement = document.querySelector(`.main`)
const siteHeaderElement = siteMainElement.querySelector(`.main__control`)

render(siteHeaderElement, createSiteMenuTemplate())

const filters = generateFilters()
render(siteMainElement, createFilterTemplate(filters))
render(siteMainElement, createBoardTemplate())

const tasks = generateTasks(TASK_COUNT)
const taskListElement = siteMainElement.querySelector(`.board__tasks`)
render(taskListElement, createTaskEditTemplate(tasks[0]))

tasks.slice(1).forEach((task) => render(taskListElement, createTaskTemplate(task)))
// render(taskListElement, createTaskEditTemplate())
//
// new Array(TASK_COUNT)
//     .fill(``)
//     .forEach(
//         () => render(taskListElement, createTaskTemplate())
//     )

const boardElement = siteMainElement.querySelector(`.board`)
render(boardElement, createLoadMoreButtonTemplate())