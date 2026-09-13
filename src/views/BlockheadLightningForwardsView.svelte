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
	}: EntityListViewProps<EntityType.BlockheadLightningForward> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningForward}
	bind:open
	resource={
		selection({
			fields: {
				$incomingChannel: true,
				incomingHtlcId: true,
				$outgoingChannel: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningForward })}
		{@const blockheadLightningForwardSelector = blockheadLightningForward[EntityMetaKey.Selector]}
		{@const localNodeState = blockheadLightningForwardSelector.$localNodeState}
		<EntityView
			entityType={EntityType.BlockheadLightningForward}
			entitySelector={blockheadLightningForwardSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/forward/[incomingChannelId=stringSegment]/[incomingHtlcId=nonNegativeBigInt]',
					{
						network: (
							localNodeState.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(localNodeState.$network.$network.caip2)
							:
								localNodeState.$network.$network.slug
						),
						connectionId: localNodeState.connectionId,
						incomingChannelId: blockheadLightningForwardSelector.$incomingChannel.channelId,
						incomingHtlcId: String(blockheadLightningForwardSelector.incomingHtlcId),
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadLightningForward.$incomingChannel.shortChannelId ?? '') || blockheadLightningForwardSelector.$incomingChannel.channelId || 'Lightning channel'}
			{/snippet}

			{#snippet Value()}
				{blockheadLightningForwardSelector.incomingHtlcId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(blockheadLightningForward.$outgoingChannel.shortChannelId ?? '') || blockheadLightningForward.$outgoingChannel.channelId || 'Lightning channel'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
