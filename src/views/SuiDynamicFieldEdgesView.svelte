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
	}: EntityListViewProps<EntityType.SuiDynamicFieldEdge> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiDynamicFieldEdge}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiDynamicFieldEdge })}
		<EntityView
			entityType={EntityType.SuiDynamicFieldEdge}
			entitySelector={suiDynamicFieldEdge[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui dynamic field edge
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
