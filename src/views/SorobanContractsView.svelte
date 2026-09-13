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
	}: EntityListViewProps<EntityType.SorobanContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SorobanContract}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: sorobanContract })}
		{@const sorobanContractSelector = sorobanContract[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SorobanContract}
			entitySelector={sorobanContractSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/contract/[contractId=stringSegment]',
					{
						network: (
							sorobanContractSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(sorobanContractSelector.$network.$network.caip2)
							:
								sorobanContractSelector.$network.$network.slug
						),
						contractId: sorobanContractSelector.contractId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
