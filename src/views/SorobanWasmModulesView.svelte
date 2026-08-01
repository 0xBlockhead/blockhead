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
		id = 'SorobanWasmModules-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SorobanWasm> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SorobanWasm}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: sorobanWasm })}
		<EntityView
			entityType={EntityType.SorobanWasm}
			entitySelector={sorobanWasm[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
