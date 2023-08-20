<script lang="ts">
  import { translateTransformer } from "$lib/utils/css";
  import { longpress } from "$lib/utils/hooks/long-press";
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";

  export let minimumHoldTime = 0;
  export let axis: "x" | "y" | undefined = undefined;
  export let snapToOrigin = false;
  export let disabled = false;

  export let onDragStart: (e: PointerEvent) => void = () => {};
  export let onDragMove: (e: PointerEvent) => void = () => {};
  export let onDragEnd: (e: PointerEvent) => void = () => {};

  export let offsetY = 0;
  export let offsetX = 0;

  export let draggable: HTMLElement | undefined = undefined;

  let translateX = "0px";
  let translateY = "0px";

  let x = 0;
  let y = 0;
  let moving = false;
  let ready = false;

  function movementHandler(e: PointerEvent) {
    if (!moving) return;

    if (axis === "x") {
      x += e.movementX;
    } else if (axis === "y") {
      y += e.movementY;
    } else {
      x += e.movementX;
      y += e.movementY;
    }
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

  function startMovement() {
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
    const transform = draggable.computedStyleMap().get("transform") as any;
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
    startMovement();
    onDragStart(e);
  }

  function accidentalInitHandler(e: MouseEvent) {
    endMovement();
  }
</script>

<svelte:window
  on:pointermove={(e) => {
    movementHandler(e);
    onDragMove(e);
  }}
  on:pointerup={(e) => {
    endMovement();
    onDragEnd(e);
    moving = false;
  }}
  on:click={accidentalInitHandler} />

<div
  bind:this={draggable}
  on:pointerdown={dragStartHandler}
  data-longpressms={minimumHoldTime}
  class={twMerge("z-40 bg-white dark:bg-zinc-850", $$restProps.class)}
  style="transform: {translate}">
  <slot />
</div>
