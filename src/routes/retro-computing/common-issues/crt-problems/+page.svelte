<script lang="ts">
    import Title from '$lib/components/title.svelte';
</script>

<Title title="CRT Problems" />

<div class="content">
    <h1 class="main-title">CRT Problems</h1>

    <h2 class="section-title">A Dim Picture</h2>

    <p class="section-text">
        First, make sure the brightness isn't turned down &lpar;in software or with brightness knobs on the CRT&rpar;. A lot of people think their CRT is going bad but it's really just a brightness issue! &colon;&rpar;<br /><br />
        Another common cause is bad capacitors. Over time, capacitors &quot;explode&quot; and leak, and when that happens they can't hold a charge properly, which can cause the circuits driving the CRT to behave erratically. Check for leaky caps on your analog board. <br /><br />
        Usually, the most common issue is just an old worn-out tube. CRTs wear out with age, causing them to produce a dimmer and less crisp picture.<br /><br />
        You can try and fix a worn-out tube, but usually it's not worth it as it's very hard to do without damaging it further.
    </p>
</div>

<style lang="scss">
    .content {
        padding-block: 2rem;
    }

    .main-title {
        text-align: center;
        text-decoration: underline;
        margin-bottom: 2rem;
    }

    .section-title {
        text-align: left;
        font-size: 1.7rem;
        margin-bottom: 1.5rem;
        margin-top: 2rem;
    }

    .section-text {
        text-align: left;
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }
</style>
