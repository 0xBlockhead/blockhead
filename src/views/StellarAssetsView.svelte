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
	}: EntityListViewProps<EntityType.StellarAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarAsset}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarAsset })}
		<EntityView
			entityType={EntityType.StellarAsset}
			entitySelector={stellarAsset[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				stellar asset
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
