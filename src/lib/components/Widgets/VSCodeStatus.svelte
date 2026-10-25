<script lang="ts">
    import { onMount } from "svelte";
    import CircularStatusIndicator from "$lib/components/Card/Utilities/CircularStatusIndicator.svelte";
    import * as Card from "$lib/components/ui/card/index.js";

    let { userId } = $props();

    let isLoading: boolean = $state(true);
    let isActive: boolean | undefined = $state();
    let appName: string | undefined = $state();
    let details: string | undefined = $state();
    let fileName: string | undefined = $state();
    let gitBranch: string | undefined = $state();
    let gitRepo: string | undefined = $state();
    let isDebugging: boolean | undefined = $state(false);
    let isIdling: boolean | undefined = $state(false);
    let language: string | undefined = $state();
    let languageIcon: string | undefined = $state();
    let workspace: string | undefined = $state();
    let lastUpdated: string | undefined = $state();
    let errorCode: string | undefined = $state();

    const THROW_ERROR_FOR_DEBUG = false; // simulates http error 500
    const MAX_RETRIES = 3; // amount of retry attempts
    const RETRY_DELAY_MS = 1000; // delay between retries, in millseconds
    const pollInterval = 30000; // 30 seconds

    function capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    interface VSCodeData {
        created_at: string;
        last_updated: string;
        status: {
            appName: string;
            details: string;
            fileName: string;
            gitBranch: string;
            gitRepo: string;
            isDebugging: boolean;
            isIdling: boolean;
            language: string;
            languageIcon: string;
            timestamp: number;
            workspace: string;
        };
        user_id: string;
    }

    async function getVSCodeStatus(userId: string) {
        try {
            const res = await fetch(
                `https://vscode-status.powerpcfan.xyz/get-status?userId=${encodeURIComponent(userId)}`
            );

            let json: VSCodeData | null = null;

            try {
                json = await res.json();
            } catch (e) {
                return {
                    isActive: false,
                    errorCode: 'INTERNAL_ERROR',
                    errorMessage: 'Unexpected response format',
                    httpStatus: res.status,
                    raw: null
                };
            }

            if (!res.ok) {
                const errorCode = res.status === 404
                    ? 'USER_NOT_FOUND'
                    : res.status === 504
                        ? 'TIMEOUT'
                        : 'INTERNAL_ERROR';
                return {
                    isActive: false,
                    errorCode,
                    errorMessage: errorCode,
                    httpStatus: res.status,
                    raw: json
                };
            }

            const status = json?.status;
            if (!status) {
                return {
                    isActive: false,
                    errorCode: 'NO_STATUS_DATA',
                    errorMessage: 'No VSCode status available',
                    httpStatus: res.status,
                    raw: json
                };
            }

            const isActive = true;

            return {
                isActive,
                appName: status.appName,
                details: status.details,
                fileName: status.fileName,
                gitBranch: status.gitBranch,
                gitRepo: status.gitRepo,
                isDebugging: status.isDebugging,
                isIdling: status.isIdling,
                language: status.language,
                languageIcon: status.languageIcon,
                workspace: status.workspace,
                lastUpdated: json?.last_updated,
                raw: json
            };
        } catch (e) {
            return {
                isActive: false,
                errorCode: 'INTERNAL_ERROR',
                errorMessage: (e as Error).message || 'Unknown error',
                httpStatus: undefined,
                raw: null
            };
        }
    }

    async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

    async function loadStatusWithRetry() {
        let attempt = 0;
        let lastErrorCode: string | undefined;
        while (attempt < MAX_RETRIES) {
            if (THROW_ERROR_FOR_DEBUG) {
                lastErrorCode = '500';
            } else {
                try {
                    const status = await getVSCodeStatus(userId);
                    if (!status.errorCode) {
                        errorCode = undefined;
                        isActive = status.isActive;
                        appName = status.appName;
                        details = status.details;
                        fileName = status.fileName;
                        gitBranch = status.gitBranch;
                        gitRepo = status.gitRepo;
                        isDebugging = status.isDebugging;
                        isIdling = status.isIdling;
                        language = status.language;
                        languageIcon = status.languageIcon;
                        workspace = status.workspace;
                        lastUpdated = status.lastUpdated;
                        return true;
                    } else {
                        lastErrorCode = status.errorCode;
                    }
                } catch (e) {
                    lastErrorCode = 'INTERNAL_ERROR';
                }
            }
            attempt++;
            if (attempt < MAX_RETRIES) {
                await sleep(RETRY_DELAY_MS);
            }
        }
        errorCode = lastErrorCode;
        return false;
    }

    onMount(() => {
        loadStatusWithRetry().finally(() => {
            isLoading = false;
        });

        const interval = setInterval(loadStatusWithRetry, pollInterval);
        return () => clearInterval(interval);
    });
</script>

{#if isLoading}
    <Card.Root class="h-full">
        <Card.Header class="flex flex-row items-center gap-3 mb-4">
            <CircularStatusIndicator loading />
            <p class="m-0 text-sm text-muted-foreground font-semibold tracking-wide uppercase">
                Loading VSCode status...
            </p>
        </Card.Header>
    </Card.Root>
{:else if errorCode}
    <Card.Root class="h-full ring-destructive gap-0">
        <Card.Header class="flex flex-row items-center gap-3 mb-4">
            <CircularStatusIndicator error />
            <p class="m-0 text-sm text-muted-foreground font-semibold tracking-wide uppercase">
                Error loading VSCode data
            </p>
        </Card.Header>
        <Card.Content class="flex items-start gap-4">
            <div class="italic text-sm text-muted-foreground">Please try again later.</div>
        </Card.Content>
    </Card.Root>
{:else if isIdling}
    <Card.Root class="h-full gap-0">
        <Card.Header class="flex flex-row items-center gap-3 mb-4">
            <CircularStatusIndicator yellow />
            <p class="m-0 text-sm text-muted-foreground font-semibold tracking-wide uppercase">
                Idling
            </p>
        </Card.Header>
        <Card.Content class="flex items-start gap-4">
            <div class="language-icon">
                <img loading="lazy" src={languageIcon} alt="Icon" />
            </div>
            <div class="status-info">
                <div class="details">
                    <span class="semi-bold">Idling</span>
                </div>
            </div>
        </Card.Content>
    </Card.Root>
{:else if isActive && details && workspace}
    <Card.Root class="h-full max-w-100">
        <Card.Header class="flex flex-row items-center gap-3">
            <CircularStatusIndicator green />
            <p class="m-0 text-sm text-muted-foreground font-semibold tracking-wide uppercase">Online</p>
        </Card.Header>

        <Card.Content class="flex items-start gap-4">
            {#if languageIcon}
                <div class="language-icon">
                    <img loading="lazy" src={languageIcon} alt="{language} icon" />
                </div>
            {/if}

            <div class="status-info">
                {#if fileName}
                    <div class="details">
                        <span class="font-normal">{isDebugging ? 'Debugging' : 'Editing'}</span> <span class="semi-bold">{fileName}</span>
                    </div>
                {/if}

                {#if language}
                    <div class="language">
                        <span class="font-normal">Language:</span> <span class="semi-bold">{capitalizeFirstLetter(language ?? 'unknown')}</span>
                    </div>
                {/if}

                <div class="workspace-name">
                    <span class="font-normal">Workspace:</span> <span class="semi-bold">{workspace}</span>
                </div>

                {#if gitBranch}
                    <div class="git-info">
                        {#if gitRepo}
                            <span class="font-normal">Repository:</span> <span class="semi-bold">{gitRepo}:{gitBranch}</span>
                        {:else}
                            <span class="font-normal">Branch:</span> <span class="semi-bold">{gitBranch}</span>
                        {/if}
                    </div>
                {/if}
            </div>
        </Card.Content>
    </Card.Root>
{:else}
    <Card.Root class="h-full">
        <Card.Header class="flex flex-row items-center gap-4">
            <CircularStatusIndicator />
            <p class="m-0 text-sm text-muted-foreground font-semibold tracking-wide uppercase">
                Offline
            </p>
        </Card.Header>
        <Card.Content class="flex items-start gap-4">
            <div class="language-icon">
                <img
                    loading="lazy"
                    src="https://raw.githubusercontent.com/PowerPCFan/vscode-status-api/refs/heads/master/assets/icons/vscode.png"
                    alt="VSCode logo"
                />
            </div>
            <div class="status-info">
                <div class="details">
                    <span class="font-semibold">This user is currently offline.</span>
                </div>
            </div>
        </Card.Content>
    </Card.Root>
{/if}

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .language-icon {
        flex-shrink: 0;

        img {
            width: 90px;
            height: 90px;
            border-radius: 8px;
            object-fit: contain;
            padding: 0px;
        }
    }

    .status-info {
        flex: 1;
        min-width: 0;

        .details {
            font-size: 1.1rem;
            font-weight: 600;
            line-height: 1.3;
        }

        .language {
            font-size: 1rem;
            font-weight: 500;
            color: g.$light;
        }

        .workspace-name {
            font-size: 0.9rem;
            color: g.$border;
        }

        .git-info {
            font-size: 0.9rem;
            color: g.$border;
        }
    }

    @media (max-width: 480px) {
        .status-info {
            align-self: center;
            text-align: center;
        }

        .language-icon {
            align-self: center;

            img {
                width: 120px;
                height: 120px;
            }
        }
    }
</style>
