<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.NetworkStack>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const networkStack = useEntity(entityCollectionsContext, EntityType.NetworkStack,
		entityId,
		({ sources: [
				Source.Constants_Internal,
			], fields: { label: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.NetworkStack}
	{entityId}
	bind:open
	{layout}
>

	{#snippet Title()}
		<ResourceBoundary
			resource={networkStack}
		>
			{#snippet children(stack)}
				{stack.fields.label}
			{/snippet}
		</ResourceBoundary>

	{/snippet}
</EntityView>
