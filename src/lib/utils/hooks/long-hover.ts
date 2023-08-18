export function longhover(node: HTMLElement) {
  const TIME_MS = parseInt(node.dataset.longpressms ?? "1000");
  let timeoutPtr = 0;
  let canStart = true;

  let x = 0;
  let y = 0;

  function handleMoveBeforeLong(e: PointerEvent) {
    x = e.clientX;
    y = e.clientY;
  }

  function handlePointerEnter(e: PointerEvent) {
    if (!canStart) return;
    window.addEventListener("pointermove", handleMoveBeforeLong);


    canStart = false;
    timeoutPtr = window.setTimeout(() => {
      node.dispatchEvent(
        new CustomEvent("longhover", {
          detail: {
            x,
            y,
          },
        })
      );
      window.removeEventListener("pointermove", handleMoveBeforeLong);
      window.setTimeout(() => node.dispatchEvent(e), 0);
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
      node.removeEventListener("pointerenter", handlePointerEnter);
      node.removeEventListener("pointerleave", handlePointerLeave);
    },
  };
}
