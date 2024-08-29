export function translateTransformer(code: string) {
  if (code === "percent") return "%";
  return code;
}

export function resize(node: HTMLElement | Event) {
  let target: HTMLElement;

  if (node instanceof Event) {
    target = node.target as HTMLElement;
  } else {
    target = node;
  }

  const maxHeight = Number.parseInt(target.dataset.maxLines || "1");
  
  target.style.maxHeight = `${maxHeight}lh`;
  target.style.height = "0px";
  target.style.height = `${target.scrollHeight}px`;
}
