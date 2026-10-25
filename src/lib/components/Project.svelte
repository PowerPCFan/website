<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        name,
        description,
        children
    }: {
        name: string;
        description: string;
        children: Snippet;
    } = $props();
</script>

<div style="justify-content: inherit">
    <h2>{name}</h2>
    <p>
        {@html description}
    </p>

    <div style="justify-content: inherit" class="mt-4 flex items-center space-x-4">
        {@render children()}
    </div>
</div>
