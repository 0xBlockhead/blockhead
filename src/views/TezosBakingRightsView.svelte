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
	}: EntityListViewProps<EntityType.TezosBakingRight> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBakingRight}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBakingRight })}
		<EntityView
			entityType={EntityType.TezosBakingRight}
			entitySelector={tezosBakingRight[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos baking right
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
