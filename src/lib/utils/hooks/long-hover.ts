export function longhover(node: HTMLElement) {
  const TIME_MS = parseInt(node.dataset.longpressms ?? "1000");
  let timeoutPtr = 0;
  let canStart = true;

  let x = 0;
  let y = 0;

  function handleMoveBeforeLong(e: PointerEvent) {
    const element = e.target as HTMLElement;
    const parentLayer = element.closest(".fixed");
    const hasLayer = !!parentLayer;

    if (hasLayer) {
      const style = window.getComputedStyle(parentLayer);
      const matrix = new WebKitCSSMatrix(style.transform);

      const translateX = matrix.m41;
      const translateY = matrix.m42;

      // @ts-expect-error for some reason it doesn't has these props documented
      x = e.layerX - translateX;
      // @ts-expect-error for some reason it doesn't has these props documented
      y = e.layerY - translateY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
  }

  function handlePointerEnter(e: PointerEvent) {
    if (!canStart) return;
    window.addEventListener("pointermove", handleMoveBeforeLong);

    canStart = false;
    timeoutPtr = window.setTimeout(() => {
      window.removeEventListener("pointermove", handleMoveBeforeLong);
      window.setTimeout(() => node.dispatchEvent(e), 0);
      node.dispatchEvent(
        new CustomEvent("longhover", {
          detail: {
            x,
            y,
          },
        })
      );
    }, TIME_MS);
  }

  function handlePointerLeave() {
    window.clearTimeout(timeoutPtr);
    canStart = true;
  }

  node.addEventListener("pointerenter", handlePointerEnter);
  node.addEventListener("pointerleave", handlePointerLeave);

  return {
    destroy: () => {
      window.removeEventListener("pointermove", handleMoveBeforeLong);
      node.removeEventListener("pointerenter", handlePointerEnter);
      node.removeEventListener("pointerleave", handlePointerLeave);
    },
  };
}
