<script lang="ts" generics="Value">
	// State
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { ProjectionValue } from '$/schema/$schema.ts'

	let {
		resource,
	}: {
		resource: SvelteKitResource<ProjectionValue<Value>>
	} = $props()

	// Functions
	import { errorDisplayMessage } from '$/lib/errors.ts'

	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Projection from '$/components/Projection.svelte'
</script>


<ResourceBoundary {resource}>
	{#snippet children(projection)}
		<Projection {projection}>
			{#snippet Applicable()}
				<p>Applicable reference</p>
			{/snippet}
		</Projection>
	{/snippet}

	{#snippet Failed(
		error,
		retry,
	)}
		<p role="alert">{errorDisplayMessage(error)}</p>

		<button onclick={retry}>Retry</button>
	{/snippet}
</ResourceBoundary>
