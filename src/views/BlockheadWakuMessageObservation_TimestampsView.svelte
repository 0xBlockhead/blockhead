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
		title = 'Blockhead Waku message observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadWakuMessageObservation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				messageHash: true,
				timestampMs: true,
				contentTopic: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadWakuMessageObservationTimestamp })}
		{@const blockheadWakuMessageObservationTimestampSelector = blockheadWakuMessageObservationTimestamp[EntityMetaKey.Selector]}
		{@const nodeState = blockheadWakuMessageObservationTimestampSelector.$nodeState}
		<EntityView
			entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
			entitySelector={blockheadWakuMessageObservationTimestampSelector}
			href={
				resolve(
					'/~/waku/connection/[connectionId=stringSegment]/node-state/[nodeId=stringSegment]/(blockheadWakuNodeState)/message/[messageHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						connectionId: nodeState.connectionId,
						nodeId: nodeState.nodeId,
						messageHash: blockheadWakuMessageObservationTimestampSelector.messageHash,
						timestampMs: String(blockheadWakuMessageObservationTimestampSelector.timestampMs),
						source: blockheadWakuMessageObservationTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadWakuMessageObservationTimestampSelector.messageHash || 'blockhead waku message observation timestamp'}
			{/snippet}

			{#snippet Value()}
				{blockheadWakuMessageObservationTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadWakuMessageObservationTimestamp.contentTopic ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
