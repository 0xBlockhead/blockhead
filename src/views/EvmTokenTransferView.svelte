<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'

	import {
		EvmTokenStandard,
		evmTokenStandardByStandard,
	} from '$/constants/Evm.ts'

	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]/log/[logIndex]', {
			caip2Namespace: selector.$network.caip2.namespace,
			caip2Reference: selector.$network.caip2.reference,
			transactionId: selector.txHash,
			logIndex: String(selector.logIndex),
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		showParentTransaction = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmTokenTransfer>
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
			showParentTransaction?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const transfer = subscribe(EntityType.EvmTokenTransfer,
		selector,
		({ sources: [Source.Blockscout_Rest], fields: { standard: true, amount: true, tokenSymbol: true, ...(open && ({ tokenDecimals: true, tokenName: true, $from: true, $to: true, $tokenContract: true, $coinInstance: true })) } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTokenTransfer}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			log #{selector.logIndex}.{selector.transferIndex}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Token transfer </span>
			<span>
				log #{selector.logIndex}.{selector.transferIndex}
			</span>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Token movement parsed from a receipt log (<code>Transfer</code>, <code>TransferSingle</code>, or indexer-classified ERC-20/721/1155 row).
		</p>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={transfer}
				placeholderText="Loading token transfer…"
			>
				{#snippet children(transfer)}
					{#if showParentTransaction}
						<div>
							<dt>Transaction</dt>
							<dd>
									<a
										href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
											caip2Namespace: selector.$network.caip2.namespace,
											caip2Reference: selector.$network.caip2.reference,
											transactionId: selector.txHash,
										})}
									>
									<TruncatedValue
										value={selector.txHash}
										format={TruncatedValueFormat.Abbr}
									/>
								</a>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Standard</dt>
						<dd>{evmTokenStandardByStandard[transfer.fields.standard].label}</dd>
					</div>

					<div>
						<dt>Amount</dt>
						<dd>
							<NumberValue value={transfer.fields.amount} />
						</dd>
					</div>

					{#if (
						(
							transfer.fields.standard === EvmTokenStandard.Erc721
							|| transfer.fields.standard === EvmTokenStandard.Erc1155
						)
						&& transfer.fields.tokenId !== undefined
					)}
						<div>
							<dt>Token ID</dt>
							<dd>
								<NumberValue value={transfer.fields.tokenId} />
							</dd>
						</div>
					{/if}

					{#if transfer.fields.$from?.[EntityMetaKey.Selector].address !== undefined}
						<div>
							<dt>From</dt>
							<dd>
								<EvmNetworkAccountView
									selector={{
										$network: selector.$network,
										$actor: transfer.fields.$from[EntityMetaKey.Selector],
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if transfer.fields.$to?.[EntityMetaKey.Selector].address !== undefined}
						<div>
							<dt>To</dt>
							<dd>
								<EvmNetworkAccountView
									selector={{
										$network: selector.$network,
										$actor: transfer.fields.$to[EntityMetaKey.Selector],
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if transfer.fields.$coinInstance}
						<div>
							<dt>Token</dt>
							<dd>
								<EvmCoinInstanceView
									selector={transfer.fields.$coinInstance[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{:else if transfer.fields.$tokenContract}
						<div>
							<dt>Token contract</dt>
							<dd>
								<EvmContractView
									selector={transfer.fields.$tokenContract[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
