export type Songs = Song[];

export interface NameURLCombo {
    name: string;
    url: string;
}

export interface NameURLComboWithYear extends NameURLCombo {
    year: number;
}

export interface SongMetadata {
    url: string;
    title: string;
    artist: NameURLCombo;
    album: NameURLComboWithYear;
}

export interface Images {
    thumbnail: string;
    full: string;
}

export interface SongReview {
    rating: number;  // out of 10
    content: string;
}

export interface Lyrics {
    content: string;
    translatedContent?: string;
    originalLanguage?: string;
    translatedLanguage?: string;
    sourceUrl: string;
    sourceName: string;
    writtenBy: string;
}

export interface Song {
    id: string;
    metadata: SongMetadata;
    images: Images;
    review?: SongReview;
    lyrics: Lyrics;
}
