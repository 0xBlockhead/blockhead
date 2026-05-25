<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'


	// Props
	let {
		summary,
		title = '',
		showLoadedCount = true,
		showTotalCount = true,
		Title,
	}: {
		summary: { loaded: number; total?: number }
		title?: string
		showLoadedCount?: boolean
		showTotalCount?: boolean
		Title?: Snippet<[context?: {
			title?: string
			showLoadedCount?: boolean
			showTotalCount?: boolean
		}]>
	} = $props()


	// Components
	import Heading from '$/components/Heading.svelte'
</script>


{#if Title}
	{@render Title({
		title,
		showLoadedCount,
		showTotalCount,
	})}
{:else}
	{@const _showLoadedCount = showLoadedCount && summary.loaded !== undefined}

	{@const _showTotalCount = showTotalCount && summary.total !== undefined}

	<div data-row="start inline">
		<Heading>
			{title}
		</Heading>

		{#if _showLoadedCount || _showTotalCount}
			<span>
				<span>(</span>
				{#if _showLoadedCount}
					<span>{summary.loaded}</span>
				{/if}

				{#if _showLoadedCount && _showTotalCount}
					/
				{/if}

				{#if _showTotalCount}
					<span>{summary.total}</span>
				{/if}
				<span>)</span>
			</span>
		{/if}
	</div>
{/if}
