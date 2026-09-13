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
	}: EntityListViewProps<EntityType.AlgorandBox_Round> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandBox_Round}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandBoxRound })}
		{@const algorandBoxRoundSelector = algorandBoxRound[EntityMetaKey.Selector]}
		{@const box = algorandBoxRoundSelector.$box}
		<EntityView
			entityType={EntityType.AlgorandBox_Round}
			entitySelector={algorandBoxRoundSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/application/[applicationId=nonNegativeBigInt]/(algorandApplication)/box/[boxName=zeroExHex]/(algorandBox)/observation/[round=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							box.$application.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(box.$application.$network.$network.caip2)
							:
								box.$application.$network.$network.slug
						),
						applicationId: String(box.$application.applicationId),
						boxName: box.boxName,
						round: String(algorandBoxRoundSelector.round),
						source: algorandBoxRoundSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
