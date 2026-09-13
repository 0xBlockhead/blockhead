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
	}: EntityListViewProps<EntityType.StellarNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarNetworkTimestamp })}
		{@const stellarNetworkTimestampSelector = stellarNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StellarNetwork_Timestamp}
			entitySelector={stellarNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							stellarNetworkTimestampSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(stellarNetworkTimestampSelector.$network.$network.caip2)
							:
								stellarNetworkTimestampSelector.$network.$network.slug
						),
						timestampMs: String(stellarNetworkTimestampSelector.timestampMs),
						source: stellarNetworkTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
