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
	}: EntityListViewProps<EntityType.TronNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronNetworkTimestamp })}
		{@const tronNetworkTimestampSelector = tronNetworkTimestamp[EntityMetaKey.Selector]}
		{@const network = tronNetworkTimestampSelector.$network}
		<EntityView
			entityType={EntityType.TronNetwork_Timestamp}
			entitySelector={tronNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(tronNetworkTimestampSelector.timestampMs),
						source: tronNetworkTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
