export function clickOutside(node: HTMLElement) {
  const handleClick = (event: PointerEvent) => {
    if (node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent("clickoutside"));
    }
  };

  document.addEventListener("pointerdown", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("pointerdown", handleClick, true);
    },
  };
}
