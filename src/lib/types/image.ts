export interface GalleryImage {
    id: string;
    metadata: {
        title: string,
        device: string,
        date: string,
        location: string
    };

    // added by /api/gallery/view-image endpoint
    fullImageUrl?: string;
    thumbnailUrl?: string;
}
