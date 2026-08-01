<script lang="ts">
	// Types/constants
	import { fuzzyMatch } from '$/lib/string.ts'


	// State
	let {
		text,
		query,
	}: {
		text: string
		query: string
	} = $props()

	const ranges = $derived(
		fuzzyMatch(text, query)
	)
</script>


<span>{#each ranges as range, index (range.start)}{text.slice(index === 0 ? 0 : ranges[index - 1].end, range.start)}<mark>{text.slice(range.start, range.end)}</mark>{/each}{text.slice(ranges.at(-1)?.end ?? 0)}</span>


<style>
	span {
		mark {
			font-weight: 600;
			text-decoration: underline;
			background-color: transparent;
			color: inherit;
		}
	}
</style>
