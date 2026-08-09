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
	}: EntityListViewProps<EntityType.HyperliquidNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidNetwork}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: hyperliquidNetwork })}
		<EntityView
			entityType={EntityType.HyperliquidNetwork}
			entitySelector={hyperliquidNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{hyperliquidNetwork.$network.name || `${hyperliquidNetwork.$network.caip2.namespace}:${hyperliquidNetwork.$network.caip2.reference}` || 'Network'}
			{/snippet}

			{#snippet Value()}
				Hyperliquid
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
