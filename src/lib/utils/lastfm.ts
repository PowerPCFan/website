export interface LatestSongVars {
    isNowPlaying: boolean;
    trackName: string;
    trackUrl: string;
    artistName: string;
    albumName: string;
    images: {
        small?: string;
        medium?: string;
        large?: string;
        extralarge?: string;
        best?: string;
    };
    playedAt?: Date;
    playedAtUnix?: number;
    raw: unknown;
}

export async function getLatestSongVars(username: string): Promise<LatestSongVars> {
    const res = await fetch(
        `https://lastfm-last-played.biancarosa.com.br/${encodeURIComponent(username)}/latest-song`
    );
    const json = await res.json();

    const track = json.track as {
        ['@attr']?: { nowplaying?: string };
        name: string;
        url: string;
        artist: { ['#text']: string };
        album: { ['#text']: string };
        image?: { ['#text']: string; size: string }[];
        date?: { uts: string };
    };

    const isNowPlaying =
        track?.['@attr']?.nowplaying === 'true' || track?.['@attr']?.nowplaying === '1';

    const playedAtUnix = !isNowPlaying && track.date?.uts
        ? Number(track.date.uts)
        : undefined;

    const playedAt = playedAtUnix ? new Date(playedAtUnix * 1000) : undefined;

    const images = (track.image ?? []) as { ['#text']: string; size: string }[];

    // Note: no generic on reduce; instead, we cast the initial value.
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
}
