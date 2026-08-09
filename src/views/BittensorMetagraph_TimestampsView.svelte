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
	}: EntityListViewProps<EntityType.BittensorMetagraph_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorMetagraph_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					metagraphByteLength: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bittensorMetagraphTimestamp })}
		{@const bittensorMetagraphTimestampSelector = bittensorMetagraphTimestamp[EntityMetaKey.Selector]}
		{@const subnet = bittensorMetagraphTimestampSelector.$subnet}
		<EntityView
			entityType={EntityType.BittensorMetagraph_Timestamp}
			entitySelector={bittensorMetagraphTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/subnet/[netuid=nonNegativeInteger]/(bittensorSubnet)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in subnet.$network ?
								caip2StringFromValue(subnet.$network.caip2)
							:
								subnet.$network.slug
						),
						netuid: String(subnet.netuid),
						timestampMs: String(bittensorMetagraphTimestampSelector.timestampMs),
						source: bittensorMetagraphTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{bittensorMetagraphTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{bittensorMetagraphTimestamp.metagraphByteLength ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
