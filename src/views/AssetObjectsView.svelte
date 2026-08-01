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
	}: EntityListViewProps<EntityType.AssetObject> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AssetObject}
	bind:open
	resource={
		selection({
			fields: {
				objectKey: true,
				objectKind: true,
				tokenId: true,
				$assetInstance: {
					fields: {
						symbol: true,
						name: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: assetObject })}
		{@const assetObjectSelector = assetObject[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AssetObject}
			entitySelector={assetObjectSelector}
		>
			{#snippet Title()}
				{assetObjectSelector.objectKey || 'asset object'}
			{/snippet}

			{#snippet Value()}
				{[assetObject.objectKind, (assetObject.tokenId ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[assetObject.$assetInstance.symbol, assetObject.$assetInstance.name].filter(Boolean).join(' ') || 'Asset instance'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
