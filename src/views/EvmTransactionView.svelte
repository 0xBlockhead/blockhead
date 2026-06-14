<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'

	import {
		EvmTransactionEnvelopeType,
		evmTransactionEnvelopeTypeByEnvelopeType,
		evmTransactionExecutionStatusByExecutionStatus,
		evmTransactionKindByKind,
	} from '$/constants/Evm.ts'

	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
			...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference },
			transactionId: selector.txHash,
		}),
		title = selector.txHash,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmTransaction>
			title?: string
			/** href override: block-scoped tx URL when listed under `EvmBlock`. */
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { subscribe } from '$/routes/+layout.svelte'

	const evmTransaction = subscribe(EntityType.EvmTransaction,
		selector,
		({ sources: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
				Source.ZeroGChain_JsonRpc,
			], fields: { $block: true, $from: true, $to: true, $contract: true, value: true, kind: true, envelopeType: true, executionStatus: true, gasUsed: true, input: true, ...(open && ({ nonce: true, transactionIndex: true, gas: true, gasPrice: true, effectiveGasPrice: true })) } }),
	)


	// (Derived)
	const txSelectorKey = $derived(
		stringify(selector),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import Heading from '$/components/Heading.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmAssetMovementsView from '$/views/EvmAssetMovementsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmLogsView from '$/views/EvmLogsView.svelte'
	import EvmTraceTreeView from '$/views/EvmTraceTreeView.svelte'
	import EvmTransactionInputDecode from '$/views/EvmTransactionInputDecode.svelte'
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTransaction}
	entitySelector={selector}
	href={href}
	{title}
	idDragPlainText={selector.txHash}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selector.txHash}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		Transaction
		<TruncatedValue
			value={selector.txHash}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Signed execution-layer transaction (legacy or type-2 envelope). From and to are addresses; either may be a contract.
		</p>
		<p>
			ERC-4337 account abstraction wraps intent in <code>UserOperation</code> bundles, paymasters, and optional relay batches—separate from a single externally owned account sending one legacy or type-2 envelope.
		</p>
	{/snippet}

	{#snippet Content({ open })}
		<ResourceBoundary
			resource={evmTransaction}
			placeholderText="Loading transaction…"
		>
			{#snippet children(transaction)}
				<dl data-column-item="center">
					<div>
						<dt>Kind</dt>
						<dd>{evmTransactionKindByKind[transaction.fields.kind]?.label ?? String(transaction.fields.kind)}</dd>
					</div>

					<div>
						<dt>Value</dt>
						<dd>
							{#if transaction.fields.value !== undefined}
								<NumberValue value={transaction.fields.value} />
							{/if}
						</dd>
					</div>

					<div>
						<dt>Status</dt>
						<dd>
							{#if transaction.fields.executionStatus !== undefined}
								{evmTransactionExecutionStatusByExecutionStatus[transaction.fields.executionStatus]?.label ?? String(transaction.fields.executionStatus)}
							{/if}
						</dd>
					</div>

					<div>
						<dt>Gas used</dt>
						<dd>
							{#if transaction.fields.gasUsed !== undefined}
								<NumberValue value={transaction.fields.gasUsed} />
							{/if}
						</dd>
					</div>

					<div>
						<dt>Block</dt>
						<dd>
							{#if transaction.fields.$block?.[EntityMetaKey.Selector].blockNumber !== undefined}
								<EvmBlockView
									selector={transaction.fields.$block[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						</dd>
					</div>

					<div>
						<dt>From</dt>
						<dd>
							{#if transaction.fields.$from?.[EntityMetaKey.Selector].address !== undefined}
								<EvmNetworkAccountView
									selector={{
										$network: selector.$network,
										$actor: transaction.fields.$from[EntityMetaKey.Selector],
									}}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						</dd>
					</div>

					<div>
						<dt>To</dt>
						<dd>
							{#if transaction.fields.$to?.[EntityMetaKey.Selector].address !== undefined}
								<EvmNetworkAccountView
									selector={{
										$network: selector.$network,
										$actor: transaction.fields.$to[EntityMetaKey.Selector],
									}}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						</dd>
					</div>

					<div>
						<dt>Contract</dt>
						<dd>
							{#if transaction.fields.$contract?.[EntityMetaKey.Selector].address !== undefined}
								<EvmContractView
									selector={transaction.fields.$contract[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							{/if}
						</dd>
					</div>

					{#if open}
						<div>
							<dt>Nonce</dt>
							<dd>
								{#if transaction.fields.nonce !== undefined}
									{String(transaction.fields.nonce)}
								{/if}
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Position in block</dt>
							<dd>
								{#if transaction.fields.transactionIndex !== undefined}
									{String(transaction.fields.transactionIndex)}
								{/if}
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Gas limit</dt>
							<dd>
								{#if transaction.fields.gas !== undefined}
									<NumberValue value={transaction.fields.gas} />
								{/if}
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Gas price</dt>
							<dd>
								{#if transaction.fields.gasPrice !== undefined}
									<NumberValue value={transaction.fields.gasPrice} />
								{/if}
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Transaction envelope type</dt>
							<dd>
								{#if transaction.fields.envelopeType !== undefined}
									{evmTransactionEnvelopeTypeByEnvelopeType[transaction.fields.envelopeType]?.label ?? String(transaction.fields.envelopeType)}
								{/if}
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Max fee / priority fee</dt>
							<dd data-row="wrap align-center gap-2">
								{#if (
									(
										transaction.fields.envelopeType === EvmTransactionEnvelopeType.FeeMarket
										|| transaction.fields.envelopeType === EvmTransactionEnvelopeType.Blob
										|| transaction.fields.envelopeType === EvmTransactionEnvelopeType.SetCode
									)
									&& transaction.fields.maxFeePerGas !== undefined
								)}
									<span>
										max{' '}
										<NumberValue value={transaction.fields.maxFeePerGas} />
									</span>
								{/if}
								{#if (
									(
										transaction.fields.envelopeType === EvmTransactionEnvelopeType.FeeMarket
										|| transaction.fields.envelopeType === EvmTransactionEnvelopeType.Blob
										|| transaction.fields.envelopeType === EvmTransactionEnvelopeType.SetCode
									)
									&& transaction.fields.maxPriorityFeePerGas !== undefined
								)}
									<span>
										priority{' '}
										<NumberValue value={transaction.fields.maxPriorityFeePerGas} />
									</span>
								{/if}
								{#if (
									(
										transaction.fields.envelopeType === EvmTransactionEnvelopeType.FeeMarket
										|| transaction.fields.envelopeType === EvmTransactionEnvelopeType.Blob
										|| transaction.fields.envelopeType === EvmTransactionEnvelopeType.SetCode
									)
									&& transaction.fields.maxFeePerGas === undefined
									&& transaction.fields.maxPriorityFeePerGas === undefined
								)}
									<span data-text="muted">Caps not indexed</span>
								{/if}
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Effective gas price</dt>
							<dd>
								{#if transaction.fields.effectiveGasPrice !== undefined}
									<NumberValue value={transaction.fields.effectiveGasPrice} />
								{/if}
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Input data</dt>
							<dd>
								{#if transaction.fields.input !== undefined}
									<TruncatedValue
										value={transaction.fields.input}
										format={TruncatedValueFormat.Abbr}
									/>
								{/if}
							</dd>
						</div>
					{/if}

					{#if open}
						{#if (
							transaction.fields.envelopeType === EvmTransactionEnvelopeType.Blob
							&& transaction.fields.blobGasUsed !== undefined
						)}
							<div>
								<dt>Blob gas used</dt>
								<dd>
									<NumberValue value={transaction.fields.blobGasUsed} />
								</dd>
							</div>
						{/if}
						{#if (
							transaction.fields.envelopeType === EvmTransactionEnvelopeType.Blob
							&& transaction.fields.maxFeePerBlobGas !== undefined
						)}
							<div>
								<dt>Max fee per blob gas</dt>
								<dd>
									<NumberValue value={transaction.fields.maxFeePerBlobGas} />
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			sectionIdPrefix={txSelectorKey}
			sections={[
				{ id: 'movements', label: 'Movements' },
				{ id: 'call', label: 'Call' },
				{ id: 'events', label: 'Events' },
				{ id: 'trace', label: 'Trace' },
				{ id: 'blobs', label: 'Blobs' },
				{ id: 'user-operations', label: 'User operations' },
			]}
			id={`${txSelectorKey}:carousel-execution`}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<Heading>Execution</Heading>
				</header>
			{/snippet}

			{#snippet SectionMovements({ id: _movementsId, label: _movementsLabel })}
				<EvmAssetMovementsView
					CollapsibleProps={{ canToggle: false }}
					{selector}
					id={`${txSelectorKey}:movements`}
					open={true}
				/>
			{/snippet}

			{#snippet SectionCall({ id: _callId, label: _callLabel })}
				<ResourceBoundary
					resource={evmTransaction}
					placeholderText="Loading transaction input…"
				>
					{#snippet children(transaction)}
						{#if transaction.fields.input != null}
							<EvmTransactionInputDecode
								input={transaction.fields.input}
								open={true}
							/>
						{:else}
							<p data-text="muted">No calldata on this transaction.fields.</p>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionEvents({ id: _eventsId, label: _eventsLabel })}
				<EvmLogsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
						...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference },
						transactionId: selector.txHash,
					})}
					entityFieldReference={{
						entityType: EntityType.EvmTransaction,
						selector,
						fieldName: '$$logs',
					}}
					collapsible={false}
					id={`${txSelectorKey}:events`}
					open={true}
					title="Receipt logs"
				/>
			{/snippet}

			{#snippet SectionTrace({ id: _traceId, label: _traceLabel })}
				{@const txTrace = subscribe(EntityType.EvmTransaction,
					selector,
					({ sources: [
							Source.Blockscout_Rest,
							Source.Voltaire_JsonRpc,
						], fields: { traceRoot: true, traceUnavailable: true } }),
				)}
				<ResourceBoundary
					resource={txTrace}
					placeholderText="Loading call trace…"
				>
					{#snippet children(trace)}
						{#if trace.fields.traceRoot != null}
							<EvmTraceTreeView
								traceRoot={trace.fields.traceRoot}
								chainId={evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`)}
							/>
						{:else if trace.fields.traceUnavailable}
							<p data-text="muted">
								Call trace is not available from the configured RPC or explorer for this chain.
							</p>
						{:else}
							<p data-text="muted">No call trace for this transaction.</p>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionBlobs({ id: _blobsId, label: _blobsLabel })}
				<ResourceBoundary
					resource={evmTransaction}
					placeholderText=""
				>
					{#snippet children(transaction)}
						{#if transaction.fields.envelopeType === EvmTransactionEnvelopeType.Blob}
							<EvmBlobsView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmTransaction,
									selector,
									fieldName: '$$blobs',
								}}
								href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
										...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference },
										transactionId: selector.txHash,
									})}
								id={`${txSelectorKey}:blobs`}
								open={true}
								title="Blob sidecars"
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionUserOperations({ id: _userOpsId, label: _userOpsLabel })}
				<EvmUserOperationsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.EvmTransaction,
						selector,
						fieldName: '$$userOperations',
					}}
					id={`${txSelectorKey}:user-operations`}
					open={true}
					title="User operations"
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
