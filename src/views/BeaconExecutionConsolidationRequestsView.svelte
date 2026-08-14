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
	}: EntityListViewProps<EntityType.BeaconExecutionConsolidationRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconExecutionConsolidationRequest}
	bind:open
	resource={
		selection({
			...{
				fields: {
					indexInEnvelope: true,
					$envelope: {
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
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: beaconExecutionConsolidationRequest })}
		{@const beaconExecutionConsolidationRequestSelector = beaconExecutionConsolidationRequest[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BeaconExecutionConsolidationRequest}
			entitySelector={beaconExecutionConsolidationRequestSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope/(beaconExecutionPayloadEnvelope)/consolidation-request/[indexInEnvelope=nonNegativeInteger]',
					{
						network: (
							'caip2' in beaconExecutionConsolidationRequestSelector.$envelope.$beaconBlock.$network ?
								caip2StringFromValue(beaconExecutionConsolidationRequestSelector.$envelope.$beaconBlock.$network.caip2)
							:
								beaconExecutionConsolidationRequestSelector.$envelope.$beaconBlock.$network.slug
						),
						root: beaconExecutionConsolidationRequestSelector.$envelope.$beaconBlock.root,
						indexInEnvelope: String(beaconExecutionConsolidationRequestSelector.indexInEnvelope),
					}
				)
			}
		>
			{#snippet Title()}
				{`Consolidation request #${beaconExecutionConsolidationRequestSelector.indexInEnvelope}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{'Execution block ' + String(beaconExecutionConsolidationRequest.$envelope.blockNumber)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
