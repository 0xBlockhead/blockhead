<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			...{
				fields: {
					categoryId: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bitcoinCashCashTokenCategory })}
		{@const bitcoinCashCashTokenCategorySelector = bitcoinCashCashTokenCategory[EntityMetaKey.Selector]}
		{@const network = bitcoinCashCashTokenCategorySelector.$network}
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenCategory}
			entitySelector={bitcoinCashCashTokenCategorySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/cash-token-category/[categoryId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						categoryId: bitcoinCashCashTokenCategorySelector.categoryId,
					}
				)
			}
		>
			{#snippet Title()}
				{bitcoinCashCashTokenCategorySelector.categoryId || 'Bitcoin Cash CashToken category'}
			{/snippet}

			{#snippet Value()}
				{bitcoinCashCashTokenCategorySelector.categoryId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitcoinCashCashTokenCategory.$network.name || `${bitcoinCashCashTokenCategory.$network.caip2.namespace}:${bitcoinCashCashTokenCategory.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
