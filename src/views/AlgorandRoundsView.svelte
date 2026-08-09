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
	}: EntityListViewProps<EntityType.AlgorandRound> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandRound}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandRound })}
		{@const algorandRoundSelector = algorandRound[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AlgorandRound}
			entitySelector={algorandRoundSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/round/[round=nonNegativeBigInt]',
					{
						network: (
							'caip2' in algorandRoundSelector.$network.$network ?
								caip2StringFromValue(algorandRoundSelector.$network.$network.caip2)
							:
								algorandRoundSelector.$network.$network.slug
						),
						round: String(algorandRoundSelector.round),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
