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
	}: EntityListViewProps<EntityType.SuiDynamicFieldEdge_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiDynamicFieldEdgeTimestamp })}
		<EntityView
			entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
			entitySelector={suiDynamicFieldEdgeTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui dynamic field edge timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
