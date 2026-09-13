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
	}: EntityListViewProps<EntityType.HederaContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaContract_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaContractTimestamp })}
		{@const hederaContractTimestampSelector = hederaContractTimestamp[EntityMetaKey.Selector]}
		{@const contract = hederaContractTimestampSelector.$contract}
		<EntityView
			entityType={EntityType.HederaContract_Timestamp}
			entitySelector={hederaContractTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							contract.$network.caip2 !== undefined ?
								caip2StringFromValue(contract.$network.caip2)
							:
								contract.$network.slug
						),
						address: contract.contractId,
						timestampMs: String(hederaContractTimestampSelector.timestampMs),
						source: hederaContractTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
