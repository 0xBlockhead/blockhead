<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'

	import {
		EvmTransactionEnvelopeType,
		evmTransactionEnvelopeTypes,
		evmTransactionExecutionStatuses,
		evmTransactionKinds,
	} from '$/constants/Evm.ts'

	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
			{
				networkId: String(entityId.$network.chainId),
				transactionId: entityId.txHash,
			},
		),
		title = entityId.txHash,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmTransaction>
			title?: string
			/** href override: block-scoped tx URL when listed under `EvmBlock`. */
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const evmTransaction = useEntity(
		EntityType.EvmTransaction,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			],
			$block: {},
			$from: {},
			$to: {},
			$contract: {},
			value: {},
			kind: {},
			envelopeType: {},
			executionStatus: {},
			gasUsed: {},
			input: {},
			...(open ?
				{
					nonce: {},
					transactionIndex: {},
					gas: {},
					gasPrice: {},
					maxFeePerGas: {},
					maxPriorityFeePerGas: {},
					effectiveGasPrice: {},
					blobGasUsed: {},
					maxFeePerBlobGas: {},
				}
			:
				{}),
		},
	)


	const txIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import Heading from '$/components/Heading.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
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
	{entityId}
	href={href}
	{title}
	idDragPlainText={entityId.txHash}
	bind:open
	{...EntityViewProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Signed execution-layer transaction (legacy or type-2 envelope). From and to are addresses; either may be a contract.
		</p>
		<p>
			ERC-4337 account abstraction wraps intent in <code>UserOperation</code> bundles, paymasters, and optional relay batches—separate from a single externally owned account sending one legacy or type-2 envelope.
		</p>
	{/snippet}

	{#snippet Content(context)}
		{@const contentOpen = context?.open ?? false}
		<ResourceBoundary
			resource={evmTransaction}
			placeholderText="Loading transaction…"
		>
			{#snippet children(loadedTransaction)}
				<dl data-column-item="center">
					<div>
						<dt>Kind</dt>
						<dd>{evmTransactionKinds[loadedTransaction.kind].label}</dd>
					</div>

					<div>
						<dt>Value</dt>
						<dd>
							{#if loadedTransaction.value !== undefined}
								<NumberValue value={loadedTransaction.value} />
							{/if}
						</dd>
					</div>

					<div>
						<dt>Status</dt>
						<dd>
							{#if loadedTransaction.executionStatus !== undefined}
								{evmTransactionExecutionStatuses[loadedTransaction.executionStatus].label}
							{/if}
						</dd>
					</div>

					<div>
						<dt>Gas used</dt>
						<dd>
							{#if loadedTransaction.gasUsed !== undefined}
								<NumberValue value={loadedTransaction.gasUsed} />
							{/if}
						</dd>
					</div>

					<div>
						<dt>Block</dt>
						<dd>
							{#if loadedTransaction.$block?.[EntityMetaKey.Id].blockNumber !== undefined}
								<EvmBlockView
									entityId={loadedTransaction.$block[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						</dd>
					</div>

					<div>
						<dt>From</dt>
						<dd>
							{#if loadedTransaction.$from?.[EntityMetaKey.Id].address !== undefined}
								<ActorNetworkView
									entityId={{
										$network: entityId.$network,
										$actor: loadedTransaction.$from[EntityMetaKey.Id],
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						</dd>
					</div>

					<div>
						<dt>To</dt>
						<dd>
							{#if loadedTransaction.$to?.[EntityMetaKey.Id].address !== undefined}
								<ActorNetworkView
									entityId={{
										$network: entityId.$network,
										$actor: loadedTransaction.$to[EntityMetaKey.Id],
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						</dd>
					</div>

					<div>
						<dt>Contract</dt>
						<dd>
							{#if loadedTransaction.$contract?.[EntityMetaKey.Id].address !== undefined}
								<EvmContractView
									entityId={loadedTransaction.$contract[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
									open={false}
									showTypeAnnotation={false}
								/>
							{/if}
						</dd>
					</div>

					{#if contentOpen}
						<div>
							<dt>Nonce</dt>
							<dd>
								{#if loadedTransaction.nonce !== undefined}
									{String(loadedTransaction.nonce)}
								{/if}
							</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Position in block</dt>
							<dd>
								{#if loadedTransaction.transactionIndex !== undefined}
									{String(loadedTransaction.transactionIndex)}
								{/if}
							</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Gas limit</dt>
							<dd>
								{#if loadedTransaction.gas !== undefined}
									<NumberValue value={loadedTransaction.gas} />
								{/if}
							</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Gas price (legacy type 0/1)</dt>
							<dd>
								{#if loadedTransaction.gasPrice !== undefined}
									<NumberValue value={loadedTransaction.gasPrice} />
								{/if}
							</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Transaction envelope type</dt>
							<dd>
								{#if loadedTransaction.envelopeType !== undefined}
									{evmTransactionEnvelopeTypes[loadedTransaction.envelopeType].label}
								{/if}
							</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>EIP-1559 max fee / priority (type 2)</dt>
							<dd data-row="wrap align-center gap-2">
								{#if (
									loadedTransaction.envelopeType === EvmTransactionEnvelopeType.FeeMarket
									&& loadedTransaction.maxFeePerGas !== undefined
								)}
									<span>
										max{' '}
										<NumberValue value={loadedTransaction.maxFeePerGas} />
									</span>
								{/if}
								{#if (
									loadedTransaction.envelopeType === EvmTransactionEnvelopeType.FeeMarket
									&& loadedTransaction.maxPriorityFeePerGas !== undefined
								)}
									<span>
										priority{' '}
										<NumberValue value={loadedTransaction.maxPriorityFeePerGas} />
									</span>
								{/if}
								{#if (
									loadedTransaction.envelopeType === EvmTransactionEnvelopeType.FeeMarket
									&& loadedTransaction.maxFeePerGas === undefined
									&& loadedTransaction.maxPriorityFeePerGas === undefined
								)}
									<span data-text="muted">Caps not indexed</span>
								{/if}
							</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Effective gas price paid (base + tip after inclusion)</dt>
							<dd>
								{#if loadedTransaction.effectiveGasPrice !== undefined}
									<NumberValue value={loadedTransaction.effectiveGasPrice} />
								{/if}
							</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Input data</dt>
							<dd>
								{#if loadedTransaction.input !== undefined}
									<TruncatedValue
										value={loadedTransaction.input}
										format={TruncatedValueFormat.Abbr}
									/>
								{/if}
							</dd>
						</div>
					{/if}

					{#if contentOpen}
						{#if (
							loadedTransaction.envelopeType === EvmTransactionEnvelopeType.Blob
							&& loadedTransaction.blobGasUsed !== undefined
						)}
							<div>
								<dt>Blob gas used</dt>
								<dd>
									<NumberValue value={loadedTransaction.blobGasUsed} />
								</dd>
							</div>
						{/if}
						{#if (
							loadedTransaction.envelopeType === EvmTransactionEnvelopeType.Blob
							&& loadedTransaction.maxFeePerBlobGas !== undefined
						)}
							<div>
								<dt>Max fee per blob gas</dt>
								<dd>
									<NumberValue value={loadedTransaction.maxFeePerBlobGas} />
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details(context)}
		{@const _detailsOpen = context?.open ?? false}
		<EntityDetails
			entityType={EntityType.EvmTransaction}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				sectionIdPrefix={txIdKey}
				sections={[
					{ id: 'movements', label: 'Movements' },
					{ id: 'call', label: 'Call' },
					{ id: 'events', label: 'Events' },
					{ id: 'trace', label: 'Trace' },
					{ id: 'blobs', label: 'Blobs' },
					{ id: 'user-operations', label: 'User operations' },
				]}
				id={`${txIdKey}:carousel-execution`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary(context)}
					{@const _summaryOpen = context?.open ?? false}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<Heading>Execution</Heading>
					</header>
				{/snippet}

				{#snippet SectionMovements({ id: _movementsId, label: _movementsLabel })}
					<EvmAssetMovementsView
						{entityId}
						id={`${txIdKey}:movements`}
						open={true}
					/>
				{/snippet}

				{#snippet SectionCall({ id: _callId, label: _callLabel })}
					<ResourceBoundary
						resource={evmTransaction}
						placeholderText="Loading transaction input…"
					>
						{#snippet children(loadedTransaction)}
							{#if loadedTransaction.input != null}
								<EvmTransactionInputDecode
									input={loadedTransaction.input}
									open={true}
								/>
							{:else}
								<p data-text="muted">No calldata on this transaction.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionEvents({ id: _eventsId, label: _eventsLabel })}
					<EvmLogsView
						href={resolve(
							'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
							{
							networkId: String(entityId.$network.chainId),
							transactionId: entityId.txHash,
							},
	)}
						entityFieldReference={{
							entityType: EntityType.EvmTransaction,
							entityId,
							fieldName: '$$logs',
						}}
						collapsible={false}
						id={`${txIdKey}:events`}
						open={true}
						showTypeAnnotation={false}
						title="Receipt logs"
					/>
				{/snippet}

				{#snippet SectionTrace({ id: _traceId, label: _traceLabel })}
					{@const txTrace = useEntity(
						EntityType.EvmTransaction,
						entityId,
						{
							$: [
								Source.Blockscout_Rest,
								Source.Voltaire_JsonRpc,
							],
							traceRoot: {},
							traceUnavailable: {},
						},
					)}
					<ResourceBoundary
						resource={txTrace}
						placeholderText="Loading call trace…"
					>
						{#snippet children(loadedTrace)}
							{#if loadedTrace.traceRoot != null}
								<EvmTraceTreeView
									traceRoot={loadedTrace.traceRoot}
									chainId={entityId.$network.chainId}
								/>
							{:else if loadedTrace.traceUnavailable}
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
						{#snippet children(loadedTransaction)}
							{#if loadedTransaction.envelopeType === EvmTransactionEnvelopeType.Blob}
								<EvmBlobsView
									entityFieldReference={{
										entityType: EntityType.EvmTransaction,
										entityId,
										fieldName: '$$blobs',
									}}
									collapsible={false}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
										{
										networkId: String(entityId.$network.chainId),
										transactionId: entityId.txHash,
										},
									)}
									id={`${txIdKey}:blobs`}
									open={true}
									showTypeAnnotation={false}
									title="Blob sidecars"
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionUserOperations({ id: _userOpsId, label: _userOpsLabel })}
					<EvmUserOperationsView
						entityFieldReference={{
							entityType: EntityType.EvmTransaction,
							entityId,
							fieldName: '$$userOperations',
						}}
						collapsible={false}
						id={`${txIdKey}:user-operations`}
						open={true}
						showTypeAnnotation={false}
						title="User operations"
					/>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

