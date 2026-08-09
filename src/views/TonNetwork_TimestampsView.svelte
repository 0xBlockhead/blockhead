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
	}: EntityListViewProps<EntityType.TonNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNetworkTimestamp })}
		{@const tonNetworkTimestampSelector = tonNetworkTimestamp[EntityMetaKey.Selector]}
		{@const network = tonNetworkTimestampSelector.$network}
		<EntityView
			entityType={EntityType.TonNetwork_Timestamp}
			entitySelector={tonNetworkTimestampSelector}
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
						timestampMs: String(tonNetworkTimestampSelector.timestampMs),
						source: tonNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				TON network timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
