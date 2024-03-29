import NoTask from "../view/no-task"
import Sort, {SortType} from "../view/sort"
import Tasks from "../view/tasks"
import LoadMoreButton from "../view/load-more-button"
import {render, remove, RenderPosition} from "../utils/render"
import Board from "../view/board"
import {updateItem} from "../utils/common"
import Task from "./task"

const TASK_COUNT_PER_STEP = 8


export default class BoardPresenter {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._taskPresenter = {};
    
    this._boardComponent = new Board();
    this._sortComponent = new Sort();
    this._taskListComponent = new Tasks();
    this._noTaskComponent = new NoTask();
    this._loadMoreButtonComponent = new LoadMoreButton();
    
    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }
  
  init(boardTasks) {
    this._boardTasks = boardTasks.slice();
    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this._sourcedBoardTasks = boardTasks.slice();
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND);
    
    this._renderBoard();
  }
  
  _handleModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }
  
  _sortTasks(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort((a, b) => a.dueDate - b.dueDate)
        break
      case SortType.DATE_DOWN:
        this._boardTasks.sort((a, b) => b.dueDate - a.dueDate)
        break
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this._sourcedBoardTasks.slice()
    }
    
    this._currentSortType = sortType
  }
  
  _handleTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }
  
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortTasks(sortType);
    this._clearTaskList();
    this._renderTaskList();
  }
  
  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }
  
  _renderTask(task) {
    const taskPresenter = new Task(this._taskListComponent, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }
  
  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach((boardTask) => this._renderTask(boardTask));
  }
  
  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.AFTERBEGIN);
  }
  
  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    this._renderedTaskCount += TASK_COUNT_PER_STEP;
    
    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }
  
  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }
  
  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));
    
    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }
  
  _clearTaskList() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
  }
  
  _renderBoard() {
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }
    
    this._renderSort();
    this._renderTaskList();
  }
}