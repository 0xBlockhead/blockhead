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
	}: EntityListViewProps<EntityType.TonContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonContract}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonContract })}
		<EntityView
			entityType={EntityType.TonContract}
			entitySelector={tonContract[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON contract
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
