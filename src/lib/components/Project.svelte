<script lang="ts">
    import type { Snippet } from "svelte";
    import * as Card from "./ui/card/index.js";

    let { name, description, children }: { name: string; description: string; children: Snippet; } = $props();
</script>

<Card.Root class="flex flex-col h-full">
    <Card.Content class="flex flex-col flex-1 h-full">
        <div class="[justify-content:inherit] flex flex-col flex-1">
            <h2 class="text-xl mb-0.5 md:text-2xl">{name}</h2>
            <p class="flex-1">{@html description}</p>
            <div class="mt-4 flex items-center space-x-4 [justify-content:inherit]">
                {@render children()}
            </div>
        </div>
    </Card.Content>
</Card.Root>