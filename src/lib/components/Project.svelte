<script lang="ts">
    import type { Snippet } from "svelte";
    import * as Card from "./ui/card/index.js";

    let { name, description, children }: { name: string; description: string; children: Snippet; } = $props();
</script>

<Card.Root>
    <Card.Content>
        <div style="justify-content: inherit">
            <h2 class="text-xl mb-0.5 md:text-2xl">{name}</h2>
            <p>{@html description}</p>

            <div style="justify-content: inherit" class="mt-4 flex items-center space-x-4">
                {@render children()}
            </div>
        </div>
    </Card.Content>
</Card.Root>