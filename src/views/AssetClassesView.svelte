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
		id = 'AssetClasses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AssetClass> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AssetClass}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				classKey: true,
				classKind: true,
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
	{#snippet Item({ item: assetClass })}
		{@const assetClassSelector = assetClass[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AssetClass}
			entitySelector={assetClassSelector}
		>
			{#snippet Title()}
				{[(assetClass.label ?? ''), assetClassSelector.classKey].filter(Boolean).join(' ') || 'asset class'}
			{/snippet}

			{#snippet Value()}
				{[assetClassSelector.classKind, assetClassSelector.classKey].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[assetClass.$assetInstance.symbol, assetClass.$assetInstance.name].filter(Boolean).join(' ') || 'Asset instance'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
