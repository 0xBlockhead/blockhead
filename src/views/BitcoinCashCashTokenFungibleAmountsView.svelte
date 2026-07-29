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
	}: EntityListViewProps<EntityType.BitcoinCashCashTokenFungibleAmount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
	bind:open
	resource={
		selection({
			fields: {
				amount: true,
				$category: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinCashCashTokenFungibleAmount })}
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
			entitySelector={bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{bitcoinCashCashTokenFungibleAmount.amount}
			{/snippet}

			{#snippet Value()}
				{bitcoinCashCashTokenFungibleAmount.amount}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitcoinCashCashTokenFungibleAmount.$category.categoryId || 'Bitcoin Cash CashToken category'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
