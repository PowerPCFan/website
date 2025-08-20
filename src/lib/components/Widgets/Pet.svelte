<script lang="ts">
    import Card from '$lib/components/Card/Card.svelte';
    import CardContent from '$lib/components/Card/CardContent.svelte';
</script>

<Card>
    <CardContent>
        <!-- background is set to example.com to trick it into being transparent -->
        <iframe
            title="GifyPet"
            scrolling="no"
            src="https://gifypet.neocities.org/pet/pet.html?name=Buddy&dob=1755619147&gender=m&element=Air&pet=dog.gif&map=forest.jpg&background=https%3A%2F%2Fexample.com&tablecolor=white&textcolor=white"
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
