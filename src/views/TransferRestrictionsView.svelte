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
	}: EntityListViewProps<EntityType.TransferRestriction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TransferRestriction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: transferRestriction })}
		<EntityView
			entityType={EntityType.TransferRestriction}
			entitySelector={transferRestriction[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				transfer restriction
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
