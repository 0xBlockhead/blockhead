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
	}: EntityListViewProps<EntityType.HyperliquidVault> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidVault}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidVault })}
		<EntityView
			entityType={EntityType.HyperliquidVault}
			entitySelector={hyperliquidVault[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hyperliquid vault
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
