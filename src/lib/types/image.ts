export interface GalleryImage {
    id: string;
    metadata: {
        title: string,
        device: string,
        date: string,
        location: string
    };

    // added by /api/photography-gallery/view-image endpoint
    fullImageUrl?: string;
    thumbnailUrl?: string;
}
