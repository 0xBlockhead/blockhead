<script lang="ts" generics="
	Value
">
	// Types/constants
	import type { Snippet } from 'svelte'

	import type { EntityFieldAddress, ProjectionValue } from '$/schema/$schema.ts'


	// State
	let {
		resource,
		Applicable,
		NotApplicable,
		Blocked,
		Unsupported,
	}: {
		resource: import('$/lib/db/queryResource.svelte.ts').SvelteKitResource<ProjectionValue<Value>>
		Applicable: Snippet<[value: Value]>
		NotApplicable?: Snippet
		Blocked?: Snippet<[dependencies: readonly EntityFieldAddress[]]>
		Unsupported?: Snippet
	} = $props()


	// Components
	import Projection from '$/components/Projection.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<ResourceBoundary
	{resource}
>
	{#snippet children(projection)}
		<Projection
			{projection}
			{Applicable}
			{NotApplicable}
			{Blocked}
			{Unsupported}
		/>
	{/snippet}
</ResourceBoundary>
