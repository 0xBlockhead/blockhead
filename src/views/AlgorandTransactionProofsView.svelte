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
	}: EntityListViewProps<EntityType.AlgorandTransactionProof> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandTransactionProof}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandTransactionProof })}
		{@const algorandTransactionProofSelector = algorandTransactionProof[EntityMetaKey.Selector]}
		{@const transaction = algorandTransactionProofSelector.$transaction}
		<EntityView
			entityType={EntityType.AlgorandTransactionProof}
			entitySelector={algorandTransactionProofSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/transaction/[txId=stringSegment]/(algorandTransaction)/proof/[round=nonNegativeBigInt]/[hashType=stringSegment]/[source=stringSegment]',
					{
						network: (
							'caip2' in transaction.$network.$network ?
								caip2StringFromValue(transaction.$network.$network.caip2)
							:
								transaction.$network.$network.slug
						),
						txId: transaction.txId,
						round: String(algorandTransactionProofSelector.round),
						hashType: algorandTransactionProofSelector.hashType,
						source: algorandTransactionProofSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
