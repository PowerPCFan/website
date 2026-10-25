<script lang="ts">
    import type { Snippet } from "svelte";
    let { children }: { children: Snippet } = $props();
</script>

<div class="markdown-content">
    {@render children()}
</div>

<style lang="scss">
    @reference "../app.css";

    :global(.markdown-content img) {
        @apply w-auto max-w-full;
    }

    :global(.markdown-content h1),
    :global(.markdown-content h2),
    :global(.markdown-content h3),
    :global(.markdown-content h4),
    :global(.markdown-content h5),
    :global(.markdown-content h6) {
        @apply my-4;
    }

    :global(.markdown-content pre[class*="language-"]),
    :global(.markdown-content code[class*="language-"]) {
        @apply font-mono [direction:ltr] text-sm rounded-lg text-shadow-none text-left
            whitespace-pre [word-spacing:normal] [word-break:normal] leading-normal
            [-moz-tab-size:4] [-o-tab-size:4] tab-4 [-webkit-hyphens:none] [-moz-hyphens:none]
            [-ms-hyphens:none] [hyphens:none] text-card-foreground;
    }

    :global(.markdown-content :not(pre) > code) {
        @apply font-mono text-sm text-[#ce9178] bg-card px-1 py-0.5 rounded-sm;
    }

    :global(.markdown-content pre[class*="language-"]::selection),
    :global(.markdown-content code[class*="language-"]::selection),
    :global(.markdown-content pre[class*="language-"] *::selection),
    :global(.markdown-content code[class*="language-"] *::selection) {
        @apply text-shadow-none bg-[#264F78];
    }

    @media print {
        :global(.markdown-content pre[class*="language-"]),
        :global(.markdown-content code[class*="language-"]) {
            @apply text-shadow-none;
        }
    }

    :global(.markdown-content pre[class*="language-"]) {
        padding: 1em;
        margin: .5em 0;
        overflow: auto;
        background: var(--color-card);
    }

    :global(.markdown-content :not(pre) > code[class*="language-"]) {
        padding: .1em .3em;
        border-radius: .3em;
        color: #db4c69;
        background: var(--color-card);
    }
    /*********************************************************
    * Tokens
    */
    :global(.markdown-content .namespace) {
        opacity: .7;
    }

    :global(.markdown-content .token.doctype .token.doctype-tag) {
        color: #569CD6;
    }

    :global(.markdown-content .token.doctype .token.name) {
        color: #9cdcfe;
    }

    :global(.markdown-content .token.comment),
    :global(.markdown-content .token.prolog) {
        color: #6a9955;
    }

    :global(.markdown-content .token.punctuation),
    :global(.markdown-content .language-html .language-css .token.punctuation),
    :global(.markdown-content .language-html .language-javascript .token.punctuation) {
        color: #d4d4d4;
    }

    :global(.markdown-content .token.property),
    :global(.markdown-content .token.tag),
    :global(.markdown-content .token.boolean),
    :global(.markdown-content .token.number),
    :global(.markdown-content .token.constant),
    :global(.markdown-content .token.symbol),
    :global(.markdown-content .token.inserted),
    :global(.markdown-content .token.unit) {
        color: #b5cea8;
    }

    :global(.markdown-content .token.selector),
    :global(.markdown-content .token.attr-name),
    :global(.markdown-content .token.string),
    :global(.markdown-content .token.char),
    :global(.markdown-content .token.builtin),
    :global(.markdown-content .token.deleted) {
        color: #ce9178;
    }

    :global(.markdown-content .language-css .token.string.url) {
        text-decoration: underline;
    }

    :global(.markdown-content .token.operator),
    :global(.markdown-content .token.entity) {
        color: #d4d4d4;
    }

    :global(.markdown-content .token.operator.arrow) {
        color: #569CD6;
    }

    :global(.markdown-content .token.atrule) {
        color: #ce9178;
    }

    :global(.markdown-content .token.atrule .token.rule) {
        color: #c586c0;
    }

    :global(.markdown-content .token.atrule .token.url) {
        color: #9cdcfe;
    }

    :global(.markdown-content .token.atrule .token.url .token.function) {
        color: #dcdcaa;
    }

    :global(.markdown-content .token.atrule .token.url .token.punctuation) {
        color: #d4d4d4;
    }

    :global(.markdown-content .token.keyword) {
        color: #569CD6;
    }

    :global(.markdown-content .token.keyword.module),
    :global(.markdown-content .token.keyword.control-flow) {
        color: #c586c0;
    }

    :global(.markdown-content .token.function),
    :global(.markdown-content .token.function .token.maybe-class-name) {
        color: #dcdcaa;
    }

    :global(.markdown-content .token.regex) {
        color: #d16969;
    }

    :global(.markdown-content .token.important) {
        color: #569cd6;
    }

    :global(.markdown-content .token.italic) {
        font-style: italic;
    }

    :global(.markdown-content .token.constant) {
        color: #9cdcfe;
    }

    :global(.markdown-content .token.class-name),
    :global(.markdown-content .token.maybe-class-name) {
        color: #4ec9b0;
    }

    :global(.markdown-content .token.console) {
        color: #9cdcfe;
    }

    :global(.markdown-content .token.parameter) {
        color: #9cdcfe;
    }

    :global(.markdown-content .token.interpolation) {
        color: #9cdcfe;
    }

    :global(.markdown-content .token.punctuation.interpolation-punctuation) {
        color: #569cd6;
    }

    :global(.markdown-content .token.boolean) {
        color: #569cd6;
    }

    :global(.markdown-content .token.property),
    :global(.markdown-content .token.variable),
    :global(.markdown-content .token.imports .token.maybe-class-name),
    :global(.markdown-content .token.exports .token.maybe-class-name) {
        color: #9cdcfe;
    }

    :global(.markdown-content .token.selector) {
        color: #d7ba7d;
    }

    :global(.markdown-content .token.escape) {
        color: #d7ba7d;
    }

    :global(.markdown-content .token.tag) {
        color: #569cd6;
    }

    :global(.markdown-content .token.tag .token.punctuation) {
        color: #808080;
    }

    :global(.markdown-content .token.cdata) {
        color: #808080;
    }

    :global(.markdown-content .token.attr-name) {
        color: #9cdcfe;
    }

    :global(.markdown-content .token.attr-value),
    :global(.markdown-content .token.attr-value .token.punctuation) {
        color: #ce9178;
    }

    :global(.markdown-content .token.attr-value .token.punctuation.attr-equals) {
        color: #d4d4d4;
    }

    :global(.markdown-content .token.entity) {
        color: #569cd6;
    }

    :global(.markdown-content .token.namespace) {
        color: #4ec9b0;
    }
    /*********************************************************
    * Language Specific
    */

    :global(.markdown-content pre[class*="language-javascript"]),
    :global(.markdown-content code[class*="language-javascript"]),
    :global(.markdown-content pre[class*="language-jsx"]),
    :global(.markdown-content code[class*="language-jsx"]),
    :global(.markdown-content pre[class*="language-typescript"]),
    :global(.markdown-content code[class*="language-typescript"]),
    :global(.markdown-content pre[class*="language-tsx"]),
    :global(.markdown-content code[class*="language-tsx"]) {
        color: #9cdcfe;
    }

    :global(.markdown-content pre[class*="language-css"]),
    :global(.markdown-content code[class*="language-css"]) {
        color: #ce9178;
    }

    :global(.markdown-content pre[class*="language-html"]),
    :global(.markdown-content code[class*="language-html"]) {
        color: #d4d4d4;
    }

    :global(.markdown-content .language-regex .token.anchor) {
        color: #dcdcaa;
    }

    :global(.markdown-content .language-html .token.punctuation) {
        color: #808080;
    }
    /*********************************************************
    * Line highlighting
    */
    :global(.markdown-content pre[class*="language-"] > code[class*="language-"]) {
        position: relative;
        z-index: 1;
    }

    :global(.markdown-content .line-highlight.line-highlight) {
        background: #f7ebc6;
        box-shadow: inset 5px 0 0 #f7d87c;
        z-index: 0;
    }
</style>
