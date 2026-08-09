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
	}: EntityListViewProps<EntityType.SorobanContractStorageEntry_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SorobanContractStorageEntry_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: sorobanContractStorageEntryTimestamp })}
		{@const sorobanContractStorageEntryTimestampSelector = sorobanContractStorageEntryTimestamp[EntityMetaKey.Selector]}
		{@const entry = sorobanContractStorageEntryTimestampSelector.$entry}
		<EntityView
			entityType={EntityType.SorobanContractStorageEntry_Timestamp}
			entitySelector={sorobanContractStorageEntryTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/contract/[contractId=stringSegment]/(sorobanContract)/storage/[keyHash=stringSegment]/(sorobanContractStorageEntry)/ledger/[ledgerSequence=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in entry.$contract.$network.$network ?
								caip2StringFromValue(entry.$contract.$network.$network.caip2)
							:
								entry.$contract.$network.$network.slug
						),
						contractId: entry.$contract.contractId,
						keyHash: entry.keyHash,
						ledgerSequence: String(sorobanContractStorageEntryTimestampSelector.ledgerSequence),
						source: sorobanContractStorageEntryTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
