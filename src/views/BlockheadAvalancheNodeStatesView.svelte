<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Avalanche node states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadAvalancheNodeState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAvalancheNodeState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				nodeId: true,
				$network: true,
				nodeIp: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAvalancheNodeState })}
		{@const blockheadAvalancheNodeStateSelector = blockheadAvalancheNodeState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAvalancheNodeState}
			entitySelector={blockheadAvalancheNodeStateSelector}
		>
			{#snippet Title()}
				{blockheadAvalancheNodeStateSelector.nodeId || 'blockhead avalanche node state'}
			{/snippet}

			{#snippet Value()}
				{blockheadAvalancheNodeState.$network == null ? '' : blockheadAvalancheNodeState.$network.name || (blockheadAvalancheNodeState.$network.caip2 == null ? '' : `${blockheadAvalancheNodeState.$network.caip2.namespace}:${blockheadAvalancheNodeState.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadAvalancheNodeState.nodeIp ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
