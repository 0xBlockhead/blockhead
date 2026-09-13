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
	}: EntityListViewProps<EntityType.HederaContractState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaContractState_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaContractStateTimestamp })}
		{@const hederaContractStateTimestampSelector = hederaContractStateTimestamp[EntityMetaKey.Selector]}
		{@const contract = hederaContractStateTimestampSelector.$contract}
		<EntityView
			entityType={EntityType.HederaContractState_Timestamp}
			entitySelector={hederaContractStateTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/slot/[slot=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							contract.$network.caip2 !== undefined ?
								caip2StringFromValue(contract.$network.caip2)
							:
								contract.$network.slug
						),
						address: contract.contractId,
						slot: hederaContractStateTimestampSelector.slot,
						timestampMs: String(hederaContractStateTimestampSelector.timestampMs),
						source: hederaContractStateTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
