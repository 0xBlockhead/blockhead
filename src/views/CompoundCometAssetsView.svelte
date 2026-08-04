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
	}: EntityListViewProps<EntityType.CompoundCometAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CompoundCometAsset}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				borrowCF: true,
				liquidateCF: true,
			},
		})
	}
>
	{#snippet Item({ item: compoundCometAsset })}
		{@const compoundCometAssetSelector = compoundCometAsset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CompoundCometAsset}
			entitySelector={compoundCometAssetSelector}
		>
			{#snippet Title()}
				{compoundCometAssetSelector.symbol || 'Compound Comet collateral asset'}
			{/snippet}

			{#snippet Value()}
				{[String(compoundCometAsset.borrowCF), String(compoundCometAsset.liquidateCF)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
