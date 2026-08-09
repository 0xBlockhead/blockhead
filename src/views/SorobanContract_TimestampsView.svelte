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
	}: EntityListViewProps<EntityType.SorobanContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SorobanContract_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: sorobanContractTimestamp })}
		{@const sorobanContractTimestampSelector = sorobanContractTimestamp[EntityMetaKey.Selector]}
		{@const contract = sorobanContractTimestampSelector.$contract}
		<EntityView
			entityType={EntityType.SorobanContract_Timestamp}
			entitySelector={sorobanContractTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/contract/[contractId=stringSegment]/(sorobanContract)/ledger/[ledgerSequence=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in contract.$network.$network ?
								caip2StringFromValue(contract.$network.$network.caip2)
							:
								contract.$network.$network.slug
						),
						contractId: contract.contractId,
						ledgerSequence: String(sorobanContractTimestampSelector.ledgerSequence),
						source: sorobanContractTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
