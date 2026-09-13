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
	}: EntityListViewProps<EntityType.SuiNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiNetworkTimestamp })}
		{@const suiNetworkTimestampSelector = suiNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiNetwork_Timestamp}
			entitySelector={suiNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							suiNetworkTimestampSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(suiNetworkTimestampSelector.$network.$network.caip2)
							:
								suiNetworkTimestampSelector.$network.$network.slug
						),
						timestampMs: String(suiNetworkTimestampSelector.timestampMs),
						source: suiNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				Sui network timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
