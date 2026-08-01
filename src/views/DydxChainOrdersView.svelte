<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain orders',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainOrder> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainOrder}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				orderId: true,
				side: true,
				orderType: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainOrder })}
		{@const dydxChainOrderSelector = dydxChainOrder[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DydxChainOrder}
			entitySelector={dydxChainOrderSelector}
		>
			{#snippet Title()}
				{dydxChainOrderSelector.orderId || 'dydx chain order'}
			{/snippet}

			{#snippet Value()}
				{dydxChainOrder.side ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{dydxChainOrder.orderType ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
