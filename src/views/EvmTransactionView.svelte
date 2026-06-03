<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'

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
		entityId,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
			...{ caip2Namespace: entityId.$network.caip2.namespace, caip2Reference: entityId.$network.caip2.reference },
			transactionId: entityId.txHash,
		}),
		title = entityId.txHash,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmTransaction>
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
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const evmTransaction = useEntity(
		EntityType.EvmTransaction,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
				Source.ZeroGChain_JsonRpc,
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
			...(open && {
				nonce: {},
				transactionIndex: {},
				gas: {},
				gasPrice: {},
				effectiveGasPrice: {},
				$case: {
					envelopeType: {
						[EvmTransactionEnvelopeType.FeeMarket]: {
							maxFeePerGas: {},
							maxPriorityFeePerGas: {},
						},
						[EvmTransactionEnvelopeType.Blob]: {
							maxFeePerGas: {},
							maxPriorityFeePerGas: {},
							blobGasUsed: {},
							maxFeePerBlobGas: {},
						},
						[EvmTransactionEnvelopeType.SetCode]: {
							maxFeePerGas: {},
							maxPriorityFeePerGas: {},
						},
					},
				},
			}),
		},
	)


	// (Derived)
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
	{entityId}
	href={href}
	{title}
	idDragPlainText={entityId.txHash}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.transactionId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		Transaction {@render Value()}
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
						<dd>{evmTransactionKindByKind[transaction.kind]?.label ?? String(transaction.kind)}</dd>
					</div>

					<div>
						<dt>Value</dt>
						<dd>
							{#if transaction.value !== undefined}
								<NumberValue value={transaction.value} />
							{/if}
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
							{#if transaction.$block?.[EntityMetaKey.Id].blockNumber !== undefined}
								<EvmBlockView
									entityId={transaction.$block[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						</dd>
					</div>

					<div>
						<dt>From</dt>
						<dd>
							{#if transaction.$from?.[EntityMetaKey.Id].address !== undefined}
								<EvmNetworkAccountView
									entityId={{
										$network: entityId.$network,
										$actor: transaction.$from[EntityMetaKey.Id],
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
							{#if transaction.$to?.[EntityMetaKey.Id].address !== undefined}
								<EvmNetworkAccountView
									entityId={{
										$network: entityId.$network,
										$actor: transaction.$to[EntityMetaKey.Id],
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
							{#if transaction.$contract?.[EntityMetaKey.Id].address !== undefined}
								<EvmContractView
									entityId={transaction.$contract[EntityMetaKey.Id]}
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
								{#if transaction.envelopeType !== undefined}
									{evmTransactionEnvelopeTypeByEnvelopeType[transaction.envelopeType]?.label ?? String(transaction.envelopeType)}
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
										transaction.envelopeType === EvmTransactionEnvelopeType.FeeMarket
										|| transaction.envelopeType === EvmTransactionEnvelopeType.Blob
										|| transaction.envelopeType === EvmTransactionEnvelopeType.SetCode
									)
									&& transaction.maxFeePerGas !== undefined
								)}
									<span>
										max{' '}
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
										priority{' '}
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
	{/snippet}

	{#snippet Details()}
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

			{#snippet SectionEvents({ id: _eventsId, label: _eventsLabel })}
				<EvmLogsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
						...{ caip2Namespace: entityId.$network.caip2.namespace, caip2Reference: entityId.$network.caip2.reference },
						transactionId: entityId.txHash,
					})}
					entityFieldReference={{
						entityType: EntityType.EvmTransaction,
						entityId,
						fieldName: '$$logs',
					}}
					collapsible={false}
					id={`${txIdKey}:events`}
					open={true}
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
					{#snippet children(trace)}
						{#if trace.traceRoot != null}
							<EvmTraceTreeView
								traceRoot={trace.traceRoot}
								chainId={evmChainIdFromCaip2(`${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}`)}
							/>
						{:else if trace.traceUnavailable}
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
						{#if transaction.envelopeType === EvmTransactionEnvelopeType.Blob}
							<EvmBlobsView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmTransaction,
									entityId,
									fieldName: '$$blobs',
								}}
								href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
										...{ caip2Namespace: entityId.$network.caip2.namespace, caip2Reference: entityId.$network.caip2.reference },
										transactionId: entityId.txHash,
									})}
								id={`${txIdKey}:blobs`}
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
						entityId,
						fieldName: '$$userOperations',
					}}
					id={`${txIdKey}:user-operations`}
					open={true}
					title="User operations"
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
