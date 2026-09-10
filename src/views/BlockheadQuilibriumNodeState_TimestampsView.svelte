<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Blockhead Quilibrium node state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadQuilibriumNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumNodeState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				engineState: true,
				latestFrameNumber: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadQuilibriumNodeStateTimestamp })}
		{@const blockheadQuilibriumNodeStateTimestampSelector = blockheadQuilibriumNodeStateTimestamp[EntityMetaKey.Selector]}
		{@const nodeState = blockheadQuilibriumNodeStateTimestampSelector.$nodeState}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumNodeState_Timestamp}
			entitySelector={blockheadQuilibriumNodeStateTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/node-state/(blockheadQuilibriumNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in nodeState.$network ?
								caip2StringFromValue(nodeState.$network.caip2)
							:
								nodeState.$network.slug
						),
						connectionId: nodeState.connectionId,
						timestampMs: String(blockheadQuilibriumNodeStateTimestampSelector.timestampMs),
						source: blockheadQuilibriumNodeStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadQuilibriumNodeStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadQuilibriumNodeStateTimestamp.engineState ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadQuilibriumNodeStateTimestamp.latestFrameNumber ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
