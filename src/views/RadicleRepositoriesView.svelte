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
		id = 'RadicleRepositories-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.RadicleRepository> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleRepository}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleRepository })}
		<EntityView
			entityType={EntityType.RadicleRepository}
			entitySelector={radicleRepository[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
