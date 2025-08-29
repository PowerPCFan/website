<script lang="ts">
    import { onMount } from "svelte";

    import Card from "$lib/components/Card/Card.svelte";
    import CardContent from "$lib/components/Card/CardContent.svelte";
    import CardHeader from "$lib/components/Card/CardHeader.svelte";
    import CircularStatusIndicator from "$lib/components/Card/Utilities/CircularStatusIndicator.svelte";
    import StatusText from "$lib/components/Card/Utilities/StatusText.svelte";

    let { userId } = $props();

    let isLoading: boolean = $state(true);
    let isActive: boolean | undefined = $state();
    let appName: string | undefined = $state();
    let details: string | undefined = $state();
    let fileName: string | undefined = $state();
    let gitBranch: string | undefined = $state();
    let gitRepo: string | undefined = $state();
    let isDebugging: boolean | undefined = $state(false);
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
<Card height_100percent>
    <CardHeader>
        <CircularStatusIndicator loading />
        <StatusText>Loading VSCode status...</StatusText>
    </CardHeader>
</Card>
{:else if errorCode}
<Card height_100percent error>
    <CardHeader>
        <CircularStatusIndicator error />
        <StatusText>Error loading VSCode data</StatusText>
    </CardHeader>
    <CardContent>
        <div class="generic-error">Please try again later.</div>
    </CardContent>
</Card>
{:else if isActive && details && workspace}
<Card height_100percent>
    <CardHeader>
        <CircularStatusIndicator green />
        <StatusText>Online</StatusText>
    </CardHeader>
    
    <CardContent>
        {#if languageIcon}
        <div class="language-icon">
            <img loading="lazy" src={languageIcon} alt="{language} icon" />
        </div>
        {/if}
        
        <div class="status-info">
            {#if fileName}
            <div class="details">
                <span class="normal-weight">{isDebugging ? 'Debugging' : 'Editing'}</span> <span class="semi-bold">{fileName}</span>
            </div>
            {/if}
            {#if language}
            <div class="language"><span class="normal-weight">Language:</span> <span class="semi-bold">{capitalizeFirstLetter(language ?? 'unknown')}</span></div>
            {/if}
            <div class="workspace-name"><span class="normal-weight">Workspace:</span> <span class="semi-bold">{workspace}</span></div>
            {#if gitBranch}
            <div class="git-info">
                {#if gitRepo}
                    <span class="normal-weight">Repository:</span> <span class="semi-bold">{gitRepo}:{gitBranch}</span>
                {:else}
                    <span class="normal-weight">Branch:</span> <span class="semi-bold">{gitBranch}</span>
                {/if}
            </div>
            {/if}
        </div>
    </CardContent>
</Card>
{:else}
<Card height_100percent>
    <CardHeader>
        <CircularStatusIndicator />
        <StatusText>Offline</StatusText>
    </CardHeader>
    <CardContent>
        <div class="language-icon">
            <img loading="lazy" src="https://raw.githubusercontent.com/PowerPCFan/vscode-status-api/refs/heads/master/assets/icons/vscode.png" alt="VSCode logo" />
        </div>
        <div class="status-info">
            <div class="details">
                <span class="semi-bold">This user is currently offline.</span>
            </div>
        </div>
    </CardContent>
</Card>
{/if}

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .normal-weight {
        font-weight: normal;
    }

    .semi-bold {
        font-weight: 600;
    }

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
            margin-bottom: 0.25rem;
        }
        
        .language {
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 0.25rem;
            color: g.$light;
        }
        
        .workspace-name {
            font-size: 0.9rem;
            color: g.$border;
            margin-bottom: 0.25rem;
        }

        .git-info {
            font-size: 0.9rem;
            color: g.$border;
        }
    }

    .generic-error {
        font-size: 0.85rem;
        color: g.$border;
        font-style: italic;
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
