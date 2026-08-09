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
		title = 'Blockhead Lightning HTLCs',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadLightningHtlc> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningHtlc}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					htlcIndex: true,
					$channel: true,
					direction: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningHtlc })}
		{@const blockheadLightningHtlcSelector = blockheadLightningHtlc[EntityMetaKey.Selector]}
		{@const channelState = blockheadLightningHtlcSelector.$channelState}
		<EntityView
			entityType={EntityType.BlockheadLightningHtlc}
			entitySelector={blockheadLightningHtlcSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/channel/[channelId=stringSegment]/(blockheadLightningChannelState)/htlc/[htlcIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in channelState.$localNodeState.$network.$network ?
								caip2StringFromValue(channelState.$localNodeState.$network.$network.caip2)
							:
								channelState.$localNodeState.$network.$network.slug
						),
						connectionId: channelState.$localNodeState.connectionId,
						channelId: channelState.$channel.channelId,
						htlcIndex: String(blockheadLightningHtlcSelector.htlcIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{'HTLC ' + blockheadLightningHtlcSelector.htlcIndex}
			{/snippet}

			{#snippet Value()}
				{(blockheadLightningHtlc.$channel.shortChannelId ?? '') || blockheadLightningHtlc.$channel.channelId || 'Lightning channel'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLightningHtlc.direction ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
