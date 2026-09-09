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
	}: EntityListViewProps<EntityType.BlockheadLightningPeer_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningPeer_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				address: true,
				inbound: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningPeerTimestamp })}
		{@const blockheadLightningPeerTimestampSelector = blockheadLightningPeerTimestamp[EntityMetaKey.Selector]}
		{@const peer = blockheadLightningPeerTimestampSelector.$peer}
		<EntityView
			entityType={EntityType.BlockheadLightningPeer_Timestamp}
			entitySelector={blockheadLightningPeerTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/peer/[publicKey=stringSegment]/(blockheadLightningPeer)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in peer.$localNodeState.$network.$network ?
								caip2StringFromValue(peer.$localNodeState.$network.$network.caip2)
							:
								peer.$localNodeState.$network.$network.slug
						),
						connectionId: peer.$localNodeState.connectionId,
						publicKey: peer.publicKey,
						timestampMs: String(blockheadLightningPeerTimestampSelector.timestampMs),
						source: blockheadLightningPeerTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLightningPeerTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadLightningPeerTimestamp.address ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLightningPeerTimestamp.inbound ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
