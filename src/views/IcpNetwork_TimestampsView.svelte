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
	}: EntityListViewProps<EntityType.IcpNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpNetworkTimestamp })}
		{@const icpNetworkTimestampSelector = icpNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IcpNetwork_Timestamp}
			entitySelector={icpNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							icpNetworkTimestampSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(icpNetworkTimestampSelector.$network.$network.caip2)
							:
								icpNetworkTimestampSelector.$network.$network.slug
						),
						timestampMs: String(icpNetworkTimestampSelector.timestampMs),
						source: icpNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				ICP network timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
