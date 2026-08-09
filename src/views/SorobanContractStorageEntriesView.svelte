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
		id = 'SorobanContractStorageEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SorobanContractStorageEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SorobanContractStorageEntry}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: sorobanContractStorageEntry })}
		{@const sorobanContractStorageEntrySelector = sorobanContractStorageEntry[EntityMetaKey.Selector]}
		{@const contract = sorobanContractStorageEntrySelector.$contract}
		<EntityView
			entityType={EntityType.SorobanContractStorageEntry}
			entitySelector={sorobanContractStorageEntrySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/contract/[contractId=stringSegment]/(sorobanContract)/storage/[keyHash=stringSegment]',
					{
						network: (
							'caip2' in contract.$network.$network ?
								caip2StringFromValue(contract.$network.$network.caip2)
							:
								contract.$network.$network.slug
						),
						contractId: contract.contractId,
						keyHash: sorobanContractStorageEntrySelector.keyHash,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
