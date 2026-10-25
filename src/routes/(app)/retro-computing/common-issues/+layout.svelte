<script lang="ts">
    import * as Card from '$lib/components/ui/card/index.js';
    let { children } = $props();
</script>

<div class="h-full w-auto p-8 bg-[url('/images/background-tiles/2.png')] bg-repeat">
    <!-- <div class="mx-auto w-[90%] bg-foreground text-background p-4 squircle-md">{@render children()}</div> -->
    <Card.Root class="max-w-11/12 mx-auto">
        <Card.Content>
            {@render children()}
        </Card.Content>
    </Card.Root>
</div>  
