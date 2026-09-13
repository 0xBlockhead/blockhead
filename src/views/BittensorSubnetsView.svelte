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
	}: EntityListViewProps<EntityType.BittensorSubnet> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorSubnet}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				netuid: true,
			},
		})
	}
>
	{#snippet Item({ item: bittensorSubnet })}
		{@const bittensorSubnetSelector = bittensorSubnet[EntityMetaKey.Selector]}
		{@const network = bittensorSubnetSelector.$network}
		<EntityView
			entityType={EntityType.BittensorSubnet}
			entitySelector={bittensorSubnetSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/subnet/[netuid=nonNegativeInteger]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						netuid: String(bittensorSubnetSelector.netuid),
					}
				)
			}
		>
			{#snippet Title()}
				{[(bittensorSubnet.name ?? ''), String(bittensorSubnetSelector.netuid)].filter(Boolean).join(' ') || 'Bittensor subnet'}
			{/snippet}

			{#snippet Value()}
				{['netuid ', String(bittensorSubnetSelector.netuid)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
