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
	}: EntityListViewProps<EntityType.TronContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronContract}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronContract })}
		<EntityView
			entityType={EntityType.TronContract}
			entitySelector={tronContract[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tron contract
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
