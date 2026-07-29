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
	}: EntityListViewProps<EntityType.BlockheadLogosBlockchainNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLogosBlockchainNodeState_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				peerCount: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLogosBlockchainNodeStateTimestamp })}
		{@const blockheadLogosBlockchainNodeStateTimestampSelector = blockheadLogosBlockchainNodeStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLogosBlockchainNodeState_Timestamp}
			entitySelector={blockheadLogosBlockchainNodeStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadLogosBlockchainNodeStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadLogosBlockchainNodeStateTimestamp.peerCount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLogosBlockchainNodeStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
