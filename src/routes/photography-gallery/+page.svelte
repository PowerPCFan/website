<script lang="ts">
    import { onMount } from "svelte";

    function sleep(secs: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, secs * 1000));
    }

    // use artificial delay to give the user some time to read the message
    onMount(() => { sleep(1.25).then(() => { window.location.href = '/gallery' }) });
</script>

<div style="margin: 0 auto;">
    <h1 style="text-align: center;">Redirecting to new page...</h1>
</div>
