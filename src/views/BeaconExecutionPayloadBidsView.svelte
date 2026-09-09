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
	}: EntityListViewProps<EntityType.BeaconExecutionPayloadBid> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconExecutionPayloadBid}
	bind:open
	resource={
		selection({
			fields: {
				builderIndex: true,
				valueGwei: true,
				$beaconBlock: {
					fields: {
						version: true,
						$slot: {
							fields: {
								$epoch: true,
							},
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: beaconExecutionPayloadBid })}
		{@const beaconExecutionPayloadBidSelector = beaconExecutionPayloadBid[EntityMetaKey.Selector]}
		{@const beaconBlock = beaconExecutionPayloadBidSelector.$beaconBlock}
		<EntityView
			entityType={EntityType.BeaconExecutionPayloadBid}
			entitySelector={beaconExecutionPayloadBidSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-bid',
					{
						network: (
							'caip2' in beaconBlock.$network ?
								caip2StringFromValue(beaconBlock.$network.caip2)
							:
								beaconBlock.$network.slug
						),
						root: beaconBlock.root,
					}
				)
			}
		>
			{#snippet Title()}
				{'Builder ' + beaconExecutionPayloadBid.builderIndex}
			{/snippet}

			{#snippet Value()}
				{beaconExecutionPayloadBid.valueGwei + ' Gwei'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{beaconExecutionPayloadBidSelector.$beaconBlock.root || 'beacon block'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
