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
		id = 'GlobalEvmAbiCatalog_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalEvmAbiCatalog_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalEvmAbiCatalog_Timestamp}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				$hub: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: globalEvmAbiCatalogTimestamp })}
		{@const globalEvmAbiCatalogTimestampSelector = globalEvmAbiCatalogTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalEvmAbiCatalog_Timestamp}
			entitySelector={globalEvmAbiCatalogTimestampSelector}
		>
			{#snippet Title()}
				global EVM ABI catalog
			{/snippet}

			{#snippet Value()}
				{String(globalEvmAbiCatalogTimestampSelector.timestampMs)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
