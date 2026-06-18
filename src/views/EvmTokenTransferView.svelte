<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'

	import {
		EvmTokenStandard,
		evmTokenStandardByStandard,
	} from '$/constants/Evm.ts'

	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/log/[logIndex=nonNegativeInteger]', {
			caip2: `${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`,
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

	const transfer = $derived(select(EntityType.EvmTokenTransfer, selector, {
		sources: [Source.Blockscout_Rest],
	}))
	const standard = $derived(transfer.standard)
	
	
	
	
	
	


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
			{#if showParentTransaction}
				<div>
					<dt>Transaction</dt>
					<dd>
						<a
							href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`,
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

			<ResourceBoundary
				resource={standard}
				placeholderText="Loading token standard…"
			>
				{#snippet children(standard)}
					<div>
						<dt>Standard</dt>
						<dd>{evmTokenStandardByStandard[standard].label}</dd>
					</div>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={transfer.amount}
				placeholderText="Loading token amount…"
			>
				{#snippet children(amount)}
					<div>
						<dt>Amount</dt>
						<dd>
							<NumberValue value={amount} />
						</dd>
					</div>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={standard}
				placeholderText="Loading token ID…"
			>
				{#snippet children(standard)}
					{#if (
						standard === EvmTokenStandard.Erc721
						|| standard === EvmTokenStandard.Erc1155
					)}
						<ResourceBoundary
							resource={transfer.tokenId}
							placeholderText="Loading token ID…"
						>
							{#snippet children(tokenId)}
								{#if tokenId !== undefined}
									<div>
										<dt>Token ID</dt>
										<dd>
											<NumberValue value={tokenId} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={transfer.$from}
				placeholderText="Loading sender…"
			>
				{#snippet children(from)}
					{#if from}
						<div>
							<dt>From</dt>
							<dd>
								<EvmNetworkAccountView
									selector={{
										$network: selector.$network,
										$actor: from.entitySelector,
									}}
									layout={EntityLayout.Title}

									open={false}
									/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={transfer.$to}
				placeholderText="Loading recipient…"
			>
				{#snippet children(to)}
					{#if to}
						<div>
							<dt>To</dt>
							<dd>
								<EvmNetworkAccountView
									selector={{
										$network: selector.$network,
										$actor: to.entitySelector,
									}}
									layout={EntityLayout.Title}

									open={false}
									/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={transfer.$coinInstance}
				placeholderText="Loading token…"
			>
				{#snippet children(coinInstance)}
					{#if coinInstance}
						<div>
							<dt>Token</dt>
							<dd>
								<EvmCoinInstanceView
									selector={coinInstance.entitySelector}
									layout={EntityLayout.Value}

									showTypeAnnotation={false}
									open={false}
									/>
							</dd>
						</div>
					{:else}
						<ResourceBoundary
							resource={transfer.$tokenContract}
							placeholderText="Loading token contract…"
						>
							{#snippet children(tokenContract)}
								{#if tokenContract}
									<div>
										<dt>Token contract</dt>
										<dd>
											<EvmContractView
												selector={tokenContract.entitySelector}
												layout={EntityLayout.Value}

												showTypeAnnotation={false}
												open={false}
												/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
