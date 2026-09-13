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
	}: EntityListViewProps<EntityType.IcpSubnet_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpSubnet_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpSubnetTimestamp })}
		{@const icpSubnetTimestampSelector = icpSubnetTimestamp[EntityMetaKey.Selector]}
		{@const subnet = icpSubnetTimestampSelector.$subnet}
		<EntityView
			entityType={EntityType.IcpSubnet_Timestamp}
			entitySelector={icpSubnetTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/subnet/[subnetId=stringSegment]/(icpSubnet)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							subnet.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(subnet.$network.$network.caip2)
							:
								subnet.$network.$network.slug
						),
						subnetId: subnet.subnetId,
						timestampMs: String(icpSubnetTimestampSelector.timestampMs),
						source: icpSubnetTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				ICP subnet timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
