<script lang="ts">
  import { translateTransformer } from "$lib/utils/css";
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";

  export let axis: "x" | "y" | undefined = undefined;
  export let snapToOrigin = false;
  export let disabled = false;

  let draggable: HTMLElement;

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
    if (!draggable) return;

    moving = false;

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

    // initialX = rect.left;
    // initialY = rect.top;
    ready = true;
  });

  let translate = "";

  $: {
    if (ready) {
      translate = `translate(calc(${translateX} + ${x}px), calc(${translateY} + ${y}px))`;
    } else {
      translate = "";
    }
  }
</script>

<svelte:window
  on:pointermove={movementHandler}
  on:pointerup={() => endMovement()} />

<div
  bind:this={draggable}
  on:pointerdown={startMovement}
  class={twMerge("z-40 bg-white dark:bg-zinc-850", $$props.class)}
  style="transform: {translate}">
  <slot />
</div>
