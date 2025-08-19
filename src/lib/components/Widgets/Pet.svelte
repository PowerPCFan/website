<script lang="ts">
    import Card from '$lib/components/Card/Card.svelte';
    import CardContent from '$lib/components/Card/CardContent.svelte';
</script>

<Card>
    <CardContent>
        <iframe
            title="GifyPet"
            scrolling="no"
            src="https://gifypet.neocities.org/pet/pet.html?name=Buddy&dob=1755619147&gender=m&element=Air&pet=dog.gif&map=forest.jpg&background=paper.jpg&tablecolor=black&textcolor=black"
            frameborder="0">
        </iframe>
    </CardContent>
</Card>

<style lang="scss">
    iframe {
        margin-inline: auto;
        overflow: hidden;
        width: 315px;
        height: 315px;
    }
</style>