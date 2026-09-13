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
	}: EntityListViewProps<EntityType.TronContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronContract_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronContractTimestamp })}
		{@const tronContractTimestampSelector = tronContractTimestamp[EntityMetaKey.Selector]}
		{@const contract = tronContractTimestampSelector.$contract}
		<EntityView
			entityType={EntityType.TronContract_Timestamp}
			entitySelector={tronContractTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/contract/[address=stringSegment]/(tronContract)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							contract.$network.caip2 !== undefined ?
								caip2StringFromValue(contract.$network.caip2)
							:
								contract.$network.slug
						),
						address: contract.address,
						timestampMs: String(tronContractTimestampSelector.timestampMs),
						source: tronContractTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
