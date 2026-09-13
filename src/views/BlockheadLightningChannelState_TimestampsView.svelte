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
		{@const channelState = blockheadLightningChannelStateTimestampSelector.$channelState}
		<EntityView
			entityType={EntityType.BlockheadLightningChannelState_Timestamp}
			entitySelector={blockheadLightningChannelStateTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/channel/[channelId=stringSegment]/(blockheadLightningChannelState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							channelState.$localNodeState.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(channelState.$localNodeState.$network.$network.caip2)
							:
								channelState.$localNodeState.$network.$network.slug
						),
						connectionId: channelState.$localNodeState.connectionId,
						channelId: channelState.$channel.channelId,
						timestampMs: String(blockheadLightningChannelStateTimestampSelector.timestampMs),
						source: blockheadLightningChannelStateTimestampSelector.source,
					}
				)
			}
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
