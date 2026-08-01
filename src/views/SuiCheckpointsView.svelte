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
	}: EntityListViewProps<EntityType.SuiCheckpoint> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiCheckpoint}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiCheckpoint })}
		<EntityView
			entityType={EntityType.SuiCheckpoint}
			entitySelector={suiCheckpoint[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui checkpoint
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
