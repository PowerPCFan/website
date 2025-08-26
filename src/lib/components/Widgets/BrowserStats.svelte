<script lang="ts">
    import { onMount } from 'svelte';
    import Card from '$lib/components/Card/Card.svelte';
    import CardContent from '$lib/components/Card/CardContent.svelte';
    import CardHeader from '$lib/components/Card/CardHeader.svelte';
    import StatusText from '$lib/components/Card/Utilities/StatusText.svelte';

    interface ClientString {
        s: string;
        r: RegExp;
    }

    interface Jscd {
        os: string;
        osVersion: string;
    }

    async function detectOS(): Promise<Jscd> {
        const unknown = "";
        const nAgt = navigator.userAgent;

        let os: string = unknown;
        let osVersion: string = unknown;

        const clientStrings: ClientString[] = [
            { s: "Windows 10", r: /(Windows 10.0|Windows NT 10.0)/ },
            { s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/ },
            { s: "Windows 8", r: /(Windows 8|Windows NT 6.2)/ },
            { s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/ },
            { s: "Windows Vista", r: /Windows NT 6.0/ },
            { s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/ },
            { s: "Android", r: /Android/ },
            { s: "iOS", r: /(iPhone|iPad|iPod)/ },
            { s: "Mac OS X", r: /Mac OS X/ },
            { s: "Linux", r: /(Linux|X11(?!.*CrOS))/ },
            { s: "Chrome OS", r: /CrOS/ },
        ];

        for (const cs of clientStrings) {
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        if (/Windows/.test(os)) {
            const match = /Windows (.*)/.exec(os);
            osVersion = match ? match[1] : unknown;

            // Windows 11 detection trick
            if (osVersion === "10" && (navigator as any).userAgentData) {
                try {
                    const ua: any = await (navigator as any).userAgentData.getHighEntropyValues(["platformVersion"]);
                    osVersion = parseInt(ua.platformVersion.split(".")[0]) < 13 ? "10" : "11";
                } catch {
                    // fallback stays "10"
                }
            }
            os = "Windows";
        } else if (/Mac OS X/.test(os)) {
            const match = /Mac OS X ([\d._]+)/.exec(nAgt);
            osVersion = match ? match[1].replace(/_/g, ".") : unknown;
        } else if (/Android/.test(os)) {
            const match = /Android ([\d.]+)/.exec(nAgt);
            osVersion = match ? match[1] : unknown;
        } else if (/iPhone|iPad|iPod/.test(nAgt)) {
            const match = /OS (\d+)_(\d+)_?(\d+)?/.exec(nAgt);
            if (match) {
                osVersion = `${match[1]}.${match[2]}.${match[3] || 0}`;
            }
            os = "iOS";
        }

        return { os, osVersion };
    }

    async function getOS(): Promise<string> {
        const { os, osVersion } = await detectOS();
        return `${os}${osVersion ? ' ' + osVersion : ''}`;
    }

    async function getBatteryPercentage(): Promise<[boolean, string]> {
        const nav = navigator as any
        if (!nav.getBattery) return [false, '']

        try {
            const battery = await nav.getBattery()
            const batteryLevel = (battery.level * 100).toFixed(0)
            return [true, `${batteryLevel}%`]
        } catch (e) {
            return [false, '']
        }
    }

    let os: string = $state('');
    let browserUserAgent: string = $state('');
    let batteryPercentageSupported: boolean = $state(false);
    let batteryPercentage: string = $state('');
    let viewportSize: string = $state('');
    let screenResolution: string = $state('');
    let timezone: string = $state('');
    let language: string = $state('');

    async function refresh() {
        os = await getOS();
        browserUserAgent = navigator.userAgent || navigator.appVersion;
        [batteryPercentageSupported, batteryPercentage] = await getBatteryPercentage();
        viewportSize = `${window.innerWidth} x ${window.innerHeight}`;
        screenResolution = `${(screen.width) * (window.devicePixelRatio || 1)} x ${(screen.height) * (window.devicePixelRatio || 1)} (${screen.colorDepth} bits)`;
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        language = ((new Intl.DisplayNames(['en'], { type: 'language' })).of(navigator.language)) || 'Unknown';
    }

    onMount(async () => {
        await refresh();  // initial load
    });
</script>

<svelte:window on:resize={refresh} />

<Card height_100percent>
    <CardHeader inlineStyles="margin-bottom: 0.25rem;">
        <StatusText inlineStyles="text-transform: none;">Operating System</StatusText>
    </CardHeader>
    <CardContent><h3 class="text">{os}</h3></CardContent>

    <CardHeader inlineStyles="margin-bottom: 0.25rem; margin-top: 1rem;">
        <StatusText inlineStyles="text-transform: none;">Browser User Agent</StatusText>
    </CardHeader>
    <CardContent><h3 class="text">{browserUserAgent}</h3></CardContent>

    {#if batteryPercentageSupported}
        <CardHeader inlineStyles="margin-bottom: 0.25rem; margin-top: 1rem;">
            <StatusText inlineStyles="text-transform: none;">Battery Percentage</StatusText>
        </CardHeader>
        <CardContent><h3 class="text">{batteryPercentage}</h3></CardContent>
    {/if}

    <CardHeader inlineStyles="margin-bottom: 0.25rem; margin-top: 1rem;">
        <StatusText inlineStyles="text-transform: none;">Viewport Size</StatusText>
    </CardHeader>
    <CardContent><h3 class="text">{viewportSize}</h3></CardContent>

    <CardHeader inlineStyles="margin-bottom: 0.25rem; margin-top: 1rem;">
        <StatusText inlineStyles="text-transform: none;">Screen Resolution</StatusText>
    </CardHeader>
    <CardContent><h3 class="text">{screenResolution}</h3></CardContent>

    <CardHeader inlineStyles="margin-bottom: 0.25rem; margin-top: 1rem;">
        <StatusText inlineStyles="text-transform: none;">Timezone</StatusText>
    </CardHeader>
    <CardContent><h3 class="text">{timezone}</h3></CardContent>

    <CardHeader inlineStyles="margin-bottom: 0.25rem; margin-top: 1rem;">
        <StatusText inlineStyles="text-transform: none;">Language</StatusText>
    </CardHeader>
    <CardContent><h3 class="text">{language}</h3></CardContent>
</Card>

<style>
    .text {
        margin-block: 0;
        font-weight: 600;
    }
</style>
