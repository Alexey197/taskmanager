import AbstractComponent from "./abstract-component"

export default class Smart extends AbstractComponent {
  constructor() {
    super();
    this._data = {};
  }
  
  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }
    
    this._data = Object.assign(
      {},
      this._data,
      update
    );
    
    if (justDataUpdating) {
      return;
    }
    
    this.updateElement();
  }
  
  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    
    const newElement = this.getElement();
    
    parent.replaceChild(newElement, prevElement);
    prevElement = null; // Чтобы окончательно "убить" ссылку на prevElement
    
    this.restoreHandlers();
  }
  
  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}