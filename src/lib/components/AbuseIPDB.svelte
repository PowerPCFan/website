<script lang="ts">
    import * as Card from "./ui/card/index";

    let { userId }: { userId: number } = $props();

    let count = $state<number | null>(null);

    $effect(() => {
        count = null; 

        fetch(`/api/abuseipdb?id=${userId}`)
            .then(res => res.json())
            .then(data => {
                count = data.count;
            })
            .catch(err => {
                console.error("Failed to fetch counter:", err);
            });
    });
</script>

<!-- todo: maybe wrap this in an <a> instead for better semantics and accessibility and stuff -->
<Card.Root class="bg-card p-4 mb-8 squircle-xs ring-border/75 cursor-pointer" onclick={() => {
    window.open(`https://www.abuseipdb.com/user/${userId}`, '_blank');
}}>
    <Card.Content class="flex items-center gap-3 px-0">
        <svg xmlns="http://www.w3.org/2000/svg" x="10" y="0" width="48" height="48" version="1.1" viewBox="0 0 162.18244 162.18244">
            <g transform="translate(-16.984 -331)" fill="#c0c8d4" stroke="#c0c8d4" stroke-width="5" stroke-linejoin="round">
                <path d="m48.388 396.53c0.9599-4.2739 1.9198-33.716 10.559-33.241 30.717 0.94974 62.394-30.867 85.432 39.89 71.033 33.241 4.9391 59.953-51.295 57.579-55.567-2.3264-103.01-42.383-44.696-64.227z"/>
                <g transform="matrix(1.0215 0 0 .99183 -1.0406 3.2411)">
                    <path d="m48.388 396.53c-30.511 40.982-1.0945 30.276 44.696 64.228-55.567-2.3264-103.01-42.383-44.696-64.227z"/>
                </g>
            </g>
            <g transform="translate(-16.984 -331)" fill-rule="evenodd">
                <path d="m48.388 396.53c0.9599-4.2739 1.9198-33.716 10.559-33.241 30.717 0.94974 62.394-30.867 85.432 39.89 71.033 33.241 4.9391 59.953-51.295 57.579-55.567-2.3264-103.01-42.383-44.696-64.227z" fill-opacity=".992"/>
                <path d="m46.948 406.03c35.516 22.319 94.071 8.5478 96.47-2.3744 3.3597 3.799 0 14.246 0 14.246-15.358 19.945-89.751 15.671-97.91 1.4246-0.95991-3.799 0.9599-11.872 1.4399-13.296z" fill="#fff"/>
                <g stroke-width="1.25">
                    <path d="m60.387 370.41c9.1191-8.0729 48.955 3.3241 54.235 9.4975 1.9198 10.447-48.955 2.3744-54.235-9.4975z" fill="url(#e)"/>
                    <path d="m60.387 382.29c4.3196 9.9724 21.118 33.241 49.435 10.922-23.518 0.94977-33.597-1.8995-49.435-10.922z" fill="url(#f)"/>
                    <path d="m70.466 362.82c6.2394 2.8492 45.596 13.771 49.915 10.447 4.7995-1.8995 3.8396-2.8493 1.4399-3.3241-3.8396 2.3744-10.559 3.799-51.355-7.1231z" fill="url(#g)"/>
                </g>
                <path d="m52.701 411.24c5.762 2.7324 23.528 6.3756 30.251 6.831 4.8017 3.1878 2.4008 8.1972 0.48019 11.84-12.964 0-27.85-3.1878-31.691-7.2864-2.4008-4.0986-1.4405-7.2864 0.96034-11.385z" fill="#4d4d4d" fill-opacity=".317"/>
            </g>
            <circle cx="81.091" cy="81.091" r="75.091" fill="none" stroke="#f00" stroke-width="12"/>
            <path d="m26.794 25.237 105.89 112.79" fill="none" stroke="#f00" stroke-width="12"/>
            <g transform="translate(-16.984 -331)">
                <g transform="matrix(1.0215 0 0 .99183 -1.0406 3.2411)" fill-rule="evenodd">
                    <path d="m48.388 396.53c-30.511 40.982-1.0945 30.276 44.696 64.228-55.567-2.3264-103.01-42.383-44.696-64.227z" fill-opacity=".992"/>
                </g>
            </g>
        </svg>

        <div>
            <span class="text-lg font-semibold">AbuseIPDB Stats</span>
            <p>Reports: {count ?? 'Loading...'}</p>
        </div>
    </Card.Content>
</Card.Root>
