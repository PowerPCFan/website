<!-- legacy redirect -->

<script lang="ts">
    import { onMount } from "svelte";

    onMount(() => {
        window.location.href = window.location.href.replace('project-showcases', 'docs')
    });
</script>
