<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		<EntityView
			entityType={EntityType.BittensorSubnet}
			entitySelector={bittensorSubnetSelector}
		>
			{#snippet Title()}
				{[(bittensorSubnet.name ?? ''), String(bittensorSubnetSelector.netuid)].filter(Boolean).join(' ') || 'Bittensor subnet'}
			{/snippet}

			{#snippet Value()}
				{String(bittensorSubnetSelector.netuid)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
