import AbstractView from './view/abstract-view';

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const render =(container, element, position) => {

  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (position) {
    case RenderPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      parent.append(child);
      break;
    case RenderPosition.AFTEREND:
      parent.after(child);
      break;
  }
};

export const createElement = (template) => {

  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  const firstChild = newElement.firstChild;

  return firstChild;
};

export const replaceElements = (newElement, oldElement) => {
  if (!newElement || !oldElement) {
    throw new Error('Can\'t replace unexisting elements');
  }

  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;

  const parent = oldChild.parentElement;

  if (!parent) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newChild, oldChild);
};

export const removeElement = (component) => {
  if (!component) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }
  component.element.remove();
  component.removeElement();
};
