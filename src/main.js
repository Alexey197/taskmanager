import {generateFilters} from "./mock/filter"
import {generateTask} from "./mock/task"
import FilterComponent from "./view/filter"
import SiteMenuComponent from "./view/site-menu"
import {render, RenderPosition} from "./utils/render"
import BoardController from "./presenter/board"

const TASK_COUNT = 22

const tasks = new Array(TASK_COUNT).fill(``).map(generateTask)
const filters = generateFilters(tasks)

const siteMainElement = document.querySelector(`.main`)
const siteHeaderElement = siteMainElement.querySelector(`.main__control`)

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND)

render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND)



const board = new BoardController(siteMainElement)
board.init(tasks)