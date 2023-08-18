<script lang="ts">
  import type { MinifiedUser } from "$lib/types";

  export let user: MinifiedUser;
</script>

<a href="/{user.username}" class="cursor-pointer"> <slot /></a>
