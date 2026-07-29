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
	}: EntityListViewProps<EntityType.BlockheadLightningChannelState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningChannelState_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				active: true,
				localBalanceSats: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningChannelStateTimestamp })}
		{@const blockheadLightningChannelStateTimestampSelector = blockheadLightningChannelStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLightningChannelState_Timestamp}
			entitySelector={blockheadLightningChannelStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadLightningChannelStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadLightningChannelStateTimestamp.active ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLightningChannelStateTimestamp.localBalanceSats ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
