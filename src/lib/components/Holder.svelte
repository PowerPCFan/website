<script lang="ts">
    import { cn } from "$lib/utils.js";
    import type { Snippet } from "svelte";

    let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<div class="-z-10 flex flex-row justify-center">
    <div class={cn(
        "m-0 md:m-6 p-4 mx-auto bg-muted md:rounded-2xl md:ring-1 ring-border/40 w-full max-w-5xl",
        className
    )}>{@render children()}</div>
</div>
