<script lang="ts">
	// Types/constants
	import { onDestroy } from 'svelte'
	import type { TanStackLiveQueryResource } from '$/lib/db/queryResource.svelte.ts'

	// State
	let {
		resource,
	}: {
		resource: TanStackLiveQueryResource<string>
	} = $props()

	onDestroy(() => resource.destroy())

	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<output data-testid="native-direct">{resource.current}</output>

<svelte:boundary>
	<output data-testid="native-awaited">{await resource}</output>

	{#snippet pending()}<p>Pending native resource</p>{/snippet}
</svelte:boundary>

<ResourceBoundary {resource}>
	{#snippet children(value)}
		<output data-testid="native-boundary">{value}</output>
	{/snippet}
</ResourceBoundary>
