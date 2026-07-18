<script lang="ts">
	// State
	let {
		content = null,
		mode = 'markdown',
	}: {
		content?: string | null
		mode?: 'markdown' | 'syndication'
	} = $props()

	import { syndicationHtmlToSafeHtml } from '$/lib/html.ts'
	import { markdownToHtml } from '$/lib/markdown.ts'
</script>


<div
	class="markdown"
	data-column="gap-4"
>
	{@html mode === 'syndication' ? syndicationHtmlToSafeHtml(content) : markdownToHtml(content)}
</div>


<style>
	.markdown {
		:global(pre) {
			white-space: pre-wrap;
			word-break: break-word;
		}

		:global(code) {
			font-size: 0.9em;
		}

		:global(blockquote) {
			margin: 0;
			padding-inline-start: 1em;
			border-inline-start: 3px solid var(--color-border);
		}

		:global(table) {
			border-collapse: collapse;
			width: 100%;
		}

		:global(th),
		:global(td) {
			padding: 0.25em 0.5em;
			border: 1px solid var(--color-border);
			text-align: start;
		}

		:global(img) {
			max-width: 100%;
			height: auto;
		}
	}
</style>
