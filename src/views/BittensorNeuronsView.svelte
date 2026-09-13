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
	}: EntityListViewProps<EntityType.BittensorNeuron> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorNeuron}
	bind:open
	resource={
		selection({
			fields: {
				uid: true,
				$subnet: {
					fields: {
						name: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: bittensorNeuron })}
		{@const bittensorNeuronSelector = bittensorNeuron[EntityMetaKey.Selector]}
		{@const subnet = bittensorNeuronSelector.$subnet}
		<EntityView
			entityType={EntityType.BittensorNeuron}
			entitySelector={bittensorNeuronSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/subnet/[netuid=nonNegativeInteger]/(bittensorSubnet)/neuron/[uid=nonNegativeInteger]',
					{
						network: (
							subnet.$network.caip2 !== undefined ?
								caip2StringFromValue(subnet.$network.caip2)
							:
								subnet.$network.slug
						),
						netuid: String(subnet.netuid),
						uid: String(bittensorNeuronSelector.uid),
					}
				)
			}
		>
			{#snippet Title()}
				{bittensorNeuronSelector.uid}
			{/snippet}

			{#snippet Value()}
				{[(bittensorNeuron.$subnet.name ?? ''), String(bittensorNeuronSelector.$subnet.netuid)].filter(Boolean).join(' ') || 'Bittensor subnet'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
