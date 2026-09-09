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
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AlgorandTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandTransaction}
	bind:open
	resource={
		selection({
			fields: {
				txId: true,
				transactionType: true,
				sender: true,
			},
		})
	}
>
	{#snippet Item({ item: algorandTransaction })}
		{@const algorandTransactionSelector = algorandTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AlgorandTransaction}
			entitySelector={algorandTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/transaction/[txId=stringSegment]',
					{
						network: (
							'caip2' in algorandTransactionSelector.$network.$network ?
								caip2StringFromValue(algorandTransactionSelector.$network.$network.caip2)
							:
								algorandTransactionSelector.$network.$network.slug
						),
						txId: algorandTransactionSelector.txId,
					}
				)
			}
		>
			{#snippet Title()}
				{algorandTransactionSelector.txId || 'algorand transaction'}
			{/snippet}

			{#snippet Value()}
				{algorandTransaction.transactionType}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{algorandTransaction.sender}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
