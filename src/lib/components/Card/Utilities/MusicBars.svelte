<div class="music-bars" aria-hidden="true">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</div>

<style lang="scss">
    @keyframes bounce {
        0%, 100% { transform: scaleY(0.3); }
        50%      { transform: scaleY(1); }
    }

    .music-bars {
        display: flex;
        align-items: flex-end;
        gap: 3px;
        height: 14px;
        width: 18px;
    }

    .music-bars > span {
        width: 3px;
        height: 100%;
        background: #3be377;
        border-radius: 2px;
        animation: bounce 1s ease-in-out infinite;
        transform-origin: bottom;
    }

    .music-bars > span:nth-child(1) { animation-delay: 0s; }
    .music-bars > span:nth-child(2) { animation-delay: 0.4s; }
    .music-bars > span:nth-child(3) { animation-delay: 0.1s; }
    .music-bars > span:nth-child(4) { animation-delay: 0.7s; }
</style>