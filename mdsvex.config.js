// mdsvex.config.js
import rehypeExternalLinks from 'rehype-external-links';
import { defineMDSveXConfig as defineConfig } from 'mdsvex';

const config = defineConfig({
    extensions: ['.svx'],

    rehypePlugins: [
        [rehypeExternalLinks, {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
        }],
    ],
});

export default config;
