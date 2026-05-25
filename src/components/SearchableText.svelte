<script lang="ts">
	// Types/constants
	import { SvelteSet } from 'svelte/reactivity'
	import { untrack } from 'svelte'


	// Props
	let {
		text,
		query,
		matches,
	}: {
		text: string
		query: string
		matches?: SvelteSet<Match>
	} = $props()


	// Functions
	const escapeHtml = (s: string) => (
		s
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
	)

	const highlightRanges = (escaped: string, ranges: Match[]) => {
		if (ranges.length === 0) return escaped
		const parts: string[] = []
		let last = 0
		for (const { start, end } of ranges) {
			if (start > last) parts.push(escaped.slice(last, start))
			parts.push('<mark>', escaped.slice(start, end), '</mark>')
			last = end
		}
		if (last < escaped.length) parts.push(escaped.slice(last))
		return parts.join('')
	}


	// State
	import { type Match, fuzzyMatch } from '$/lib/string.ts'

	let previousRanges: Match[] = []

	$effect(() => {
		if (!matches) return
		const ranges = fuzzyMatch(text, query)

		untrack(() => {
			for (const m of previousRanges)
				matches.delete(m)

			previousRanges = ranges

			for (const m of ranges)
				matches.add(m)
		})
	})
</script>


<span>{@html highlightRanges(escapeHtml(text), fuzzyMatch(text, query))}</span>


<style>
	span {
		:global(mark) {
			font-weight: 600;
			text-decoration: underline;
			background-color: transparent;
			color: inherit;
		}
	}
</style>
