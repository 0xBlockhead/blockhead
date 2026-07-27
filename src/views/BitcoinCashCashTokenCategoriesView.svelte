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
		id = 'BitcoinCashCashTokenCategories-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BitcoinCashCashTokenCategory> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinCashCashTokenCategory}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				categoryId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinCashCashTokenCategory })}
		{@const bitcoinCashCashTokenCategorySelector = bitcoinCashCashTokenCategory[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenCategory}
			entitySelector={bitcoinCashCashTokenCategorySelector}
		>
			{#snippet Title()}
				{bitcoinCashCashTokenCategorySelector.categoryId || 'Bitcoin Cash CashToken category'}
			{/snippet}

			{#snippet Value()}
				{bitcoinCashCashTokenCategorySelector.categoryId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitcoinCashCashTokenCategory.$network.name || (bitcoinCashCashTokenCategorySelector.$network.caip2 == null ? '' : `${bitcoinCashCashTokenCategorySelector.$network.caip2.namespace}:${bitcoinCashCashTokenCategorySelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
