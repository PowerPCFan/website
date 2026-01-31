<script lang="ts">
    let { normalLyricsShowing, originalLanguage, translatedLanguage, toggleTranslatedLyrics }: { normalLyricsShowing: boolean, originalLanguage?: string, translatedLanguage?: string, toggleTranslatedLyrics: VoidFunction } = $props();
</script>

<div class="toggle-container">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="language-toggle" onclick={toggleTranslatedLyrics}>
        <div class="slider" class:show-original={normalLyricsShowing} class:show-translation={!normalLyricsShowing}></div>
        <div class="language-wrapper">
            <span class="language original" class:active={normalLyricsShowing}>
                {originalLanguage || 'Original'}
            </span>
            <span class="language translation" class:active={!normalLyricsShowing}>
                {translatedLanguage || 'Translation'}
            </span>
        </div>
    </div>
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .toggle-container {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .language-toggle {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        height: 40px;
        background-color: g.$border;
        border-radius: 1.25rem;
        cursor: pointer;
        padding: 0 10px;
        overflow: hidden;
    }

    .slider {
        position: absolute;
        top: 3px;
        height: 80%;
        background-color: g.$primary;
        border-radius: 1rem;
        transition: left 0.3s, width 0.3s;
        z-index: 1;
        width: 50%;
    }

    .slider.show-original {
        left: 0;
        transform: translateX(5px);
    }

    .slider.show-translation {
        left: 50%;
        transform: translateX(-5px);
    }

    .language-wrapper {
        position: relative;
        display: flex;
        width: 100%;
        justify-content: space-between;
        z-index: 2;
        gap: 1rem;
        padding-inline: 0.5rem;
    }

    .language {
        text-align: center;
        font-size: 0.9rem;
        color: g.$light;
        transition: color 0.3s;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .language.active {
        color: white;
        font-weight: bold;
    }
</style>