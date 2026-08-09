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
			...{
				fields: {
					$hub: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: globalEvmAbiCatalogTimestamp })}
		{@const globalEvmAbiCatalogTimestampSelector = globalEvmAbiCatalogTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalEvmAbiCatalog_Timestamp}
			entitySelector={globalEvmAbiCatalogTimestampSelector}
			href={
				resolve(
					'/~/evm/abi-catalog/(globalEvmAbiCatalog)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						timestampMs: String(globalEvmAbiCatalogTimestampSelector.timestampMs),
						source: globalEvmAbiCatalogTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				global EVM ABI catalog
			{/snippet}

			{#snippet Value()}
				{globalEvmAbiCatalogTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
