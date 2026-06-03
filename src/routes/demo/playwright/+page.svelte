<script lang="ts">
	// Types/constants
	import type { QueryLike } from '$/lib/db/queryResource.svelte.ts'


	let cachedBoundaryOpen = $state(
		true
	)

	const cachedQuery = {
		data: 'Cached value',
		isLoading: false,
		isError: false,
		isReady: true,
	} satisfies QueryLike<string>


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<h1>Playwright e2e test demo</h1>

<Collapsible
	bind:open={cachedBoundaryOpen}
>
	{#snippet Summary()}
		<span>Cached boundary</span>
	{/snippet}

	{#snippet children()}
		<ResourceBoundary
			resource={cachedQuery}
			placeholderText="Loading cached value"
		>
			{#snippet children(value)}
				<p>{value}</p>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</Collapsible>
