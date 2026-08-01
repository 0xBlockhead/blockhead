<!-- Generated from APP.ts. Do not edit by hand. -->

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
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AssetInstance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AssetInstance}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				name: true,
			},
		})
	}
>
	{#snippet Item({ item: assetInstance })}
		{@const assetInstanceSelector = assetInstance[EntityMetaKey.Selector]}
		{@const network = assetInstanceSelector.$network}
		<EntityView
			entityType={EntityType.AssetInstance}
			entitySelector={assetInstanceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						kind: assetInstanceSelector.kind,
						assetKey: assetInstanceSelector.assetKey,
					}
				)
			}
		>
			{#snippet Title()}
				{[assetInstance.symbol, assetInstance.name].filter(Boolean).join(' ') || 'Asset instance'}
			{/snippet}

			{#snippet Value()}
				{assetInstance.symbol}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
