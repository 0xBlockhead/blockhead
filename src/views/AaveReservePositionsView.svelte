<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.AaveReservePosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AaveReservePosition}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				suppliedBalance: true,
				borrowedBalance: true,
			},
		})
	}
>
	{#snippet Item({ item: aaveReservePosition })}
		<EntityView
			entityType={EntityType.AaveReservePosition}
			entitySelector={aaveReservePosition[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{aaveReservePosition.symbol || 'Aave reserve position'}
			{/snippet}

			{#snippet Value()}
				{[(aaveReservePosition.suppliedBalance ?? ''), (aaveReservePosition.borrowedBalance ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
