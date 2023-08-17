export function longpress(node: HTMLElement) {
  const TIME_MS = parseInt(node.dataset.longpressms ?? "250");
  let timeoutPtr = 0;

  function handlePointerDown(e: Event) {
    window.addEventListener("pointermove", handleMoveBeforeLong);

    timeoutPtr = window.setTimeout(() => {
      window.removeEventListener("pointermove", handleMoveBeforeLong);
      node.dispatchEvent(new CustomEvent("longpress"));
      // TODO - ideally make this not trigger long press again
      window.setTimeout(() => node.dispatchEvent(e), 0);
    }, TIME_MS);
  }

  function handleMoveBeforeLong() {
    window.clearTimeout(timeoutPtr);
    window.removeEventListener("pointermove", handleMoveBeforeLong);
  }

  function handlePointerUp() {
    window.clearTimeout(timeoutPtr);
    window.removeEventListener("pointermove", handleMoveBeforeLong);
  }

  node.addEventListener("pointerdown", handlePointerDown);
  node.addEventListener("pointerup", handlePointerUp);

  return {
    destroy: () => {
      node.removeEventListener("pointerdown", handlePointerDown);
      node.removeEventListener("pointerup", handlePointerUp);
    },
  };
}
