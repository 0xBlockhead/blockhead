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
	}: EntityListViewProps<EntityType.TronBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronBlock}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronBlock })}
		<EntityView
			entityType={EntityType.TronBlock}
			entitySelector={tronBlock[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tron block
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
