// remove class from a set of items
const removeClasses = (elemSet, className) => {
  elemSet.forEach((elem) => {
    elem.classList.remove(className);
  });
};

// return exact parent node of the element
const findParent = (elem, parentClass) => {
  let currentNode = elem;

  while (!currentNode.classList.contains(parentClass)) {
    currentNode = currentNode.parentNode;
  }

  return currentNode;
};

export { removeClasses, findParent };
