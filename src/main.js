// import{createLoadMoreButtonTemplate} from './components/load-more-button'
// import{createFilterTemplate} from './components/filter'
// import{createBoardTemplate} from './components/board'
// import{createSiteMenuTemplate} from './components/site-menu'
// import{createTaskTemplate} from './components/task'
// import{createTaskEditTemplate} from './components/task-edit'
import {generateFilters} from "./mock/filter"
import {generateTasks} from "./mock/task"
import LoadMoreButtonComponent from "./components/load-more-button"
import FilterComponent from "./components/filter"
import BoardComponent from "./components/board"
import SiteMenuComponent from "./components/site-menu"
import TaskComponent from "./components/task"
import TaskEditComponent from "./components/task-edit"
import {render, RenderPosition} from "./utils"

const TASK_COUNT = 22
const SHOWING_TASKS_COUNT_ON_START = 8
const SHOWING_TASKS_COUNT_BY_BUTTON = 8

// const render = (container, template, place = `beforeend`) => {
//   container.insertAdjacentHTML(place, template)
// }

const siteMainElement = document.querySelector(`.main`)
const siteHeaderElement = siteMainElement.querySelector(`.main__control`)

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND)

const filters = generateFilters()
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND)

const boardComponent = new BoardComponent()
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND)

const tasks = generateTasks(TASK_COUNT)
const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`)
render(taskListElement, new TaskEditComponent(tasks[0]).getElement(), RenderPosition.BEFOREEND)

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START
tasks.slice(1, showingTasksCount).forEach((task) => render(taskListElement, new TaskComponent(task).getElement(), RenderPosition.BEFOREEND))

const boardElement = siteMainElement.querySelector(`.board`)
const loadMoreButtonComponent = new LoadMoreButtonComponent()
render(boardElement, loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND)

const loadMoreButton = boardElement.querySelector('.load-more')

loadMoreButton.addEventListener('click', () => {
  const prevTasksCount = showingTasksCount
  showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, new TaskComponent(task).getElement(), RenderPosition.BEFOREEND))

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove()
  }
})
