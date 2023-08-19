export function softLinkPrevention(node: HTMLElement) {
  node.onpointerup = (e) => {
    if (document.getSelection()?.toString()) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  };
}

export function hardLinkPrevention(node: HTMLElement) {
  node.onpointerup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
}
