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
	}: EntityListViewProps<EntityType.BalancerPoolAprItem> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BalancerPoolAprItem}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				apr: true,
				aprType: true,
			},
		})
	}
>
	{#snippet Item({ item: balancerPoolAprItem })}
		{@const balancerPoolAprItemSelector = balancerPoolAprItem[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BalancerPoolAprItem}
			entitySelector={balancerPoolAprItemSelector}
		>
			{#snippet Title()}
				{balancerPoolAprItemSelector.title || 'Balancer pool APR item'}
			{/snippet}

			{#snippet Value()}
				{balancerPoolAprItem.apr}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{balancerPoolAprItemSelector.aprType}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
