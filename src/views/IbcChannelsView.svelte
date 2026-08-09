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
	}: EntityListViewProps<EntityType.IbcChannel> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IbcChannel}
	bind:open
	resource={
		selection({
			...{
				fields: {
					channelId: true,
					state: true,
					portId: true,
					counterpartyChainId: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: ibcChannel })}
		{@const ibcChannelSelector = ibcChannel[EntityMetaKey.Selector]}
		{@const network = ibcChannelSelector.$network}
		<EntityView
			entityType={EntityType.IbcChannel}
			entitySelector={ibcChannelSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-channels/[portId=stringSegment]/[channelId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						portId: ibcChannelSelector.portId,
						channelId: ibcChannelSelector.channelId,
					}
				)
			}
		>
			{#snippet Title()}
				{ibcChannelSelector.channelId || 'IBC channel'}
			{/snippet}

			{#snippet Value()}
				{[(ibcChannel.state ?? ''), ibcChannelSelector.channelId].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[ibcChannelSelector.portId, (ibcChannel.counterpartyChainId ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
