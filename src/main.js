import {generateFilters} from "./mock/filter"
import {generateTasks} from "./mock/task"
import LoadMoreButtonComponent from "./components/load-more-button"
import FilterComponent from "./components/filter"
import BoardComponent from "./components/board"
import SiteMenuComponent from "./components/site-menu"
import TaskComponent from "./components/task"
import TaskEditComponent from "./components/task-edit"
import NoTasksComponent from "./components/no-tasks"
import SortComponent from "./components/sort"
import TasksComponent from "./components/tasks"
import {render, RenderPosition} from "./utils"

const TASK_COUNT = 22
const SHOWING_TASKS_COUNT_ON_START = 8
const SHOWING_TASKS_COUNT_BY_BUTTON = 8

const renderTask = (taskListElement, task) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`
    
    if (isEscKey) {
      replaceEditToTask()
      removeEventListener(`keydown`, onEscKeyDown)
    }
  }
  
  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement())
  }
  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement())
  }
  const taskComponent = new TaskComponent(task)
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`)
  
  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit()
    document.addEventListener(`keydown`, onEscKeyDown)
  })
  
  const taskEditComponent = new TaskEditComponent(task)
  const editForm = taskEditComponent.getElement().querySelector(`form`)
  
  editForm.addEventListener(`submit`, () => {
    replaceEditToTask()
  })
  
  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND)
}

const siteMainElement = document.querySelector(`.main`)
const siteHeaderElement = siteMainElement.querySelector(`.main__control`)

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND)

const filters = generateFilters()
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND)

const boardComponent = new BoardComponent()
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND)

const tasks = generateTasks(TASK_COUNT)
const isAllTasksArchived = tasks.every((task) => task.isArchive)

if (isAllTasksArchived) {
  render(boardComponent.getElement(), new NoTasksComponent().getElement(), RenderPosition.BEFOREEND)
} else {
  render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREEND)
  render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND)
  
  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`)
  
  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START
  tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(taskListElement, task)
    })
  
  const loadMoreButtonComponent = new LoadMoreButtonComponent()
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND)
  
  loadMoreButtonComponent.getElement().addEventListener('click', () => {
    const prevTasksCount = showingTasksCount
    showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON
    
    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task))
    
    if (showingTasksCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove()
      loadMoreButtonComponent.removeElement()
    }
  })
}