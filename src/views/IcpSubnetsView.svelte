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
	}: EntityListViewProps<EntityType.IcpSubnet> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpSubnet}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpSubnet })}
		{@const icpSubnetSelector = icpSubnet[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IcpSubnet}
			entitySelector={icpSubnetSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/subnet/[subnetId=stringSegment]',
					{
						network: (
							icpSubnetSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(icpSubnetSelector.$network.$network.caip2)
							:
								icpSubnetSelector.$network.$network.slug
						),
						subnetId: icpSubnetSelector.subnetId,
					}
				)
			}
		>
			{#snippet Title()}
				ICP subnet
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
