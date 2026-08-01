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
	}: EntityListViewProps<EntityType.TonTrace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonTrace}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonTrace })}
		<EntityView
			entityType={EntityType.TonTrace}
			entitySelector={tonTrace[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON trace
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
