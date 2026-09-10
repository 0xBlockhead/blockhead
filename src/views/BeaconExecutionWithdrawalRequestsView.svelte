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
	}: EntityListViewProps<EntityType.BeaconExecutionWithdrawalRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconExecutionWithdrawalRequest}
	bind:open
	resource={
		selection({
			fields: {
				indexInEnvelope: true,
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
	{#snippet Item({ item: beaconExecutionWithdrawalRequest })}
		{@const beaconExecutionWithdrawalRequestSelector = beaconExecutionWithdrawalRequest[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BeaconExecutionWithdrawalRequest}
			entitySelector={beaconExecutionWithdrawalRequestSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope/(beaconExecutionPayloadEnvelope)/withdrawal-request/[indexInEnvelope=nonNegativeInteger]',
					{
						network: (
							'caip2' in beaconExecutionWithdrawalRequestSelector.$envelope.$beaconBlock.$network ?
								caip2StringFromValue(beaconExecutionWithdrawalRequestSelector.$envelope.$beaconBlock.$network.caip2)
							:
								beaconExecutionWithdrawalRequestSelector.$envelope.$beaconBlock.$network.slug
						),
						root: beaconExecutionWithdrawalRequestSelector.$envelope.$beaconBlock.root,
						indexInEnvelope: String(beaconExecutionWithdrawalRequestSelector.indexInEnvelope),
					}
				)
			}
		>
			{#snippet Title()}
				{`Withdrawal request #${beaconExecutionWithdrawalRequestSelector.indexInEnvelope}`}
			{/snippet}

			{#snippet Value()}
				{beaconExecutionWithdrawalRequest.amountGwei + ' Gwei'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{'Execution block ' + String(beaconExecutionWithdrawalRequest.$envelope.blockNumber)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
