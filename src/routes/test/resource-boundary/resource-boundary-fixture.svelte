<script lang="ts">
	// Types/constants
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'

	// State
	let {
		resource,
	}: {
		resource: SvelteKitResource<string>
	} = $props()

	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<ResourceBoundary {resource}>
	{#snippet children(value)}
		<p>{value}</p>
	{/snippet}
</ResourceBoundary>
