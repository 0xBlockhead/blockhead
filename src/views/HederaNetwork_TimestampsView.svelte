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
	}: EntityListViewProps<EntityType.HederaNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaNetworkTimestamp })}
		{@const hederaNetworkTimestampSelector = hederaNetworkTimestamp[EntityMetaKey.Selector]}
		{@const network = hederaNetworkTimestampSelector.$network}
		<EntityView
			entityType={EntityType.HederaNetwork_Timestamp}
			entitySelector={hederaNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(hederaNetworkTimestampSelector.timestampMs),
						source: hederaNetworkTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
