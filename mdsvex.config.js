// mdsvex.config.js
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { defineMDSveXConfig as defineConfig } from 'mdsvex';

const config = defineConfig({
    extensions: ['.svx'],

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
