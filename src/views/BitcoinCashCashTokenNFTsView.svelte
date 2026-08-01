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
		id = 'BitcoinCashCashTokenNFTs-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BitcoinCashCashTokenNft> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinCashCashTokenNft}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				capability: true,
				$category: true,
				$commitment: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinCashCashTokenNft })}
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenNft}
			entitySelector={bitcoinCashCashTokenNft[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{bitcoinCashCashTokenNft.capability || 'Bitcoin Cash CashToken NFT'}
			{/snippet}

			{#snippet Value()}
				{bitcoinCashCashTokenNft.$category.categoryId || 'Bitcoin Cash CashToken category'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitcoinCashCashTokenNft.$commitment == null ? '' : bitcoinCashCashTokenNft.$commitment.commitmentHex || 'Bitcoin Cash CashToken commitment'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
