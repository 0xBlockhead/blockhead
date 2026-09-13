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
	}: EntityListViewProps<EntityType.BeaconExecutionDepositRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconExecutionDepositRequest}
	bind:open
	resource={
		selection({
			fields: {
				requestIndex: true,
				amountGwei: true,
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
		})
	}
>
	{#snippet Item({ item: beaconExecutionDepositRequest })}
		{@const beaconExecutionDepositRequestSelector = beaconExecutionDepositRequest[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BeaconExecutionDepositRequest}
			entitySelector={beaconExecutionDepositRequestSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope/(beaconExecutionPayloadEnvelope)/deposit-request/[requestIndex=nonNegativeBigInt]',
					{
						network: (
							beaconExecutionDepositRequestSelector.$envelope.$beaconBlock.$network.caip2 !== undefined ?
								caip2StringFromValue(beaconExecutionDepositRequestSelector.$envelope.$beaconBlock.$network.caip2)
							:
								beaconExecutionDepositRequestSelector.$envelope.$beaconBlock.$network.slug
						),
						root: beaconExecutionDepositRequestSelector.$envelope.$beaconBlock.root,
						requestIndex: String(beaconExecutionDepositRequestSelector.requestIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{'Deposit request ' + beaconExecutionDepositRequestSelector.requestIndex}
			{/snippet}

			{#snippet Value()}
				{beaconExecutionDepositRequest.amountGwei + ' Gwei'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{'Execution block ' + String(beaconExecutionDepositRequest.$envelope.blockNumber)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
