// mdsvex.config.js
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const layoutPath = join(
    __dirname,
    'src',
    'lib',
    'MdsvexLayout.svelte'
);

const config = defineConfig({
    extensions: ['.svx'],
    layout: layoutPath,

    rehypePlugins: [
        [rehypeExternalLinks, {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
        }],
        [rehypeSlug, {}],
        [rehypeAutolinkHeadings, {
            behavior: 'append',
            properties: {
                class: "rehype-autolink-headings-link",
                ariaHidden: true,
                tabIndex: -1,
            },
            content: () => [{
                type: "element",
                tagName: "span",
                properties: { className: ["fa-solid", "fa-hashtag"] },
                children: [],
            }],
        }],
    ],
});

export default config;
