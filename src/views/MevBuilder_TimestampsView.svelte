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
	}: EntityListViewProps<EntityType.MevBuilder_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MevBuilder_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: mevBuilderTimestamp })}
		<EntityView
			entityType={EntityType.MevBuilder_Timestamp}
			entitySelector={mevBuilderTimestamp[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
