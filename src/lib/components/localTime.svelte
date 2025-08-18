<script>
    import { onMount } from 'svelte';

    let time = "";

    function updateTime() {
        const now = new Date();
        time = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).format(now);
    }

    onMount(() => {
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    });
</script>

<p>{time}</p>
