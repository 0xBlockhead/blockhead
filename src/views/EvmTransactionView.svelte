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
		evmTransactionEnvelopeTypeLabelById,
		evmTransactionExecutionStatusLabelById,
		evmTransactionKindLabelById,
	} from '$/constants/EvmTransaction.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children: _children,
		entityId,
		title = 'Transaction',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmTransaction>
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'TypeAnnotationTooltip'
		>
	> = $props()

	const txIdKey = $derived(
		stringify(entityId),
	)


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
	{title}
	{href}
	idDragPlainText={entityId.txHash}
	bind:open
	{...entityViewRest}
>
	{#snippet Value()}
		<span data-tx-hash={entityId.txHash}>
			<TruncatedValue
				value={entityId.txHash}
				format={TruncatedValueFormat.Abbr}
			/>
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}

		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Signed execution-layer transaction (legacy or type-2 envelope). From and to are addresses; either may be a contract.
		</p>
		<p>
			ERC-4337 account abstraction wraps intent in <code>UserOperation</code> bundles, paymasters, and optional relay batches—separate from a single externally owned account sending one legacy or type-2 envelope.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>
					<ResourceBoundary
						resource={evmTransaction}
						placeholderText="Loading transaction…"
					>
						{#snippet children(evmTransaction)}
							{evmTransactionKindLabelById[evmTransaction.kind]}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Value</dt>
				<dd>
					<ResourceBoundary
						resource={evmTransaction}
						placeholderText="Loading transaction…"
					>
						{#snippet children(evmTransaction)}
							{#if evmTransaction.value !== undefined}
								<NumberValue value={evmTransaction.value} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Status</dt>
				<dd>
					<ResourceBoundary
						resource={evmTransaction}
						placeholderText="Loading transaction…"
					>
						{#snippet children(evmTransaction)}
							{#if evmTransaction.executionStatus !== undefined}
								{evmTransactionExecutionStatusLabelById[evmTransaction.executionStatus]}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Gas used</dt>
				<dd>
					<ResourceBoundary
						resource={evmTransaction}
						placeholderText="Loading transaction…"
					>
						{#snippet children(evmTransaction)}
							{#if evmTransaction.gasUsed !== undefined}
								<NumberValue value={evmTransaction.gasUsed} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block</dt>
				<dd>
					<ResourceBoundary
						resource={evmTransaction}
						placeholderText="Loading transaction…"
					>
						{#snippet children(evmTransaction)}
							{#if evmTransaction.$block?.[EntityMetaKey.Id].blockNumber !== undefined}
								<EvmBlockView
									entityId={evmTransaction.$block[EntityMetaKey.Id]}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
										{
											networkId: String(entityId.$network.chainId),
											blockNumber: String(evmTransaction.$block[EntityMetaKey.Id].blockNumber),
										},
									)}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>From</dt>
				<dd>
					<ResourceBoundary
						resource={evmTransaction}
						placeholderText="Loading transaction…"
					>
						{#snippet children(evmTransaction)}
							{#if evmTransaction.$from?.[EntityMetaKey.Id].address !== undefined}
								<ActorNetworkView
									entityId={{
										$network: entityId.$network,
										$actor: evmTransaction.$from[EntityMetaKey.Id],
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
										{
											networkId: String(entityId.$network.chainId),
											address: evmTransaction.$from[EntityMetaKey.Id].address,
										},
									)}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>To</dt>
				<dd>
					<ResourceBoundary
						resource={evmTransaction}
						placeholderText="Loading transaction…"
					>
						{#snippet children(evmTransaction)}
							{#if evmTransaction.$to?.[EntityMetaKey.Id].address !== undefined}
								<ActorNetworkView
									entityId={{
										$network: entityId.$network,
										$actor: evmTransaction.$to[EntityMetaKey.Id],
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
										{
											networkId: String(entityId.$network.chainId),
											address: evmTransaction.$to[EntityMetaKey.Id].address,
										},
									)}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Contract</dt>
				<dd>
					<ResourceBoundary
						resource={evmTransaction}
						placeholderText="Loading transaction…"
					>
						{#snippet children(evmTransaction)}
							{#if evmTransaction.$contract?.[EntityMetaKey.Id].address !== undefined}
								<EvmContractView
									entityId={evmTransaction.$contract[EntityMetaKey.Id]}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
										{
											networkId: String(entityId.$network.chainId),
											address: evmTransaction.$contract[EntityMetaKey.Id].address,
										},
									)}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Nonce</dt>
					<dd>
						<ResourceBoundary
							resource={evmTransaction}
							placeholderText="Loading transaction…"
						>
							{#snippet children(evmTransaction)}
								{#if evmTransaction.nonce !== undefined}
									{String(evmTransaction.nonce)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Position in block</dt>
					<dd>
						<ResourceBoundary
							resource={evmTransaction}
							placeholderText="Loading transaction…"
						>
							{#snippet children(evmTransaction)}
								{#if evmTransaction.transactionIndex !== undefined}
									{String(evmTransaction.transactionIndex)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Gas limit</dt>
					<dd>
						<ResourceBoundary
							resource={evmTransaction}
							placeholderText="Loading transaction…"
						>
							{#snippet children(evmTransaction)}
								{#if evmTransaction.gas !== undefined}
									<NumberValue value={evmTransaction.gas} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Gas price (legacy type 0/1)</dt>
					<dd>
						<ResourceBoundary
							resource={evmTransaction}
							placeholderText="Loading transaction…"
						>
							{#snippet children(evmTransaction)}
								{#if evmTransaction.gasPrice !== undefined}
									<NumberValue value={evmTransaction.gasPrice} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Transaction envelope type</dt>
					<dd>
						<ResourceBoundary
							resource={evmTransaction}
							placeholderText="Loading transaction…"
						>
							{#snippet children(evmTransaction)}
								{#if evmTransaction.envelopeType !== undefined}
									{evmTransactionEnvelopeTypeLabelById[evmTransaction.envelopeType]}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>EIP-1559 max fee / priority (type 2)</dt>
					<dd data-row="wrap align-center gap-2">
						<ResourceBoundary
							resource={evmTransaction}
							placeholderText="Loading transaction…"
						>
							{#snippet children(evmTransaction)}
								{#if evmTransaction.envelopeType === EvmTransactionEnvelopeType.FeeMarket}
									{#if evmTransaction.maxFeePerGas !== undefined}
										<span>
											max{' '}
											<NumberValue value={evmTransaction.maxFeePerGas} />
										</span>
									{/if}
									{#if evmTransaction.maxPriorityFeePerGas !== undefined}
										<span>
											priority{' '}
											<NumberValue value={evmTransaction.maxPriorityFeePerGas} />
										</span>
									{/if}
									{#if evmTransaction.maxFeePerGas === undefined && evmTransaction.maxPriorityFeePerGas === undefined}
										<span data-text="muted">Caps not indexed</span>
									{/if}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Effective gas price paid (base + tip after inclusion)</dt>
					<dd>
						<ResourceBoundary
							resource={evmTransaction}
							placeholderText="Loading transaction…"
						>
							{#snippet children(evmTransaction)}
								{#if evmTransaction.effectiveGasPrice !== undefined}
									<NumberValue value={evmTransaction.effectiveGasPrice} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Input data</dt>
					<dd>
						<ResourceBoundary
							resource={evmTransaction}
							placeholderText="Loading transaction…"
						>
							{#snippet children(evmTransaction)}
								{#if evmTransaction.input !== undefined}
									<TruncatedValue
										value={evmTransaction.input}
										format={TruncatedValueFormat.Abbr}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={evmTransaction}
					placeholderText="Loading transaction…"
				>
					{#snippet children(evmTransaction)}
						{#if evmTransaction.envelopeType === EvmTransactionEnvelopeType.Blob}
							{#if evmTransaction.blobGasUsed !== undefined}
								<div>
									<dt>Blob gas used</dt>
									<dd>
										<NumberValue value={evmTransaction.blobGasUsed} />
									</dd>
								</div>
							{/if}
							{#if evmTransaction.maxFeePerBlobGas !== undefined}
								<div>
									<dt>Max fee per blob gas</dt>
									<dd>
										<NumberValue value={evmTransaction.maxFeePerBlobGas} />
									</dd>
								</div>
							{/if}
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _detailsOpen,
	})}
		<EntityDetails
			entityType={EntityType.EvmTransaction}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${txIdKey}:carousel-execution`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<Heading>Execution</Heading>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Movements"
						href={`#${txIdKey}:movements`}
					>Movements</a>
					<a
						data-scroll-marker-label="Call"
						href={`#${txIdKey}:call`}
					>Call</a>
					<a
						data-scroll-marker-label="Events"
						href={`#${txIdKey}:events`}
					>Events</a>
					<a
						data-scroll-marker-label="Trace"
						href={`#${txIdKey}:trace`}
					>Trace</a>
					<ResourceBoundary
						resource={evmTransaction}
						placeholderText=""
					>
						{#snippet children(evmTransaction)}
							{#if evmTransaction.envelopeType === EvmTransactionEnvelopeType.Blob}
								<a
									data-scroll-marker-label="Blobs"
									href={`#${txIdKey}:blobs`}
								>Blobs</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
					<a
						data-scroll-marker-label="User operations"
						href={`#${txIdKey}:user-operations`}
					>User ops</a>
				{/snippet}

				{#snippet body({ open: tabOpen })}
					<section
						id={`${txIdKey}:movements`}
						data-scroll-marker-label="Movements"
					>
						<EvmAssetMovementsView
							{entityId}
							href={href}
							id={`${txIdKey}:movements`}
							open={tabOpen}
						/>
					</section>

					<section
						id={`${txIdKey}:call`}
						data-scroll-marker-label="Call"
					>
						<ResourceBoundary
							resource={evmTransaction}
							placeholderText="Loading transaction input…"
						>
							{#snippet children(evmTransaction)}
								{#if evmTransaction.input != null}
									<EvmTransactionInputDecode
										input={evmTransaction.input}
										open={tabOpen}
									/>
								{:else}
									<p data-text="muted">No calldata on this transaction.</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>

					<section
						id={`${txIdKey}:events`}
						data-scroll-marker-label="Events"
					>
						<EvmLogsView
							entityFieldReference={{
								entityType: EntityType.EvmTransaction,
								entityId,
								fieldName: '$$logs',
							}}
							collapsible={false}
							href={href}
							id={`${txIdKey}:events`}
							open={tabOpen}
							showTypeAnnotation={false}
							title="Receipt logs"
						/>
					</section>

					<section
						id={`${txIdKey}:trace`}
						data-scroll-marker-label="Trace"
					>
						{#if tabOpen}
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
								{#snippet children(txTrace)}
									{#if txTrace.traceRoot != null}
										<EvmTraceTreeView
											traceRoot={txTrace.traceRoot}
											chainId={entityId.$network.chainId}
										/>
									{:else if txTrace.traceUnavailable}
										<p data-text="muted">
											Call trace is not available from the configured RPC or explorer for this chain.
										</p>
									{:else}
										<p data-text="muted">No call trace for this transaction.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/if}
					</section>

					<ResourceBoundary
						resource={evmTransaction}
						placeholderText=""
					>
						{#snippet children(evmTransaction)}
							{#if evmTransaction.envelopeType === EvmTransactionEnvelopeType.Blob}
								<section
									id={`${txIdKey}:blobs`}
									data-scroll-marker-label="Blobs"
								>
									<EvmBlobsView
										entityFieldReference={{
											entityType: EntityType.EvmTransaction,
											entityId,
											fieldName: '$$blobs',
										}}
										collapsible={false}
										href={href}
										id={`${txIdKey}:blobs`}
										open={tabOpen}
										showTypeAnnotation={false}
										title="Blob sidecars"
									/>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<section
						id={`${txIdKey}:user-operations`}
						data-scroll-marker-label="User operations"
					>
						<EvmUserOperationsView
							entityFieldReference={{
								entityType: EntityType.EvmTransaction,
								entityId,
								fieldName: '$$userOperations',
							}}
							collapsible={false}
							href={href}
							id={`${txIdKey}:user-operations`}
							open={tabOpen}
							showTypeAnnotation={false}
							title="User operations"
						/>
					</section>

					{#if _children}
						<section id={`${txIdKey}:page-content`}>
							{@render _children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>
