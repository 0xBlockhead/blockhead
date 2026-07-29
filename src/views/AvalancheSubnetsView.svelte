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
	}: EntityListViewProps<EntityType.AvalancheSubnet> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalancheSubnet}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				threshold: true,
				subnetId: true,
			},
		})
	}
>
	{#snippet Item({ item: avalancheSubnet })}
		{@const avalancheSubnetSelector = avalancheSubnet[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvalancheSubnet}
			entitySelector={avalancheSubnetSelector}
		>
			{#snippet Title()}
				{(avalancheSubnet.label ?? '') || avalancheSubnetSelector.subnetId || 'avalanche subnet'}
			{/snippet}

			{#snippet Value()}
				{avalancheSubnet.threshold ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
