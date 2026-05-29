<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { caip2RouteParamsFromNetworkId } from '$/lib/caip.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import {
		EvmTokenStandard,
		evmTokenStandardByStandard,
	} from '$/constants/Evm.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(transactions)/tx/[transactionId]/token-transfer/[logIndex]',
			{
				...caip2RouteParamsFromNetworkId(entityId.$network),
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
				tokenDecimals: {},
				tokenName: {},
				$from: {},
				$to: {},
				$tokenContract: {},
				$coinInstance: {},
				$case: {
					standard: {
						[EvmTokenStandard.Erc721]: {
							tokenId: {},
						},
						[EvmTokenStandard.Erc1155]: {
							tokenId: {},
						},
					},
				},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
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
				{#snippet children(transfer)}
					{#if showParentTransaction}
						<div>
							<dt>Transaction</dt>
							<dd>
								<a
									href={resolve(
										'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(transactions)/tx/[transactionId]',
										{
											...caip2RouteParamsFromNetworkId(entityId.$network),
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
						<dd>{evmTokenStandardByStandard[transfer.standard].label}</dd>
					</div>

					<div>
						<dt>Amount</dt>
						<dd>
							<NumberValue value={transfer.amount} />
						</dd>
					</div>

					{#if (
						(
							transfer.standard === EvmTokenStandard.Erc721
							|| transfer.standard === EvmTokenStandard.Erc1155
						)
						&& transfer.tokenId !== undefined
					)}
						<div>
							<dt>Token ID</dt>
							<dd>
								<NumberValue value={transfer.tokenId} />
							</dd>
						</div>
					{/if}

					{#if transfer.$from?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>From</dt>
							<dd>
								<EvmNetworkAccountView
									entityId={{
										$network: entityId.$network,
										$actor: transfer.$from[EntityMetaKey.Id],
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if transfer.$to?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>To</dt>
							<dd>
								<EvmNetworkAccountView
									entityId={{
										$network: entityId.$network,
										$actor: transfer.$to[EntityMetaKey.Id],
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if transfer.$coinInstance}
						<div>
							<dt>Token</dt>
							<dd>
								<EvmCoinInstanceView
									entityId={transfer.$coinInstance[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{:else if transfer.$tokenContract}
						<div>
							<dt>Token contract</dt>
							<dd>
								<EvmContractView
									entityId={transfer.$tokenContract[EntityMetaKey.Id]}
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

	{#snippet Details()}
	{/snippet}
</EntityView>
