<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'

	// Props
	let {
		children,
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


	// Context
	import { resolve } from '$app/paths'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const tx = useEntity(
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
			status: {},
			gasUsed: {},
			input: {},
			logs: {},
			...(open ?
				{
					nonce: {},
					transactionIndex: {},
					gas: {},
					gasPrice: {},
					type: {},
					effectiveGasPrice: {},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import ContractView from '$/views/ContractView.svelte'
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
	{#snippet Heading()}

		<span
			data-text="font-monospace"
			data-tx-hash={entityId.txHash}
		>
			<TruncatedValue
				value={entityId.txHash}
				format={TruncatedValueFormat.Abbr}
			/>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
<p>
					Signed execution-layer transaction (legacy or type-2 envelope). From and to are addresses; either may be a contract.
				</p>
				<p>
					ERC-4337 account abstraction wraps intent in <code>UserOperation</code> bundles, paymasters, and optional relay batches—separate from a single externally owned account sending one legacy or type-2 envelope.
				</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={tx}
			placeholderText="Loading transaction…"
		>
			{#snippet children(t)}
				<dl>
					{#if t.value !== undefined}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={t.value} />
							</dd>
						</div>
					{/if}

					{#if t.status !== undefined}
						<div>
							<dt>Status</dt>
							<dd>{String(t.status)}</dd>
						</div>
					{/if}

					{#if t.gasUsed !== undefined}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue value={t.gasUsed} />
							</dd>
						</div>
					{/if}

					{#if t.$block?.[EntityMetaKey.Id].blockNumber !== undefined}
						<div>
							<dt>Block</dt>
							<dd>
								<EvmBlockView
									entityId={t.$block[EntityMetaKey.Id]}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
										{
											networkId: String(entityId.$network.chainId),
											blockNumber: String(t.$block[EntityMetaKey.Id].blockNumber),
										},
									)}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if t.$from?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>From</dt>
							<dd>
								<ActorView
									entityId={t.$from[EntityMetaKey.Id]}
									href={resolve('/~/(accounts)/accounts/account/[accountId]', {
										accountId: t.$from[EntityMetaKey.Id].address,
									})}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if t.$to?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>To</dt>
							<dd>
								<ActorView
									entityId={t.$to[EntityMetaKey.Id]}
									href={resolve('/~/(accounts)/accounts/account/[accountId]', {
										accountId: t.$to[EntityMetaKey.Id].address,
									})}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if t.$contract?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>Contract</dt>
							<dd>
								<ContractView
									entityId={t.$contract[EntityMetaKey.Id]}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
										{
											networkId: String(entityId.$network.chainId),
											address: t.$contract[EntityMetaKey.Id].address,
										},
									)}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if open}
						{#if t.nonce !== undefined}
							<div>
								<dt>Nonce</dt>
								<dd>{String(t.nonce)}</dd>
							</div>
						{/if}

						{#if t.transactionIndex !== undefined}
							<div>
								<dt>Position in block</dt>
								<dd>{String(t.transactionIndex)}</dd>
							</div>
						{/if}

						{#if t.gas !== undefined}
							<div>
								<dt>Gas limit</dt>
								<dd>
									<NumberValue value={t.gas} />
								</dd>
							</div>
						{/if}

						{#if t.gasPrice !== undefined}
							<div>
								<dt>Gas price (legacy type 0/1)</dt>
								<dd>
									<NumberValue value={t.gasPrice} />
								</dd>
							</div>
						{/if}

						{#if t.type !== undefined}
							<div>
								<dt>Transaction envelope type</dt>
								<dd>{String(t.type)}</dd>
							</div>
						{/if}

						{#if t.type === 2}
							<div>
								<dt>EIP-1559 max fee / priority (type 2)</dt>
								<dd data-row="wrap align-center gap-2">
									<span>Not listed here</span>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>
												EIP-1559 type-2 txs publish <code>maxFeePerGas</code> and <code>maxPriorityFeePerGas</code> caps; some explorers only index the <strong>effective</strong> price paid after inclusion.
											</p>
											<p>
												After a block is mined, effective gas price reflects the base fee burned plus the tip kept by the proposing validator.
											</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="Type 2 gas fields"
										>ⓘ</abbr>
									</Tooltip>
								</dd>
							</div>
						{/if}

						{#if t.effectiveGasPrice !== undefined}
							<div>
								<dt>Effective gas price paid (base + tip after inclusion)</dt>
								<dd>
									<NumberValue value={t.effectiveGasPrice} />
								</dd>
							</div>
						{/if}

						{#if t.input !== undefined}
							<div>
								<dt>Input data</dt>
								<dd>
									<TruncatedValue
										value={t.input}
										format={TruncatedValueFormat.Abbr}
									/>
								</dd>
							</div>
						{/if}

						{#if t.logs !== undefined}
							<div>
								<dt>Logs</dt>
								<dd>
									<NumberValue value={BigInt(t.logs.length)} />
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const txStableKey = entityId.txHash}
		<EntityDetails
			entityType={EntityType.EvmTransaction}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${txStableKey}:carousel-logs`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<Heading>Logs</Heading>
					</header>
				{/snippet}

				{#snippet Markers()}
					<a
						data-scroll-marker-label="Log entries"
						href={`#${txStableKey}:logs`}
					>Log entries</a>
				{/snippet}

				{#snippet children(_ctx)}
					<section id={`${txStableKey}:logs`}>
						<ResourceBoundary
							resource={tx}
							placeholderText="Loading transaction logs…"
						>
							{#snippet children(t)}
								{#if t.logs?.length}
									<div data-column="gap-2">
										{#each t.logs as log, index}
											<div data-card="">
												<div data-row="wrap gap-2 align-baseline">
													<span data-text="annotation">Index</span>
													<span>{String(index)}</span>
												</div>
												{#if log.address}
													<div data-row="wrap gap-2 align-baseline">
														<span data-text="annotation">Address</span>
														<span data-text="font-monospace">
															<TruncatedValue
																value={log.address}
																format={TruncatedValueFormat.Abbr}
															/>
														</span>
													</div>
												{/if}

												{#if log.topics?.length}
													<div data-column="gap-1">
														<span data-text="annotation">Topics</span>
														{#each log.topics as topic}
															<span data-text="font-monospace">
																<TruncatedValue
																	value={topic}
																	format={TruncatedValueFormat.Abbr}
																/>
															</span>
														{/each}
													</div>
												{/if}

												{#if log.data}
													<div data-row="wrap gap-2 align-baseline">
														<span data-text="annotation">Data</span>
														<span data-text="font-monospace">
															<TruncatedValue
																value={log.data}
																format={TruncatedValueFormat.Abbr}
															/>
														</span>
													</div>
												{/if}
											</div>
										{/each}
									</div>
								{:else}
									<div data-row="wrap align-center gap-2">
										<p data-text="muted">
											No log entries.
										</p>
										<Tooltip contentProps={{ side: 'top' }}>
											{#snippet Content()}
												<p>
													Execution receipts list event logs for <code>LOG</code> opcodes that fired; an empty array means the call path emitted none or reverted before logging.
												</p>
											{/snippet}
											<abbr
												class="entity-heading-tip"
												aria-label="Transaction logs"
											>ⓘ</abbr>
										</Tooltip>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
				{/snippet}
			</CollapsibleTabs>

			{#if children}
				<CollapsibleTabs
					id={`${txStableKey}:carousel-more`}
					{...{ 'data-card': '' }}
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<Heading>Page</Heading>
						</header>
					{/snippet}

					{#snippet Markers()}
						<a
							data-scroll-marker-label="Route"
							href={`#${entityId.txHash}:page-content`}
						>Route</a>
					{/snippet}

					{#snippet children(_ctx)}
						<section id={`${entityId.txHash}:page-content`}>
							{@render children()}
						</section>
					{/snippet}
				</CollapsibleTabs>
			{/if}
		</div>
	{/snippet}
</EntityView>
