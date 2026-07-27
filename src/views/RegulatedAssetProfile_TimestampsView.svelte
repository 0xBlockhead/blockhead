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
	}: EntityListViewProps<EntityType.RegulatedAssetProfile_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RegulatedAssetProfile_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: regulatedAssetProfileTimestamp })}
		<EntityView
			entityType={EntityType.RegulatedAssetProfile_Timestamp}
			entitySelector={regulatedAssetProfileTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				regulated asset profile timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
