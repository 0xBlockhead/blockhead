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
		id = 'RadiclePatches-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.RadiclePatch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadiclePatch}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radiclePatch })}
		<EntityView
			entityType={EntityType.RadiclePatch}
			entitySelector={radiclePatch[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
