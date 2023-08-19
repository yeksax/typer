export function softAccidentalClickPrevention(node: HTMLElement) {
  node.onpointerup = (e) => {
    if (document.getSelection()?.toString()) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  };
}

export function hardAccidentalClickPrevention(node: HTMLElement) {
  node.onpointerup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
}
