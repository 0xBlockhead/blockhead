<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
		{@const assetInstance = assetClassSelector.$assetInstance}
		<EntityView
			entityType={EntityType.AssetClass}
			entitySelector={assetClassSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/class/[classKind=stringSegment]/[classKey=stringSegment]',
					{
						network: (
							assetInstance.$network.caip2 !== undefined ?
								caip2StringFromValue(assetInstance.$network.caip2)
							:
								assetInstance.$network.slug
						),
						kind: assetInstance.kind,
						assetKey: assetInstance.assetKey,
						classKind: assetClassSelector.classKind,
						classKey: assetClassSelector.classKey,
					}
				)
			}
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
