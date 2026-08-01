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
	}: EntityListViewProps<EntityType.TonContractGetMethod> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonContractGetMethod}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonContractGetMethod })}
		<EntityView
			entityType={EntityType.TonContractGetMethod}
			entitySelector={tonContractGetMethod[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON contract get method
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
