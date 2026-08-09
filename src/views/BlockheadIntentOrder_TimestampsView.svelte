<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadIntentOrder_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadIntentOrder_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					status: true,
					timestampMs: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadIntentOrderTimestamp })}
		{@const blockheadIntentOrderTimestampSelector = blockheadIntentOrderTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadIntentOrder_Timestamp}
			entitySelector={blockheadIntentOrderTimestampSelector}
			href={
				resolve(
					'/~/intent/order/[id=stringSegment]/(blockheadIntentOrder)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						id: blockheadIntentOrderTimestampSelector.$order.id,
						timestampMs: String(blockheadIntentOrderTimestampSelector.timestampMs),
						source: blockheadIntentOrderTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadIntentOrderTimestamp.status || 'blockhead intent order timestamp'}
			{/snippet}

			{#snippet Value()}
				{blockheadIntentOrderTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadIntentOrderTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
