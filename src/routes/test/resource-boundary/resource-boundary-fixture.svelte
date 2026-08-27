<script lang="ts">
	// Types/constants
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'

	// State
	let {
		resource,
		direct = false,
	}: {
		resource: SvelteKitResource<string>
		direct?: boolean
	} = $props()

	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


{#if direct}
	<output aria-label="current">{resource.current}</output>

	<output aria-label="loading">{String(resource.loading)}</output>

	<output aria-label="ready">{String(resource.ready)}</output>

	<output aria-label="error">{String(resource.error ?? '')}</output>
{:else}
	<ResourceBoundary {resource}>
		{#snippet children(value)}
			<p>{value}</p>
		{/snippet}
	</ResourceBoundary>
{/if}
