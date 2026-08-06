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
	}: EntityListViewProps<EntityType.CompoundPositionCollateral> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CompoundPositionCollateral}
	bind:open
	resource={
		selection({
			fields: {
				$asset: {
					fields: {
						borrowCF: true,
						liquidateCF: true,
					},
				},
				balance: true,
			},
		})
	}
>
	{#snippet Item({ item: compoundPositionCollateral })}
		{@const compoundPositionCollateralSelector = compoundPositionCollateral[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CompoundPositionCollateral}
			entitySelector={compoundPositionCollateralSelector}
		>
			{#snippet Title()}
				{compoundPositionCollateralSelector.$asset.symbol || 'Compound Comet collateral asset'}
			{/snippet}

			{#snippet Value()}
				{compoundPositionCollateral.balance}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
