import AbstractComponent from "./abstract-component"

export const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`
}

const createSortTemplate = () => {
  return (
    `<div class="board__filter-list">
          <a href="#" class="board__filter" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
          <a href="#" class="board__filter" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
          <a href="#" class="board__filter" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
        </div>`
  )
}


export default class Sort extends AbstractComponent{
  constructor() {
    super()
    
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this)
  }
  
  getTemplate() {
    return createSortTemplate()
  }
  
  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return
    }
    
    evt.preventDefault()
    this._callback.sortTypeChange(evt.target.dataset.sortType)
  }
  
  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler)
  }
}