import {generateFilters} from "./mock/filter"
import {generateTasks} from "./mock/task"
import FilterComponent from "./components/filter"
import SiteMenuComponent from "./components/site-menu"
import {render, RenderPosition} from "./utils/render"
import BoardController from "./controllers/board"

const TASK_COUNT = 22


const siteMainElement = document.querySelector(`.main`)
const siteHeaderElement = siteMainElement.querySelector(`.main__control`)

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND)

const filters = generateFilters()
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND)


const tasks = generateTasks(TASK_COUNT)


const board = new BoardController(siteMainElement)
board.init(tasks)