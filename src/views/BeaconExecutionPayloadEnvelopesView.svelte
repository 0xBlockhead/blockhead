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
	}: EntityListViewProps<EntityType.BeaconExecutionPayloadEnvelope> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconExecutionPayloadEnvelope}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				transactionCount: true,
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
	{#snippet Item({ item: beaconExecutionPayloadEnvelope })}
		{@const beaconExecutionPayloadEnvelopeSelector = beaconExecutionPayloadEnvelope[EntityMetaKey.Selector]}
		{@const beaconBlock = beaconExecutionPayloadEnvelopeSelector.$beaconBlock}
		<EntityView
			entityType={EntityType.BeaconExecutionPayloadEnvelope}
			entitySelector={beaconExecutionPayloadEnvelopeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope',
					{
						network: (
							beaconBlock.$network.caip2 !== undefined ?
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
				{'Execution block ' + beaconExecutionPayloadEnvelope.blockNumber}
			{/snippet}

			{#snippet Value()}
				{beaconExecutionPayloadEnvelope.transactionCount + ' transactions'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{beaconExecutionPayloadEnvelopeSelector.$beaconBlock.root || 'beacon block'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
