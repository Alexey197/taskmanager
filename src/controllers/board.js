import NoTasksComponent from "../components/no-tasks"
import SortComponent, {SortType} from "../components/sort"
import TasksComponent from "../components/tasks"
import LoadMoreButtonComponent from "../components/load-more-button"
import TaskComponent from "../components/task"
import TaskEditComponent from "../components/task-edit"
import {remove, render, RenderPosition, replace} from "../utils"
import BoardComponent from "../components/board"

const TASK_COUNT_PER_STEP = 8


export default class BoardController {
  constructor(container) {
    this._container = container
    this._renderedTaskCount = TASK_COUNT_PER_STEP
    this._currentSortType = SortType.DEFAULT
    
    this._boardComponent = new BoardComponent()
    this._noTasksComponent = new NoTasksComponent()
    this._sortComponent = new SortComponent()
    this._tasksComponent = new TasksComponent()
    this._loadMoreButtonComponent = new LoadMoreButtonComponent()
    
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this)
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this)
  }
  
  init(tasks) {
    this._tasks = tasks.slice()
    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this._sourcedTasks = this._tasks.slice()
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND)
    render(this._boardComponent, this._tasksComponent, RenderPosition.BEFOREEND)
    
    this._renderBoard()
  }
  
  _sortTasks(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.DATE_UP:
        this._tasks.sort((a, b) => a.dueDate - b.dueDate)
        break
      case SortType.DATE_DOWN:
        this._tasks.sort((a, b) => b.dueDate - a.dueDate)
        break
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this._sourcedTasks.slice()
    }
    
    this._currentSortType = sortType
  }
  
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return
    }
    
    this._sortTasks(sortType)
    this._clearTaskList()
    this._renderTaskList()
  }
  
  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN)
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange)
  }
  
  _renderTask(task) {
    const taskEditComponent = new TaskEditComponent(task)
    const taskComponent = new TaskComponent(task)
    
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault()
        replaceFormToCard()
        document.removeEventListener(`keydown`, onEscKeyDown)
      }
    }
    
    const replaceCardToForm = () => {
      replace(taskEditComponent, taskComponent)
    }
    
    const replaceFormToCard = () => {
      replace(taskComponent, taskEditComponent)
    }
    
    taskComponent.setEditClickHandler(() => {
      replaceCardToForm()
      document.addEventListener(`keydown`, onEscKeyDown)
    })
    
    taskEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard()
      document.removeEventListener(`keydown`, onEscKeyDown)
    })
    
    render(this._tasksComponent, taskComponent, RenderPosition.BEFOREEND)
  }
  
  _renderTasks(from, to) {
    this._tasks
      .slice(from, to)
      .forEach(task => this._renderTask(task))
  }
  
  _renderNoTask() {
    render(this._boardComponent, this._noTasksComponent, RenderPosition.AFTERBEGIN)
  }
  
  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP)
    this._renderedTaskCount += TASK_COUNT_PER_STEP
    
    if (this._renderedTaskCount >= this._tasks.length) {
      remove(this._loadMoreButtonComponent)
    }
  }
  
  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND)
    
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick)
  }
  
  _renderTaskList() {
    this._renderTasks(0, Math.min(this._tasks.length, TASK_COUNT_PER_STEP))
    
    if (this._tasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton()
    }
  }
  
  _clearTaskList() {
    this._tasksComponent.getElement().innerHTML = ``
    this._renderedTaskCount = TASK_COUNT_PER_STEP
  }
  
  _renderBoard() {
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive)
    
    if (isAllTasksArchived) {
      this._renderNoTask()
      return
    }
    this._renderSort()
    this._renderTaskList()
  }
}
