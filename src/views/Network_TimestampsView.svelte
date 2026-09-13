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
	}: EntityListViewProps<EntityType.Network_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Network_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: networkTimestamp })}
		{@const networkTimestampSelector = networkTimestamp[EntityMetaKey.Selector]}
		{@const network = networkTimestampSelector.$network}
		<EntityView
			entityType={EntityType.Network_Timestamp}
			entitySelector={networkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(networkTimestampSelector.timestampMs),
						source: networkTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
