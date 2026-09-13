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
	}: EntityListViewProps<EntityType.AlgorandAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandAccount_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandAccountTimestamp })}
		{@const algorandAccountTimestampSelector = algorandAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = algorandAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.AlgorandAccount_Timestamp}
			entitySelector={algorandAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/account/[address=stringSegment]/(algorandAccount)/observation/[round=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							account.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.$network.caip2)
							:
								account.$network.$network.slug
						),
						address: account.address,
						round: String(algorandAccountTimestampSelector.round),
						source: algorandAccountTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
