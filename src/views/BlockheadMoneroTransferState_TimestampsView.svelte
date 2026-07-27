<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Monero transfer state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadMoneroTransferState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroTransferState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				spent: true,
				confirmations: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadMoneroTransferStateTimestamp })}
		{@const blockheadMoneroTransferStateTimestampSelector = blockheadMoneroTransferStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadMoneroTransferState_Timestamp}
			entitySelector={blockheadMoneroTransferStateTimestampSelector}
		>
			{#snippet Title()}
				{String(blockheadMoneroTransferStateTimestampSelector.timestampMs) || 'blockhead monero transfer state timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadMoneroTransferStateTimestamp.spent ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadMoneroTransferStateTimestamp.confirmations ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
