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
	}: EntityListViewProps<EntityType.IbcPacket> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IbcPacket}
	bind:open
	resource={
		selection({
			...{
				fields: {
					sequence: true,
					direction: true,
					status: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: ibcPacket })}
		{@const ibcPacketSelector = ibcPacket[EntityMetaKey.Selector]}
		{@const channel = ibcPacketSelector.$channel}
		<EntityView
			entityType={EntityType.IbcPacket}
			entitySelector={ibcPacketSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-channels/[portId=stringSegment]/[channelId=stringSegment]/(ibcChannel)/packet/[sequence=nonNegativeBigInt]/[direction=stringSegment]',
					{
						network: (
							'caip2' in channel.$network ?
								caip2StringFromValue(channel.$network.caip2)
							:
								channel.$network.slug
						),
						portId: channel.portId,
						channelId: channel.channelId,
						sequence: String(ibcPacketSelector.sequence),
						direction: ibcPacketSelector.direction,
					}
				)
			}
		>
			{#snippet Title()}
				{`Packet #${ibcPacketSelector.sequence}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[ibcPacketSelector.direction, (ibcPacket.status ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
