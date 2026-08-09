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
	}: EntityListViewProps<EntityType.TezosContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosContract_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosContractTimestamp })}
		{@const tezosContractTimestampSelector = tezosContractTimestamp[EntityMetaKey.Selector]}
		{@const contract = tezosContractTimestampSelector.$contract}
		<EntityView
			entityType={EntityType.TezosContract_Timestamp}
			entitySelector={tezosContractTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in contract.$network.$network ?
								caip2StringFromValue(contract.$network.$network.caip2)
							:
								contract.$network.$network.slug
						),
						address: contract.address,
						level: String(tezosContractTimestampSelector.level),
						source: tezosContractTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
