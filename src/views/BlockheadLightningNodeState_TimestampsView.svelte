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
	}: EntityListViewProps<EntityType.BlockheadLightningNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningNodeState_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				syncedToChain: true,
				syncedToGraph: true,
				blockHeight: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningNodeStateTimestamp })}
		{@const blockheadLightningNodeStateTimestampSelector = blockheadLightningNodeStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLightningNodeState_Timestamp}
			entitySelector={blockheadLightningNodeStateTimestampSelector}
		>
			{#snippet Title()}
				{String(blockheadLightningNodeStateTimestampSelector.timestampMs) || 'blockhead Lightning node state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String(blockheadLightningNodeStateTimestamp.syncedToChain ?? ''), String(blockheadLightningNodeStateTimestamp.syncedToGraph ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadLightningNodeStateTimestamp.blockHeight ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
