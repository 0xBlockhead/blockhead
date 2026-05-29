<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkStack = useEntity(
		EntityType.NetworkStack,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			label: {},
		},
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
				{stack.label}
			{/snippet}
		</ResourceBoundary>

	{/snippet}
</EntityView>
