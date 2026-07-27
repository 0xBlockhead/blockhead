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
	}: EntityListViewProps<EntityType.TezosBaker> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBaker}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBaker })}
		<EntityView
			entityType={EntityType.TezosBaker}
			entitySelector={tezosBaker[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos baker
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
