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
	}: EntityListViewProps<EntityType.AlgorandApplicationLocalState_Round> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandApplicationLocalState_Round}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandApplicationLocalStateRound })}
		{@const algorandApplicationLocalStateRoundSelector = algorandApplicationLocalStateRound[EntityMetaKey.Selector]}
		{@const account = algorandApplicationLocalStateRoundSelector.$account}
		{@const application = algorandApplicationLocalStateRoundSelector.$application}
		<EntityView
			entityType={EntityType.AlgorandApplicationLocalState_Round}
			entitySelector={algorandApplicationLocalStateRoundSelector}
			href={
				application.$network.$network.caip2 !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/account/[address=stringSegment]/(algorandAccount)/application/[applicationNetwork=networkCaip2]/[applicationId=nonNegativeBigInt]/round/[round=nonNegativeBigInt]/[source=stringSegment]',
						{
							network: (
								account.$network.$network.caip2 !== undefined ?
									caip2StringFromValue(account.$network.$network.caip2)
								:
									account.$network.$network.slug
							),
							address: account.address,
							applicationNetwork: String(application.$network.$network.caip2),
							applicationId: String(application.applicationId),
							round: String(algorandApplicationLocalStateRoundSelector.round),
							source: algorandApplicationLocalStateRoundSelector.source,
						}
					)
				:
					undefined
			}
		/>
	{/snippet}
</EntitiesList>
