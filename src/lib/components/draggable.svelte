<script lang="ts">
  import { translateTransformer } from "$lib/utils/css";
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";

  export let minimumHoldTime = 0;
  export let axis: "x" | "y" | undefined = undefined;
  export let snapToOrigin = false;
  export let disabled = false;

  export let onDragStart: (e: PointerEvent | TouchEvent) => void = () => {};
  export let onDragMove: (e: PointerEvent | TouchEvent) => void = () => {};
  export let onDragEnd: (e: PointerEvent | TouchEvent) => void = () => {};

  export let offsetY = 0;
  export let offsetX = 0;

  export let draggable: HTMLElement | undefined = undefined;

  let rect: DOMRect | undefined;
  let pointerDown = { x: 0, y: 0 };

  let translateX = "0px";
  let translateY = "0px";

  let x = 0;
  let y = 0;
  let moving = false;
  let ready = false;

  function movementHandler(e: PointerEvent | TouchEvent) {
    if (!moving) return;

    let dragX = 0;
    let dragY = 0;
    if (e instanceof PointerEvent) {
      dragX = e.movementX;
      dragY = e.movementY;

      if (axis === "x") {
        x += dragX;
      } else if (axis === "y") {
        y += dragY;
      } else {
        x += dragX;
        y += dragY;
      }
    } else {
      dragX = e.touches[0].clientX;
      dragY = e.touches[0].clientY;

      if (axis === "x") {
        x = dragX - rect!.left - pointerDown.x;
      } else if (axis === "y") {
        y = dragY - rect!.top - pointerDown.y;
      } else {
        x = dragX - rect!.left - pointerDown.x;
        y = dragY - rect!.top - pointerDown.y;
      }
    }

    console.log(pointerDown);
  }

  function endMovement({ forceSnap }: { forceSnap?: boolean } = {}) {
    moving = false;
    if (!draggable) return;

    if (snapToOrigin || forceSnap) {
      draggable.animate(
        [
          {
            transform: translate,
          },
          {
            transform: `translate(${translateX}, ${translateY}))`,
          },
        ],
        {
          duration: 500,
          easing: "cubic-bezier(.5,.3,.35,1)",
        }
      );

      [x, y] = [0, 0];
    }
  }

  function startMovement(e: PointerEvent) {
    if (!draggable) return;

    if (!rect) {
      rect = draggable.getBoundingClientRect();
      pointerDown = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    if (!disabled) moving = true;
  }

  $: {
    if (disabled) {
      endMovement({
        forceSnap: true,
      });
    }
  }

  onMount(() => {
    const transform = draggable!.computedStyleMap().get("transform") as any;
    const translate = transform[0];

    if (translate) {
      translateX = translate.x.value + translateTransformer(translate.x.unit);
      translateY = translate.y.value + translateTransformer(translate.x.unit);
    }

    ready = true;
  });

  let translate = "";

  $: {
    if (ready) {
      if (disabled) {
        translate = `translate(calc(${translateX} + ${x}px), calc(${translateY} + ${y}px))`;
      } else {
        translate = `translate(calc(${translateX} + ${
          x + offsetX
        }px), calc(${translateY} + ${y + offsetY}px))`;
      }
    } else {
      translate = "";
    }
  }

  function dragStartHandler(e: PointerEvent) {
    startMovement(e);
    onDragStart(e);
  }

  function accidentalInitHandler() {
    endMovement();
  }
</script>

<svelte:window
  on:pointermove={(e) => {
    movementHandler(e);
    onDragMove(e);
  }}
  on:touchmove={(e) => {
    movementHandler(e);
    onDragMove(e);
  }}
  on:pointerup={(e) => {
    endMovement();
    onDragEnd(e);
    moving = false;
  }}
  on:click={accidentalInitHandler} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={draggable}
  on:pointerdown={dragStartHandler}
  data-longpressms={minimumHoldTime}
  class={twMerge("z-40 bg-white dark:bg-zinc-850", $$restProps.class)}
  style="transform: {translate}">
  <slot />
</div>
