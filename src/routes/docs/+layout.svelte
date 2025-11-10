<script lang="ts">
    let { children } = $props();
</script>

<div id="page-container">
    {@render children()}
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as gv;

    #page-container {
        /* width: 100%; */
        padding: 0.75rem 2rem;
        margin: 0;
    }

    :global(.indented) {
        margin-left: 2rem;
        margin-bottom: 2rem;
    }

    :global(img) {
        width: auto;
        max-width: 100%;
    }

:global(pre[class*="language-"]),
:global(code[class*="language-"]) {
    color: #d4d4d4;
    font-size: 14px;
    border-radius: 8px;
    text-shadow: none;
    font-family: "JetBrains Mono", monospace, monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    line-height: 1.5;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
}

:global(:not(pre) code) {
    font-family: "JetBrains Mono", monospace, monospace;
    font-size: 0.9em;
    color: #ce9178;
}

:global(pre[class*="language-"]::selection),
:global(code[class*="language-"]::selection),
:global(pre[class*="language-"] *::selection),
:global(code[class*="language-"] *::selection) {
    text-shadow: none;
    background: #264F78;
}

@media print {
    :global(pre[class*="language-"]),
    :global(code[class*="language-"]) {
        text-shadow: none;
    }
}

:global(pre[class*="language-"]) {
    padding: 1em;
    margin: .5em 0;
    overflow: auto;
    background: #1e1e1e;
}

:global(:not(pre) > code[class*="language-"]) {
    padding: .1em .3em;
    border-radius: .3em;
    color: #db4c69;
    background: #1e1e1e;
}
/*********************************************************
* Tokens
*/
:global(.namespace) {
    opacity: .7;
}

:global(.token.doctype .token.doctype-tag) {
    color: #569CD6;
}

:global(.token.doctype .token.name) {
    color: #9cdcfe;
}

:global(.token.comment),
:global(.token.prolog) {
    color: #6a9955;
}

:global(.token.punctuation),
:global(.language-html .language-css .token.punctuation),
:global(.language-html .language-javascript .token.punctuation) {
    color: #d4d4d4;
}

:global(.token.property),
:global(.token.tag),
:global(.token.boolean),
:global(.token.number),
:global(.token.constant),
:global(.token.symbol),
:global(.token.inserted),
:global(.token.unit) {
    color: #b5cea8;
}

:global(.token.selector),
:global(.token.attr-name),
:global(.token.string),
:global(.token.char),
:global(.token.builtin),
:global(.token.deleted) {
    color: #ce9178;
}

:global(.language-css .token.string.url) {
    text-decoration: underline;
}

:global(.token.operator),
:global(.token.entity) {
    color: #d4d4d4;
}

:global(.token.operator.arrow) {
    color: #569CD6;
}

:global(.token.atrule) {
    color: #ce9178;
}

:global(.token.atrule .token.rule) {
    color: #c586c0;
}

:global(.token.atrule .token.url) {
    color: #9cdcfe;
}

:global(.token.atrule .token.url .token.function) {
    color: #dcdcaa;
}

:global(.token.atrule .token.url .token.punctuation) {
    color: #d4d4d4;
}

:global(.token.keyword) {
    color: #569CD6;
}

:global(.token.keyword.module),
:global(.token.keyword.control-flow) {
    color: #c586c0;
}

:global(.token.function),
:global(.token.function .token.maybe-class-name) {
    color: #dcdcaa;
}

:global(.token.regex) {
    color: #d16969;
}

:global(.token.important) {
    color: #569cd6;
}

:global(.token.italic) {
    font-style: italic;
}

:global(.token.constant) {
    color: #9cdcfe;
}

:global(.token.class-name),
:global(.token.maybe-class-name) {
    color: #4ec9b0;
}

:global(.token.console) {
    color: #9cdcfe;
}

:global(.token.parameter) {
    color: #9cdcfe;
}

:global(.token.interpolation) {
    color: #9cdcfe;
}

:global(.token.punctuation.interpolation-punctuation) {
    color: #569cd6;
}

:global(.token.boolean) {
    color: #569cd6;
}

:global(.token.property),
:global(.token.variable),
:global(.token.imports .token.maybe-class-name),
:global(.token.exports .token.maybe-class-name) {
    color: #9cdcfe;
}

:global(.token.selector) {
    color: #d7ba7d;
}

:global(.token.escape) {
    color: #d7ba7d;
}

:global(.token.tag) {
    color: #569cd6;
}

:global(.token.tag .token.punctuation) {
    color: #808080;
}

:global(.token.cdata) {
    color: #808080;
}

:global(.token.attr-name) {
    color: #9cdcfe;
}

:global(.token.attr-value),
:global(.token.attr-value .token.punctuation) {
    color: #ce9178;
}

:global(.token.attr-value .token.punctuation.attr-equals) {
    color: #d4d4d4;
}

:global(.token.entity) {
    color: #569cd6;
}

:global(.token.namespace) {
    color: #4ec9b0;
}
/*********************************************************
* Language Specific
*/

:global(pre[class*="language-javascript"]),
:global(code[class*="language-javascript"]),
:global(pre[class*="language-jsx"]),
:global(code[class*="language-jsx"]),
:global(pre[class*="language-typescript"]),
:global(code[class*="language-typescript"]),
:global(pre[class*="language-tsx"]),
:global(code[class*="language-tsx"]) {
    color: #9cdcfe;
}

:global(pre[class*="language-css"]),
:global(code[class*="language-css"]) {
    color: #ce9178;
}

:global(pre[class*="language-html"]),
:global(code[class*="language-html"]) {
    color: #d4d4d4;
}

:global(.language-regex .token.anchor) {
    color: #dcdcaa;
}

:global(.language-html .token.punctuation) {
    color: #808080;
}
/*********************************************************
* Line highlighting
*/
:global(pre[class*="language-"] > code[class*="language-"]) {
    position: relative;
    z-index: 1;
}

:global(.line-highlight.line-highlight) {
    background: #f7ebc6;
    box-shadow: inset 5px 0 0 #f7d87c;
    z-index: 0;
}

</style>
