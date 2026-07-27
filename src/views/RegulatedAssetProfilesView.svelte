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
		<EntityView
			entityType={EntityType.RegulatedAssetProfile}
			entitySelector={regulatedAssetProfile[EntityMetaKey.Selector]}
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
