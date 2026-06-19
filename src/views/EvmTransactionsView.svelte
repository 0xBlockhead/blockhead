<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
import type { WithRest } from '$/typescript/WithRest.ts'
import { stringify } from 'devalue'
import { ListOrientation } from '$/components/ListOrientation.ts'

type EvmTransactionsResource = EntityProxyFieldResource<
	typeof schema,
	EntityType.EvmBlock,
	'$$transactions'
> | EntityProxyFieldResource<
	typeof schema,
	EntityType.EvmNetwork,
	'$$transactions'
> | EntityProxyFieldResource<
	typeof schema,
	EntityType.EvmNetworkAccount,
	'$$transactions'
>

type EvmBlockNumberSelector = Extract<
	EntitySelector<typeof schema, EntityType.EvmBlock>,
	{ readonly blockNumber: bigint }
>


import { resolve } from '$app/paths'


	// State
	let {
		selection,
		blockSelector,
		title = 'Transactions',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EvmTransactionsResource
			blockSelector?: EvmBlockNumberSelector
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmTransaction}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Signed execution payloads included in a block or sitting in the mempool: gas fields, type (legacy/EIP-1559/blob), and logs follow that network’s rules.
		</p>
		<p>
			Receipts add cumulative gas used, contract status, and receipt logs—full detail is only available once the tx is mined and indexed.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No transactions yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection}
				placeholderText="Loading transactions…"
			>
				{#snippet children(transactions)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.EvmTransaction}
						getKey={(transaction) => stringify(transaction.entitySelector)}
						getSortValue={(transaction) => stringify(transaction.entitySelector)}
						placeholderText="Loading transactions…"
						items={transactions.entities}
						{title}
						open={true}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No transactions yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							{@const t = item.entitySelector}
							{#if blockSelector}
								<!-- href override: tx detail under block route, not network /transactions/tx -->
								<EvmTransactionView
										selection={select(EntityType.EvmTransaction, t)}
											href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]/(block)/(transactions)/tx/[transactionId=evmTxHash]', {
											caip2: `${blockSelector.$network.caip2.namespace}:${blockSelector.$network.caip2.reference}`,
											blockNumber: String(blockSelector.blockNumber),
											transactionId: t.txHash,
										})}
									layout={EntityLayout.Summary}

									collapsible={false}
									showTypeAnnotation={false}
								/>
							{:else}
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, t)}
									layout={EntityLayout.Summary}

									collapsible={false}
									showTypeAnnotation={false}
								/>
							{/if}
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
