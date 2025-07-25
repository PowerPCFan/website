<header>
    <nav>
        <a class="navbar-item" href="/">Home</a>
        <a class="navbar-item" href="https://blog.powerpcfan.xyz">Blog</a>
        <div class="navbar-item navbar-dropdown">
            <span class="navbar-dropdown-trigger">Resources <i id="chevron" class="fa-solid fa-circle-chevron-down"></i></span>
            <div class="navbar-dropdown-menu">
                <a class="navbar-dropdown-item" href="/resources/pc-resource-document/">PC Resource Document</a>
                <a class="navbar-dropdown-item" href="/resources/pc-resource-document/install-windows">Installing Windows</a>
                <a class="navbar-dropdown-item" href="/resources/keys/">Product Keys</a>
            </div>
        </div>
        <div class="navbar-item navbar-dropdown">
            <span class="navbar-dropdown-trigger">Retro Computing <i id="chevron" class="fa-solid fa-circle-chevron-down"></i></span>
            <div class="navbar-dropdown-menu">
                <a class="navbar-dropdown-item" href="/retro-computing/start-retro-computing/">Get Started with Retro Computing</a>
                <a class="navbar-dropdown-item" href="/retro-computing/good-sites/">Good Sites for Old Macs</a>
                <a class="navbar-dropdown-item" href="/retro-computing/common-issues/">Common Issues with Old Macs</a>
            </div>
        </div>
        <div class="navbar-item navbar-dropdown">
            <span class="navbar-dropdown-trigger">Tools <i id="chevron" class="fa-solid fa-circle-chevron-down"></i></span>
            <div class="navbar-dropdown-menu">
                <a class="navbar-dropdown-item" href="/tools/touch-tones/">Phone Touch Tone Simulator</a>
                <a class="navbar-dropdown-item" href="/tools/search/">Search Engines</a>
            </div>
        </div>
    </nav>
</header>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    $navbar-item-padding: 1.2rem;

    header {
        background: g.$primary;
        color: g.$light;
        padding: 0.3rem $navbar-item-padding;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    nav {
        .navbar-item {
            display: inline-block;
            max-width: 200px;
            height: 100%;

            font-weight: bold;
            text-decoration: none !important;

            color: inherit;

            border-radius: 4px;

            padding-left: $navbar-item-padding;
            padding-right: $navbar-item-padding;

            padding-top: 0.7rem;
            padding-bottom: 0.7rem;

            transition: background-color 0.3s ease, color 0.3s ease;
            
            &:hover {
                background-color: lighten($color: g.$primary, $amount: 25);
                color: g.$dark;
            }
        }

        .navbar-dropdown {
            position: relative;
            
            .navbar-dropdown-trigger {
                cursor: pointer;
                display: block;

                #chevron {
                    transition: transform 0.2s;
                }
            }

            &:hover {
                .navbar-dropdown-trigger #chevron {
                    transform: rotate(180deg);
                }
            }

            .navbar-dropdown-menu {
                position: absolute;
                top: 100%;
                left: 0;
                background: g.$primary;
                border: 1px solid lighten($color: g.$primary, $amount: 15);
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                min-width: 200px;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
            }

            &:hover .navbar-dropdown-menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .navbar-dropdown-item {
                display: block;
                padding: 0.8rem $navbar-item-padding;
                color: g.$light;
                text-decoration: none !important;
                font-weight: bold;
                transition: background-color 0.3s ease, color 0.3s ease;
                border-radius: 0;

                &:hover {
                    background-color: lighten($color: g.$primary, $amount: 25);
                    color: g.$dark;
                }

                &:first-child {
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                }

                &:last-child {
                    border-bottom-left-radius: 4px;
                    border-bottom-right-radius: 4px;
                }
            }
        }
    }
</style>