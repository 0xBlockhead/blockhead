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
	}: EntityListViewProps<EntityType.TezosNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosNetworkTimestamp })}
		{@const tezosNetworkTimestampSelector = tezosNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosNetwork_Timestamp}
			entitySelector={tezosNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in tezosNetworkTimestampSelector.$network.$network ?
								caip2StringFromValue(tezosNetworkTimestampSelector.$network.$network.caip2)
							:
								tezosNetworkTimestampSelector.$network.$network.slug
						),
						timestampMs: String(tezosNetworkTimestampSelector.timestampMs),
						source: tezosNetworkTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
