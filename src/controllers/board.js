import NoTasksComponent from "../components/no-tasks"
import SortComponent from "../components/sort"
import TasksComponent from "../components/tasks"
// import LoadMoreButtonComponent from "../components/load-more-button"
import TaskComponent from "../components/task"
import TaskEditComponent from "../components/task-edit"
import {render, RenderPosition, replace} from "../utils"
import BoardComponent from "../components/board"
// import {generateTasks} from "../mock/task"

const SHOWING_TASKS_COUNT_ON_START = 8
// const SHOWING_TASKS_COUNT_BY_BUTTON = 8


export default class BoardController {
  constructor(container) {
    this._container = container
    this._boardComponent = new BoardComponent()
    this._noTasksComponent = new NoTasksComponent()
    this._sortComponent = new SortComponent()
    this._tasksComponent = new TasksComponent()
    // this._loadMoreButtonComponent = new LoadMoreButtonComponent()
  }
  
  init(tasks) {
    this._tasks = tasks
    
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND)
    render(this._boardComponent, this._tasksComponent.getElement(), RenderPosition.BEFOREEND)
    
    this._renderBoard()
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
  
  _renderTaskList() {
    this._renderTasks(0, Math.min(this._tasks.length, SHOWING_TASKS_COUNT_ON_START))
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
  
  _renderNoTask() {
    render(this._boardComponent, this._noTasksComponent, RenderPosition.AFTERBEGIN)
  }
  
  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN)
  }
  
  
  
  // render(tasks) {
  //   const renderLoadMoreButton = () => {
  //     if (showingTasksCount >= tasks.length) {
  //       return
  //     }
  //
  //     render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND)
  //
  //     this._loadMoreButtonComponent.setClickHandler(() => {
  //       const prevTasksCount = showingTasksCount
  //       showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON
  //
  //       renderTasks(taskListElement, tasks.slice(prevTasksCount, showingTasksCount))
  //
  //       if (showingTasksCount >= tasks.length) {
  //         this._loadMoreButtonComponent.getElement().remove()
  //         this._loadMoreButtonComponent.removeElement()
  //       }
  //     })
  //   }
  //
  //   const container = this._container.getElement()
  //
  //
  //   render(container, this._sortComponent, RenderPosition.BEFOREEND)
  //   render(container, this._tasksComponent, RenderPosition.BEFOREEND)
  //
  //   const taskListElement = this._tasksComponent.getElement()
  //
  //   let showingTasksCount = SHOWING_TASKS_COUNT_ON_START
  //
  //   renderTasks(taskListElement, tasks.slice(0, showingTasksCount))
  //   renderLoadMoreButton()
  //
  //   this._sortComponent.setSortTypeChangeHandler((sortType) => {
  //     let sortedTasks = []
  //
  //     switch (sortType) {
  //       case SortType.DATE_UP:
  //         sortedTasks = tasks.slice().sort((a, b) => a.dueDate = b.dueDate)
  //         break
  //       case SortType.DATE_DOWN:
  //         sortedTasks = tasks.slice().sort((a, b) => b.dueDate = a.dueDate)
  //         break
  //       case SortType.DEFAULT:
  //         sortedTasks = tasks.slice(0, showingTasksCount)
  //     }
  //
  //     taskListElement.innerHTML = ``
  //
  //     renderTasks(taskListElement, sortedTasks)
  //
  //     if (sortType === SortType.DEFAULT) {
  //       renderLoadMoreButton()
  //     } else {
  //       this._loadMoreButtonComponent.getElement().remove()
  //       this._loadMoreButtonComponent.removeElement()
  //     }
  //   })
  // }
}
