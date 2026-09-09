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
	}: EntityListViewProps<EntityType.BlockheadLightningChannelState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningChannelState}
	bind:open
	resource={
		selection({
			fields: {
				$channel: true,
				$localNodeState: true,
				private: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningChannelState })}
		{@const blockheadLightningChannelStateSelector = blockheadLightningChannelState[EntityMetaKey.Selector]}
		{@const localNodeState = blockheadLightningChannelStateSelector.$localNodeState}
		<EntityView
			entityType={EntityType.BlockheadLightningChannelState}
			entitySelector={blockheadLightningChannelStateSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/channel/[channelId=stringSegment]',
					{
						network: (
							'caip2' in localNodeState.$network.$network ?
								caip2StringFromValue(localNodeState.$network.$network.caip2)
							:
								localNodeState.$network.$network.slug
						),
						connectionId: localNodeState.connectionId,
						channelId: blockheadLightningChannelStateSelector.$channel.channelId,
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadLightningChannelState.$channel.shortChannelId ?? '') || blockheadLightningChannelStateSelector.$channel.channelId || 'Lightning channel'}
			{/snippet}

			{#snippet Value()}
				{(blockheadLightningChannelState.$localNodeState.alias ?? '') || blockheadLightningChannelStateSelector.$localNodeState.connectionId || 'local LND node state'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLightningChannelState.private ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
