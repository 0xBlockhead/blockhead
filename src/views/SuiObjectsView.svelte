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
	}: EntityListViewProps<EntityType.SuiObject> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiObject}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiObject })}
		<EntityView
			entityType={EntityType.SuiObject}
			entitySelector={suiObject[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui object
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
