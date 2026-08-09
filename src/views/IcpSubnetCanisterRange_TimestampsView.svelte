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
	}: EntityListViewProps<EntityType.IcpSubnetCanisterRange_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpSubnetCanisterRange_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpSubnetCanisterRangeTimestamp })}
		{@const icpSubnetCanisterRangeTimestampSelector = icpSubnetCanisterRangeTimestamp[EntityMetaKey.Selector]}
		{@const subnet = icpSubnetCanisterRangeTimestampSelector.$subnet}
		<EntityView
			entityType={EntityType.IcpSubnetCanisterRange_Timestamp}
			entitySelector={icpSubnetCanisterRangeTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/subnet/[subnetId=stringSegment]/(icpSubnet)/canister-range/[rangeStart=stringSegment]/[rangeEnd=stringSegment]/[registryVersion=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in subnet.$network.$network ?
								caip2StringFromValue(subnet.$network.$network.caip2)
							:
								subnet.$network.$network.slug
						),
						subnetId: subnet.subnetId,
						rangeStart: icpSubnetCanisterRangeTimestampSelector.rangeStart,
						rangeEnd: icpSubnetCanisterRangeTimestampSelector.rangeEnd,
						registryVersion: String(icpSubnetCanisterRangeTimestampSelector.registryVersion),
						source: icpSubnetCanisterRangeTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				ICP subnet canister range timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
