<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadLightningNodeState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningNodeState}
	bind:open
	resource={
		selection({
			fields: {
				alias: true,
				$network: true,
				connectionId: true,
				$node: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningNodeState })}
		{@const blockheadLightningNodeStateSelector = blockheadLightningNodeState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLightningNodeState}
			entitySelector={blockheadLightningNodeStateSelector}
		>
			{#snippet Title()}
				{(blockheadLightningNodeState.alias ?? '') || blockheadLightningNodeStateSelector.connectionId || 'blockhead Lightning node state'}
			{/snippet}

			{#snippet Value()}
				{(blockheadLightningNodeState.$network.name ?? '') || (blockheadLightningNodeState.$network.$network.name || (blockheadLightningNodeStateSelector.$network.$network.caip2 == null ? '' : `${blockheadLightningNodeStateSelector.$network.$network.caip2.namespace}:${blockheadLightningNodeStateSelector.$network.$network.caip2.reference}`) || 'Network')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLightningNodeState.$node == null ? '' : blockheadLightningNodeState.$node.publicKey || 'Lightning node'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
