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
	}: EntityListViewProps<EntityType.KaspaNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaNetworkTimestamp })}
		{@const kaspaNetworkTimestampSelector = kaspaNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.KaspaNetwork_Timestamp}
			entitySelector={kaspaNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in kaspaNetworkTimestampSelector.$network.$network ?
								caip2StringFromValue(kaspaNetworkTimestampSelector.$network.$network.caip2)
							:
								kaspaNetworkTimestampSelector.$network.$network.slug
						),
						timestampMs: String(kaspaNetworkTimestampSelector.timestampMs),
						source: kaspaNetworkTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
