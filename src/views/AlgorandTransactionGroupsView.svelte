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
	}: EntityListViewProps<EntityType.AlgorandTransactionGroup> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandTransactionGroup}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandTransactionGroup })}
		{@const algorandTransactionGroupSelector = algorandTransactionGroup[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AlgorandTransactionGroup}
			entitySelector={algorandTransactionGroupSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/transaction-group/[group=zeroExHex]',
					{
						network: (
							'caip2' in algorandTransactionGroupSelector.$network.$network ?
								caip2StringFromValue(algorandTransactionGroupSelector.$network.$network.caip2)
							:
								algorandTransactionGroupSelector.$network.$network.slug
						),
						group: algorandTransactionGroupSelector.group,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
