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
	}: EntityListViewProps<EntityType.AlgorandAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandAsset}
	bind:open
	resource={
		selection({
			fields: {
				assetId: true,
				$network: true,
				creator: true,
			},
		})
	}
>
	{#snippet Item({ item: algorandAsset })}
		{@const algorandAssetSelector = algorandAsset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AlgorandAsset}
			entitySelector={algorandAssetSelector}
		>
			{#snippet Title()}
				{algorandAssetSelector.assetId}
			{/snippet}

			{#snippet Value()}
				algorand network
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{algorandAsset.creator ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
