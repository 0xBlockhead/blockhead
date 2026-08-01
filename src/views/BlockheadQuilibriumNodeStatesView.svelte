<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Quilibrium node states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadQuilibriumNodeState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumNodeState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				connectionId: true,
				$network: true,
				endpoint: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadQuilibriumNodeState })}
		{@const blockheadQuilibriumNodeStateSelector = blockheadQuilibriumNodeState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumNodeState}
			entitySelector={blockheadQuilibriumNodeStateSelector}
		>
			{#snippet Title()}
				{blockheadQuilibriumNodeStateSelector.connectionId || 'blockhead quilibrium node state'}
			{/snippet}

			{#snippet Value()}
				{blockheadQuilibriumNodeState.$network.name || (blockheadQuilibriumNodeStateSelector.$network.caip2 == null ? '' : `${blockheadQuilibriumNodeStateSelector.$network.caip2.namespace}:${blockheadQuilibriumNodeStateSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadQuilibriumNodeState.endpoint ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
