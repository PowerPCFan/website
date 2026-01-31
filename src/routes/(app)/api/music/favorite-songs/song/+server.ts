import type { RequestHandler } from '@sveltejs/kit';
import favoriteSongs from '$lib/data/favorite-songs.json';

export const GET: RequestHandler = async ({ url }) => {
    const id = url.searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ message: 'Song ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const song = favoriteSongs.songs.find((s) => s.id === id);

    if (!song) {
        return new Response(JSON.stringify({ message: 'Song not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({ song }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};