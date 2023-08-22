<script lang="ts">
  import Button from "$lib/components/button/button.svelte";
  import { creator } from "$lib/stores";
  import { multipleIncludes } from "$lib/utils/string";
  import { FileIcon, ImageIcon } from "svelte-feather-icons";

  const ButtonProps = {
    type: "button",
    class:
      "bg-zinc-100 dark:bg-zinc-800 transition-all rounded-md hover-effect after:rounded-md position-fix",
  } as const;

  const IconProps = {
    size: "15",
    strokeWidth: 2.25,
  } as const;

  let anyAttachments: HTMLInputElement;
  let imageAttachments: HTMLInputElement;

  function appendFiles(e: Event) {
    if (!(e.target as HTMLInputElement).files) return;
    const files = Array.from((e.target as HTMLInputElement).files as FileList);

    let imagesCount = 0;
    let filesCount = 0;

    if ($creator.content.attachments) {
      const fileArray = Array.from($creator.content.attachments);

      imagesCount = fileArray.filter((file) =>
        file.type.includes("image")
      ).length;

      filesCount = fileArray.filter(
        (file) => !multipleIncludes(["image", "video", "audio"], file.type)
      ).length;
    }

    const dataTransfer = new DataTransfer();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.includes("image")) {
        if (imagesCount < $creator.content.maxImages) imagesCount++;
        else {
          creator.update((state) => ({
            ...state,
            error: `Você só pode enviar até
              ${$creator.content.maxImages} imagens.`,
          }));
          continue;
        }
      }

      if (!multipleIncludes(["image", "video", "audio"], file.type)) {
        if (filesCount < $creator.content.maxFiles) filesCount++;
        else {
          creator.update((state) => ({
            ...state,
            error:
              "Você só pode enviar até " +
              $creator.content.maxFiles +
              " arquivos.",
          }));
          continue;
        }
      }

      if (file.type.includes("video")) {
        creator.update((state) => ({
          ...state,
          error: "Vídeos ainda não são suportados.",
        }));
        continue;
      }
      dataTransfer.items.add(file);
    }

    if ($creator.content.attachments) {
      for (let i = 0; i < $creator.content.attachments.length; i++) {
        const file = $creator.content.attachments[i];
        dataTransfer.items.add(file);
      }
    }

    creator.update((state) => ({
      ...state,
      content: {
        ...state.content,
        attachments: dataTransfer.files,
      },
    }));
  }
</script>

<input
  class="hidden"
  bind:this={anyAttachments}
  type="file"
  id="attachments-appender"
  multiple
  on:change={appendFiles} />

<input
  class="hidden"
  bind:this={imageAttachments}
  type="file"
  accept="image/*"
  id="attachments-appender"
  multiple
  on:change={appendFiles} />

<div class="flex justify-between items-center mt-2">
  <div class="flex gap-4">
    <button on:click={() => imageAttachments.click()} {...ButtonProps}>
      <ImageIcon {...IconProps} />
    </button>
    <button on:click={() => anyAttachments.click()} {...ButtonProps}>
      <FileIcon {...IconProps} />
    </button>
  </div>

  <Button type="submit">Enviar</Button>
</div>
