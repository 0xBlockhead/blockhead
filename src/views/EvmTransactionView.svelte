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

		<span data-tx-hash={entityId.txHash}>
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
		<dl data-column-item="center">
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
							{#if evmTransaction.status !== undefined}
								{String(evmTransaction.status)}
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
								{#if evmTransaction.type !== undefined}
									{String(evmTransaction.type)}
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
								{#if evmTransaction.type === 2}
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
		</dl>
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
