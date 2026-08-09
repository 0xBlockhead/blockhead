<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		id = 'GlobalEvmAbiCatalogs-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalEvmAbiCatalog> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalEvmAbiCatalog}
	{id}
	bind:open
	resource={
		selection({
			...{
				fields: {
					scope: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: globalEvmAbiCatalog })}
		{@const globalEvmAbiCatalogSelector = globalEvmAbiCatalog[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalEvmAbiCatalog}
			entitySelector={globalEvmAbiCatalogSelector}
			href={
				globalEvmAbiCatalogSelector.scope === 'global' ?
					resolve('/~/evm/abi-catalog')
				:
					undefined
			}
		>
			{#snippet Value()}
				{globalEvmAbiCatalogSelector.scope}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
