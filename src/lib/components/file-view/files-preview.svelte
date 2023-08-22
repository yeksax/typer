<script lang="ts">
  import { creator } from "$lib/stores";
  import { multipleIncludes } from "$lib/utils/string";
  import ImageGrid from "./image-grid.svelte";
  import OtherFile from "./other-file.svelte";

  export let files: FileList;

  $: filesArray = Array.from(files);

  $: images = filesArray.filter((file) => file.type.includes("image"));
  $: videos = filesArray.filter((file) => file.type.includes("video"));
  $: audios = filesArray.filter((file) => file.type.includes("audio"));
  $: other = filesArray.filter(
    (file) => !multipleIncludes(["image", "video", "audio"], file.type)
  );

  function removeFile(file: File) {
    const updatedFiles = new DataTransfer();
    let removed = false;

    for (let i = 0; i < filesArray.length; i++) {
      if (removed === false && filesArray[i] === file) {
        removed = true;
      } else {
        updatedFiles.items.add(filesArray[i]);
      }
    }

    creator.update((state) => ({
      ...state,
      content: {
        ...state.content,
        attachments: updatedFiles.files,
      },
    }));
  }
</script>

{#if images.length > 0}
  <ImageGrid {removeFile} {images} />
{/if}

{#if other.length}
  <div
    class="grid mt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-3 gap-2">
    {#each other as file}
      <OtherFile removeFile={() => removeFile(file)} {file} />
    {/each}
  </div>
{/if}
