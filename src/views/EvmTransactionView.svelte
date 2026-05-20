<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
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
			status: {},
			gasUsed: {},
			input: {},
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
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmLogsView from '$/views/EvmLogsView.svelte'
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

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={evmTransaction}
			placeholderText="Loading transaction…"
		>
			{#snippet children(evmTransaction)}
				<div data-column="gap-1">
					<dl data-column-item="center">
						{#if evmTransaction.value !== undefined}
							<div>
								<dt>Value</dt>
								<dd>
									<NumberValue value={evmTransaction.value} />
								</dd>
							</div>
						{/if}

						{#if evmTransaction.status !== undefined}
							<div>
								<dt>Status</dt>
								<dd>{String(evmTransaction.status)}</dd>
							</div>
						{/if}

						{#if evmTransaction.gasUsed !== undefined}
							<div>
								<dt>Gas used</dt>
								<dd>
									<NumberValue value={evmTransaction.gasUsed} />
								</dd>
							</div>
						{/if}

						{#if evmTransaction.$block?.[EntityMetaKey.Id].blockNumber !== undefined}
							<div>
								<dt>Block</dt>
								<dd>
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
								</dd>
							</div>
						{/if}

						{#if evmTransaction.$from?.[EntityMetaKey.Id].address !== undefined}
							<div>
								<dt>From</dt>
								<dd>
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
								</dd>
							</div>
						{/if}

						{#if evmTransaction.$to?.[EntityMetaKey.Id].address !== undefined}
							<div>
								<dt>To</dt>
								<dd>
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
								</dd>
							</div>
						{/if}

						{#if evmTransaction.$contract?.[EntityMetaKey.Id].address !== undefined}
							<div>
								<dt>Contract</dt>
								<dd>
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
								</dd>
							</div>
						{/if}

						{#if contentOpen}
							{#if evmTransaction.nonce !== undefined}
								<div>
									<dt>Nonce</dt>
									<dd>{String(evmTransaction.nonce)}</dd>
								</div>
							{/if}

							{#if evmTransaction.transactionIndex !== undefined}
								<div>
									<dt>Position in block</dt>
									<dd>{String(evmTransaction.transactionIndex)}</dd>
								</div>
							{/if}

							{#if evmTransaction.gas !== undefined}
								<div>
									<dt>Gas limit</dt>
									<dd>
										<NumberValue value={evmTransaction.gas} />
									</dd>
								</div>
							{/if}

							{#if evmTransaction.gasPrice !== undefined}
								<div>
									<dt>Gas price (legacy type 0/1)</dt>
									<dd>
										<NumberValue value={evmTransaction.gasPrice} />
									</dd>
								</div>
							{/if}

							{#if evmTransaction.type !== undefined}
								<div>
									<dt>Transaction envelope type</dt>
									<dd>{String(evmTransaction.type)}</dd>
								</div>
							{/if}

							{#if evmTransaction.type === 2}
								<div>
									<dt>EIP-1559 max fee / priority (type 2)</dt>
									<dd data-row="wrap align-center gap-2">
										<span>Not listed here</span>
										<Tooltip
											content="EIP-1559 type-2 txs publish maxFeePerGas and maxPriorityFeePerGas caps; some explorers only index the effective price paid after inclusion. After inclusion, effective gas price reflects the base fee burned plus the validator tip."
											contentProps={{ side: 'top' }}
										>
											<abbr
												class="entity-heading-tip"
												aria-label="Type 2 gas fields"
											>ⓘ</abbr>
										</Tooltip>
									</dd>
								</div>
							{/if}

							{#if evmTransaction.effectiveGasPrice !== undefined}
								<div>
									<dt>Effective gas price paid (base + tip after inclusion)</dt>
									<dd>
										<NumberValue value={evmTransaction.effectiveGasPrice} />
									</dd>
								</div>
							{/if}

							{#if evmTransaction.input !== undefined}
								<div>
									<dt>Input data</dt>
									<dd>
										<TruncatedValue
											value={evmTransaction.input}
											format={TruncatedValueFormat.Abbr}
										/>
									</dd>
								</div>
							{/if}
						{/if}
					</dl>
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _detailsOpen,
	})}
		<EntityDetails
			entityType={EntityType.EvmTransaction}
			{entityId}
		/>

		<EvmLogsView
			entityFieldReference={{
				entityType: EntityType.EvmTransaction,
				entityId,
				fieldName: '$$logs',
			}}
			collapsible={false}
			open={true}
			showTypeAnnotation={false}
		/>

		{#if _children}
			<section id={`${txIdKey}:page-content`}>
				{@render _children()}
			</section>
		{/if}
	{/snippet}
</EntityView>
