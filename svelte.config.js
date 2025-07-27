// import adapter from '@sveltejs/adapter-auto';
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
//     // Consult https://svelte.dev/docs/kit/integrations
//     // for more information about preprocessors
//     preprocess: vitePreprocess(),

//     kit: {
//         adapter: adapter()
//     }
// };

// export default config;

import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.svx'],
    preprocess: [
        vitePreprocess(),
        mdsvex({
            extensions: ['.svx'],
        }),
    ],

    kit: {
        adapter: adapter()
    },
};

export default config;
