import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import galleryData from '$lib/data/gallery.json';
import type { GalleryImage } from '$lib/types/image';

export const GET: RequestHandler = async ({ url }) => {
    const imageId = url.searchParams.get('id');

    if (!imageId) {
        return json({ error: 'Image ID is required' }, { status: 400 });
    }

    const image: GalleryImage | undefined = galleryData.images.find(img => img.id === imageId);

    if (!image) {
        return json({ error: 'Image not found' }, { status: 404 });
    }

    return json({
        image: {
            ...image,
            fullImageUrl: `/images/gallery/${image.id}.jpg`,
            thumbnailUrl: `/images/gallery/${image.id}-thumbnail.webp`
        }
    });
};
