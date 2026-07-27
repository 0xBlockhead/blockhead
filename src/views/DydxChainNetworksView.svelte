<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain networks',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainNetwork}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainNetwork })}
		{@const dydxChainNetworkSelector = dydxChainNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DydxChainNetwork}
			entitySelector={dydxChainNetworkSelector}
		>
			{#snippet Title()}
				{(dydxChainNetwork.$network.name || (dydxChainNetworkSelector.$network.caip2 == null ? '' : `${dydxChainNetworkSelector.$network.caip2.namespace}:${dydxChainNetworkSelector.$network.caip2.reference}`) || 'Network')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
