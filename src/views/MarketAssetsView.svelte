<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.MarketAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MarketAsset}
	bind:open
	resource={
		selection({
			fields: {
				assetKey: true,
				kind: true,
			},
		})
	}
>
	{#snippet Item({ item: marketAsset })}
		{@const marketAssetSelector = marketAsset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MarketAsset}
			entitySelector={marketAssetSelector}
			href={
				resolve(
					'/(assets)/(marketAssets)/market-asset/[kind=stringSegment]/[assetKey=stringSegment]',
					{
						kind: marketAssetSelector.kind,
						assetKey: marketAssetSelector.assetKey,
					}
				)
			}
		>
			{#snippet Title()}
				{marketAssetSelector.assetKey || 'Market asset'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{marketAssetSelector.kind}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
