export type LastFmErrorCode =
    | 'INTERNAL_ERROR'
    | 'TIMEOUT'
    | 'USER_LIKELY_DOES_NOT_EXIST'
    | 'NO_TRACKS_FOUND';

export interface LatestSongVars {
    // Track info (present only when no error)
    isNowPlaying: boolean;
    trackName?: string;
    trackUrl?: string;
    artistName?: string;
    albumName?: string;
    images: {
        small?: string;
        medium?: string;
        large?: string;
        extralarge?: string;
        best?: string;
    };
    playedAt?: Date;
    playedAtUnix?: number;
    // Error info
    errorCode?: LastFmErrorCode;
    errorMessage?: string;
    httpStatus?: number;
    // Raw payload always included for debugging
    raw: unknown;
}

export async function getLatestSongVars(username: string): Promise<LatestSongVars> {
    try {
        const res = await fetch(
            `https://lastfm-last-played.powerpcfan.xyz/${encodeURIComponent(username)}`
        );
        let json: any = null;
        try {
            json = await res.json();
        } catch (e) {
            // If body isn't JSON, treat as internal error
            return {
                isNowPlaying: false,
                images: {},
                errorCode: 'INTERNAL_ERROR',
                errorMessage: 'Unexpected response format',
                httpStatus: res.status,
                raw: null
            };
        }

        const possibleCode = json?.message as string | undefined;
        const knownCodes: LastFmErrorCode[] = [
            'INTERNAL_ERROR',
            'TIMEOUT',
            'USER_LIKELY_DOES_NOT_EXIST',
            'NO_TRACKS_FOUND'
        ];

        if (!res.ok || (possibleCode && knownCodes.includes(possibleCode as LastFmErrorCode))) {
            const errorCode = (possibleCode && knownCodes.includes(possibleCode as LastFmErrorCode))
                ? (possibleCode as LastFmErrorCode)
                : (res.status === 404
                    ? 'USER_LIKELY_DOES_NOT_EXIST'
                    : res.status === 504
                        ? 'TIMEOUT'
                        : 'INTERNAL_ERROR');
            return {
                isNowPlaying: false,
                images: {},
                errorCode,
                errorMessage: errorCode,
                httpStatus: res.status,
                raw: json
            };
        }

        // At this point we assume valid track payload
        const track = json.track as {
            ['@attr']?: { nowplaying?: string };
            name: string;
            url: string;
            artist: { ['#text']: string };
            album: { ['#text']: string };
            image?: { ['#text']: string; size: string }[];
            date?: { uts: string };
        };

        if (!track) {
            return {
                isNowPlaying: false,
                images: {},
                errorCode: 'INTERNAL_ERROR',
                errorMessage: 'Missing track data',
                httpStatus: res.status,
                raw: json
            };
        }

        const isNowPlaying =
            track?.['@attr']?.nowplaying === 'true' || track?.['@attr']?.nowplaying === '1';

        const playedAtUnix = !isNowPlaying && track.date?.uts
            ? Number(track.date.uts)
            : undefined;

        const playedAt = playedAtUnix ? new Date(playedAtUnix * 1000) : undefined;

        const images = (track.image ?? []) as { ['#text']: string; size: string }[];

        const imagesBySize: Record<string, string> = images.reduce((acc, img) => {
            if (img['#text']) {
                acc[img.size] = img['#text'];
            }
            return acc;
        }, {} as Record<string, string>);

        const best =
            imagesBySize.extralarge ??
            imagesBySize.large ??
            imagesBySize.medium ??
            imagesBySize.small ??
            images.at(-1)?.['#text'];

        return {
            isNowPlaying,
            trackName: track.name,
            trackUrl: track.url,
            artistName: track.artist['#text'],
            albumName: track.album['#text'],
            images: {
                small: imagesBySize.small,
                medium: imagesBySize.medium,
                large: imagesBySize.large,
                extralarge: imagesBySize.extralarge,
                best
            },
            playedAt,
            playedAtUnix,
            raw: json
        };
    } catch (e) {
        return {
            isNowPlaying: false,
            images: {},
            errorCode: 'INTERNAL_ERROR',
            errorMessage: (e as Error).message || 'Unknown error',
            httpStatus: undefined,
            raw: null
        };
    }
}
