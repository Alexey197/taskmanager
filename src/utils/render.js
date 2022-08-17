import AbstractComponent from "../view/abstract-component"

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
}

export const createElement = (template) => {
  const newElement = document.createElement(`div`)
  newElement.innerHTML = template
  
  return newElement.firstChild
}

export const render = (container, child, place) => {
  if(container instanceof AbstractComponent) {
    container = container.getElement()
  }
  
  if(child instanceof AbstractComponent) {
    child = child.getElement()
  }
  
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child)
      break
    case RenderPosition.BEFOREEND:
      container.append(child)
      break
  }
}

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractComponent) {
    oldChild = oldChild.getElement();
  }
  
  if (newChild instanceof AbstractComponent) {
    newChild = newChild.getElement();
  }
  
  const parent = oldChild.parentElement;
  
  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }
  
  parent.replaceChild(newChild, oldChild);
};


export const remove = (component) => {
  if (!(component instanceof AbstractComponent)) {
    throw new Error(`Can remove only components`)
  }
  
  component.getElement().remove()
  component.removeElement()
}

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value)
}

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12)
  const minutes = castTimeFormat(date.getMinutes())
  
  const interval = date.getHours() > 11 ? `pm` : `am`
  
  return `${hours}:${minutes} ${interval}`
}

