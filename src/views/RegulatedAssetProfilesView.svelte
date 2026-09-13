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
		...EntitiesListProps
	}: EntityListViewProps<EntityType.RegulatedAssetProfile> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RegulatedAssetProfile}
	bind:open
	resource={
		selection({
			fields: {
				standard: true,
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
	{#snippet Item({ item: regulatedAssetProfile })}
		{@const regulatedAssetProfileSelector = regulatedAssetProfile[EntityMetaKey.Selector]}
		{@const assetInstance = regulatedAssetProfileSelector.$assetInstance}
		<EntityView
			entityType={EntityType.RegulatedAssetProfile}
			entitySelector={regulatedAssetProfileSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile',
					{
						network: (
							assetInstance.$network.caip2 !== undefined ?
								caip2StringFromValue(assetInstance.$network.caip2)
							:
								assetInstance.$network.slug
						),
						kind: assetInstance.kind,
						assetKey: assetInstance.assetKey,
					}
				)
			}
		>
			{#snippet Title()}
				{regulatedAssetProfile.standard || 'regulated asset profile'}
			{/snippet}

			{#snippet Value()}
				{[regulatedAssetProfile.$assetInstance.symbol, regulatedAssetProfile.$assetInstance.name].filter(Boolean).join(' ') || 'Asset instance'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
