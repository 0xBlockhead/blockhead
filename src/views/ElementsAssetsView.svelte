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
	}: EntityListViewProps<EntityType.ElementsAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ElementsAsset}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				ticker: true,
				assetId: true,
			},
		})
	}
>
	{#snippet Item({ item: elementsAsset })}
		{@const elementsAssetSelector = elementsAsset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ElementsAsset}
			entitySelector={elementsAssetSelector}
		>
			{#snippet Title()}
				{[(elementsAsset.name ?? ''), (elementsAsset.ticker ?? ''), elementsAssetSelector.assetId].filter(Boolean).join(' ') || 'Elements asset'}
			{/snippet}

			{#snippet Value()}
				{elementsAsset.ticker ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{elementsAssetSelector.assetId}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
