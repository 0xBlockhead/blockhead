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
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: hyperliquidNetwork })}
		{@const hyperliquidNetworkSelector = hyperliquidNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.HyperliquidNetwork}
			entitySelector={hyperliquidNetworkSelector}
		>
			{#snippet Title()}
				{hyperliquidNetwork.$network.name || (hyperliquidNetworkSelector.$network.caip2 == null ? '' : `${hyperliquidNetworkSelector.$network.caip2.namespace}:${hyperliquidNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				Hyperliquid
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
