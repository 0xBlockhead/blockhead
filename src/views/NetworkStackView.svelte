<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selector: EntitySelector<typeof schema, EntityType.NetworkStack>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.NetworkStack}
	entitySelector={selector}
	bind:open
	{layout}
>

	{#snippet Title()}
		<ResourceBoundary
			resource={proxy(EntityType.NetworkStack, selector, ({ sources: [
				Source.Constants_Internal,
			], fields: { label: true } }))}
		>
			{#snippet children(stack)}
				{stack.fields.label}
			{/snippet}
		</ResourceBoundary>

	{/snippet}
</EntityView>
