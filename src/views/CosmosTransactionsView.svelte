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
		title = 'Transactions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosTransaction}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				txHash: true,
				code: true,
				gasUsed: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosTransaction })}
		{@const cosmosTransactionSelector = cosmosTransaction[EntityMetaKey.Selector]}
		{@const network = cosmosTransactionSelector.$network}
		<EntityView
			entityType={EntityType.CosmosTransaction}
			entitySelector={cosmosTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						transactionId: cosmosTransactionSelector.txHash,
					}
				)
			}
		>
			{#snippet Title()}
				{cosmosTransactionSelector.txHash || 'Cosmos transaction'}
			{/snippet}

			{#snippet Value()}
				{cosmosTransactionSelector.txHash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String(cosmosTransaction.code ?? ''), String(cosmosTransaction.gasUsed ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
