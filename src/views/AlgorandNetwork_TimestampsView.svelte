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
	}: EntityListViewProps<EntityType.AlgorandNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandNetworkTimestamp })}
		{@const algorandNetworkTimestampSelector = algorandNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AlgorandNetwork_Timestamp}
			entitySelector={algorandNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							algorandNetworkTimestampSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(algorandNetworkTimestampSelector.$network.$network.caip2)
							:
								algorandNetworkTimestampSelector.$network.$network.slug
						),
						timestampMs: String(algorandNetworkTimestampSelector.timestampMs),
						source: algorandNetworkTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
