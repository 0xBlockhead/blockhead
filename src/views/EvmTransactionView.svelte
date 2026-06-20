<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import {
		EntityProxyField,
		type EntityProxyResource,
	} from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

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
		selection,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
			caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
			transactionId: selection.entitySelector.txHash,
		}),
		title = selection.entitySelector.txHash,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmTransaction>
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
	import { select } from '$/routes/+layout.svelte'

	const isZeroGTransaction = $derived(
		selection.entitySelector.$network.caip2.namespace === 'eip155'
		&& selection.entitySelector.$network.caip2.reference === '16661',
	)
	const evmTransaction = $derived(selection( {
		sources: isZeroGTransaction ?
			[
				Source.ZeroGChain_JsonRpc,
			]
		:
			[
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			],
	}))
	const block = $derived(evmTransaction.$block)
	const to = $derived(evmTransaction.$to)
	const contract = $derived(evmTransaction.$contract)
	const value = $derived(evmTransaction[EntityProxyField]('value'))
	const kind = $derived(evmTransaction.kind)
	const envelopeType = $derived(evmTransaction.envelopeType)
	const executionStatus = $derived(evmTransaction.executionStatus)
	const gasUsed = $derived(evmTransaction.gasUsed)
	const cumulativeGasUsed = $derived(evmTransaction.cumulativeGasUsed)
	const input = $derived(evmTransaction.input)
	const nonce = $derived(evmTransaction.nonce)
	const transactionIndex = $derived(evmTransaction.transactionIndex)
	const r = $derived(evmTransaction.r)
	const s = $derived(evmTransaction.s)
	const v = $derived(evmTransaction.v)
	const gas = $derived(evmTransaction.gas)
	const gasPrice = $derived(evmTransaction.gasPrice)
	const effectiveGasPrice = $derived(evmTransaction.effectiveGasPrice)
	const maxFeePerGas = $derived(evmTransaction.maxFeePerGas)
	const maxPriorityFeePerGas = $derived(evmTransaction.maxPriorityFeePerGas)
	const blobGasUsed = $derived(evmTransaction.blobGasUsed)
	const maxFeePerBlobGas = $derived(evmTransaction.maxFeePerBlobGas)
	
	const traceUnavailable = $derived(evmTransaction.traceUnavailable({
		sources: isZeroGTransaction ? [] : [Source.Blockscout_Rest],
	}))
	const traceRoot = $derived(evmTransaction.traceRoot({
		sources: isZeroGTransaction ? [] : [Source.Blockscout_Rest],
	}))


	// (Derived)
	const txSelectorKey = $derived(
		stringify(selection.entitySelector),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import Heading from '$/components/Heading.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
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
	entitySelector={selection.entitySelector}
	href={href}
	{title}
	idDragPlainText={selection.entitySelector.txHash}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.txHash}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		Transaction
		<TruncatedValue
			value={selection.entitySelector.txHash}
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
		{#if open}
			<ResourceBoundary
				resource={evmTransaction}
				placeholderText="Loading transaction…"
			>
				{#snippet children(transaction)}
					<dl data-column-item="center">
						<div>
							<dt>Kind</dt>
							<dd>{evmTransactionKindByKind[transaction.kind]?.label ?? String(transaction.kind)}</dd>
						</div>

						<div>
							<dt>Value</dt>
							<dd>
								<ResourceBoundary
									resource={value}
									placeholderText="Loading transaction value…"
								>
									{#snippet children(value)}
										<NumberValue {value} />
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>

						<div>
							<dt>Status</dt>
							<dd>
								{#if transaction.executionStatus !== undefined}
									{evmTransactionExecutionStatusByExecutionStatus[transaction.executionStatus]?.label ?? String(transaction.executionStatus)}
								{/if}
							</dd>
						</div>

						<div>
							<dt>Gas used</dt>
							<dd>
								{#if transaction.gasUsed !== undefined}
									<NumberValue value={transaction.gasUsed} />
								{/if}
							</dd>
						</div>

						<div>
							<dt>Block</dt>
							<dd>
								{#if transaction.$block?.entitySelector !== undefined && 'blockNumber' in transaction.$block.entitySelector}
									<EvmBlockView
										selection={select(EntityType.EvmBlock, transaction.$block.entitySelector)}
										layout={EntityLayout.Value}

										open={false}
										/>
								{/if}
							</dd>
						</div>

							<div>
								<dt>From</dt>
								<dd>
									{#if transaction.$from?.entitySelector.address !== undefined}
										<TruncatedValue
											value={transaction.$from.entitySelector.address}
											format={TruncatedValueFormat.Abbr}
										/>
									{/if}
								</dd>
							</div>

						<div>
							<dt>To</dt>
							<dd>
								{#if transaction.$to?.entitySelector.address !== undefined}
									<TruncatedValue
										value={transaction.$to.entitySelector.address}
										format={TruncatedValueFormat.Abbr}
									/>
								{/if}
							</dd>
						</div>

						<div>
							<dt>Contract</dt>
							<dd>
								{#if transaction.$contract?.entitySelector.address !== undefined}
									<EvmContractView
										selection={select(EntityType.EvmContract, transaction.$contract.entitySelector)}
										layout={EntityLayout.Value}

										showTypeAnnotation={false}
										open={false}
										/>
								{/if}
							</dd>
						</div>

						{#if open}
							<div>
								<dt>Nonce</dt>
								<dd>
									{#if transaction.nonce !== undefined}
										{String(transaction.nonce)}
									{/if}
								</dd>
							</div>
						{/if}

						{#if open}
							<div>
								<dt>Position in block</dt>
								<dd>
									{#if transaction.transactionIndex !== undefined}
										{String(transaction.transactionIndex)}
									{/if}
								</dd>
							</div>
						{/if}

						{#if open}
							<div>
								<dt>Gas limit</dt>
								<dd>
									{#if transaction.gas !== undefined}
										<NumberValue value={transaction.gas} />
									{/if}
								</dd>
							</div>
						{/if}

						{#if open}
							<div>
								<dt>Gas price</dt>
								<dd>
									{#if transaction.gasPrice !== undefined}
										<NumberValue value={transaction.gasPrice} />
									{/if}
								</dd>
							</div>
						{/if}

						{#if open}
							<div>
								<dt>Transaction envelope type</dt>
								<dd>
									{evmTransactionEnvelopeTypeByEnvelopeType[transaction.envelopeType]?.label ?? String(transaction.envelopeType)}
								</dd>
							</div>
						{/if}

						{#if open}
							<div>
								<dt>Max fee / priority fee</dt>
								<dd data-row="wrap align-center gap-2">
									{#if (
										(
											transaction.envelopeType === EvmTransactionEnvelopeType.FeeMarket
											|| transaction.envelopeType === EvmTransactionEnvelopeType.Blob
											|| transaction.envelopeType === EvmTransactionEnvelopeType.SetCode
										)
										&& transaction.maxFeePerGas !== undefined
									)}
										<span>
											max
											<NumberValue value={transaction.maxFeePerGas} />
										</span>
									{/if}
									{#if (
										(
											transaction.envelopeType === EvmTransactionEnvelopeType.FeeMarket
											|| transaction.envelopeType === EvmTransactionEnvelopeType.Blob
											|| transaction.envelopeType === EvmTransactionEnvelopeType.SetCode
										)
										&& transaction.maxPriorityFeePerGas !== undefined
									)}
										<span>
											priority
											<NumberValue value={transaction.maxPriorityFeePerGas} />
										</span>
									{/if}
									{#if (
										(
											transaction.envelopeType === EvmTransactionEnvelopeType.FeeMarket
											|| transaction.envelopeType === EvmTransactionEnvelopeType.Blob
											|| transaction.envelopeType === EvmTransactionEnvelopeType.SetCode
										)
										&& transaction.maxFeePerGas === undefined
										&& transaction.maxPriorityFeePerGas === undefined
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
									{#if transaction.effectiveGasPrice !== undefined}
										<NumberValue value={transaction.effectiveGasPrice} />
									{/if}
								</dd>
							</div>
						{/if}

						{#if open}
							<div>
								<dt>Input data</dt>
								<dd>
									{#if transaction.input !== undefined}
										<TruncatedValue
											value={transaction.input}
											format={TruncatedValueFormat.Abbr}
										/>
									{/if}
								</dd>
							</div>
						{/if}

						{#if open}
							<div>
								<dt>Signature</dt>
								<dd data-row="wrap align-center gap-2">
									{#if transaction.r !== undefined}
										<span>
											r
											<TruncatedValue
												value={transaction.r}
												format={TruncatedValueFormat.Abbr}
											/>
										</span>
									{/if}
									{#if transaction.s !== undefined}
										<span>
											s
											<TruncatedValue
												value={transaction.s}
												format={TruncatedValueFormat.Abbr}
											/>
										</span>
									{/if}
									{#if transaction.v !== undefined}
										<span>v {transaction.v}</span>
									{/if}
								</dd>
							</div>
						{/if}

						{#if open}
							{#if (
								transaction.envelopeType === EvmTransactionEnvelopeType.Blob
								&& transaction.blobGasUsed !== undefined
							)}
								<div>
									<dt>Blob gas used</dt>
									<dd>
										<NumberValue value={transaction.blobGasUsed} />
									</dd>
								</div>
							{/if}
							{#if (
								transaction.envelopeType === EvmTransactionEnvelopeType.Blob
								&& transaction.maxFeePerBlobGas !== undefined
							)}
								<div>
									<dt>Max fee per blob gas</dt>
									<dd>
										<NumberValue value={transaction.maxFeePerBlobGas} />
									</dd>
								</div>
							{/if}
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			sectionIdPrefix={txSelectorKey}
				sections={[
					...(!isZeroGTransaction ? [
						{ id: 'movements', label: 'Movements' },
					] : []),
					{ id: 'call', label: 'Call' },
					...(!isZeroGTransaction ? [
						{ id: 'events', label: 'Events' },
						{ id: 'trace', label: 'Trace' },
						{ id: 'blobs', label: 'Blobs' },
						{ id: 'user-operations', label: 'User operations' },
					] : []),
				]}
			id={`${txSelectorKey}:carousel-execution`}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<Heading>Execution</Heading>
				</header>
			{/snippet}

				{#if !isZeroGTransaction}
					{#snippet SectionMovements({ id: _movementsId, label: _movementsLabel })}
						<EvmAssetMovementsView
							CollapsibleProps={{ canToggle: false }}
							selection={selection}
							id={`${txSelectorKey}:movements`}
						/>
					{/snippet}
				{/if}

			{#snippet SectionCall({ id: _callId, label: _callLabel })}
				<ResourceBoundary
						resource={evmTransaction}
						placeholderText="Loading transaction input…"
					>
						{#snippet children(transaction)}
							{#if transaction.input != null}
								<EvmTransactionInputDecode
									input={transaction.input}
									open={true}
								/>
							{:else}
								<p data-text="muted">No calldata on this transaction.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#if !isZeroGTransaction}
					{#snippet SectionEvents({ id: _eventsId, label: _eventsLabel })}
						<EvmLogsView
							CollapsibleProps={{ canToggle: false }}
							href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
								transactionId: selection.entitySelector.txHash,
							})}
							selection={selection.$$logs}
							collapsible={false}
							id={`${txSelectorKey}:events`}
							open={true}
							title="Receipt logs"
						/>
					{/snippet}

					{#snippet SectionTrace({ id: _traceId, label: _traceLabel })}
						<ResourceBoundary
							resource={traceRoot}
							placeholderText="Loading call trace…"
						>
							{#snippet children(traceRoot)}
								{#if traceRoot != null}
									<EvmTraceTreeView
										traceRoot={traceRoot}
										chainId={evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`)}
									/>
								{:else}
									<ResourceBoundary
										resource={traceUnavailable}
										placeholderText="Loading call trace…"
									>
										{#snippet children(traceUnavailable)}
											{#if traceUnavailable}
												<p data-text="muted">
													Call trace is not available from the configured RPC or explorer for this chain.
												</p>
											{:else}
												<p data-text="muted">No call trace for this transaction.</p>
											{/if}
										{/snippet}
									</ResourceBoundary>
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
								{#if transaction.envelopeType === EvmTransactionEnvelopeType.Blob}
									<EvmBlobsView
										CollapsibleProps={{ canToggle: false }}
										selection={evmTransaction.$$blobs({
											sources: [
												Source.Voltaire_JsonRpc,
											],
										})}
										href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
											caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
											transactionId: selection.entitySelector.txHash,
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
							selection={selection.$$userOperations}
							id={`${txSelectorKey}:user-operations`}
							title="User operations"
						/>
					{/snippet}
				{/if}
			</CollapsibleTabs>
		{/snippet}
	</EntityView>
