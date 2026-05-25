<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { evmTokenStandards } from '$/constants/Evm.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]/token-transfer/[logIndex]',
			{
				networkId: String(entityId.$network.chainId),
				transactionId: entityId.$transaction.txHash,
				logIndex: String(entityId.logIndex),
			},
		),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		showParentTransaction = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmTokenTransfer>
			href?: string
			layout?: EntityLayout
			open?: boolean
			showParentTransaction?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const transfer = useEntity(
		EntityType.EvmTokenTransfer,
		entityId,
		{
			$: [Source.Blockscout_Rest],
			standard: {},
			amount: {},
			tokenSymbol: {},
			...(open && {
				tokenId: {},
				tokenDecimals: {},
				tokenName: {},
				$from: {},
				$to: {},
				$tokenContract: {},
				$coinInstance: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTokenTransfer}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			log #{entityId.logIndex}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Token transfer </span>
			{@render Value()}
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
				{#snippet children(loadedTransfer)}
					{#if showParentTransaction}
						<div>
							<dt>Transaction</dt>
							<dd>
								<a
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
										{
										networkId: String(entityId.$network.chainId),
										transactionId: entityId.txHash,
										},
									)}
								>
									<TruncatedValue
										value={entityId.txHash}
										format={TruncatedValueFormat.Abbr}
									/>
								</a>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Standard</dt>
						<dd>{evmTokenStandards[loadedTransfer.standard].label}</dd>
					</div>

					<div>
						<dt>Amount</dt>
						<dd>
							<NumberValue value={loadedTransfer.amount} />
						</dd>
					</div>

					{#if loadedTransfer.$from?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>From</dt>
							<dd>
								<ActorNetworkView
									entityId={{
										$network: entityId.$network,
										$actor: loadedTransfer.$from[EntityMetaKey.Id],
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if loadedTransfer.$to?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>To</dt>
							<dd>
								<ActorNetworkView
									entityId={{
										$network: entityId.$network,
										$actor: loadedTransfer.$to[EntityMetaKey.Id],
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if loadedTransfer.$coinInstance}
						<div>
							<dt>Token</dt>
							<dd>
								<CoinInstanceView
									entityId={loadedTransfer.$coinInstance[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{:else if loadedTransfer.$tokenContract}
						<div>
							<dt>Token contract</dt>
							<dd>
								<EvmContractView
									entityId={loadedTransfer.$tokenContract[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
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

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.EvmTokenTransfer}
			{entityId}
		/>
	{/snippet}
</EntityView>

