<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = 'blockNumber' in selection.entitySelector ?
				resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
				caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
				blockNumber: selection.entitySelector.blockNumber.toString(),
			})
		:
			undefined,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmBlock>
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


	const block = $derived(selection( {
		sources: [
			Source.Blockscout_Rest,
			Source.Voltaire_JsonRpc,
			Source.ZeroGChain_JsonRpc,
		],
	}))
	const hash = $derived(block.hash)
	const timestamp = $derived(block.timestamp)
	const transactionCount = $derived(block.transactionCount)
	const gasUsed = $derived(block.gasUsed)
	const gasLimit = $derived(block.gasLimit)
	const baseFeePerGas = $derived(block.baseFeePerGas)
	const blobGasUsed = $derived(block.blobGasUsed)
	const excessBlobGas = $derived(block.excessBlobGas)
	const parent = $derived(block.$parent)
	const miner = $derived(block.$miner)


	// (Derived)
	const blockSelectorKey = $derived(
		stringify(selection.entitySelector),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlock}
	entitySelector={selection.entitySelector}
	href={href}
	title={'blockNumber' in selection.entitySelector ? `Block #${String(selection.entitySelector.blockNumber)}` : `Block ${selection.entitySelector.hash}`}
	idDragPlainText={'blockNumber' in selection.entitySelector ? String(selection.entitySelector.blockNumber) : selection.entitySelector.hash}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			{'blockNumber' in selection.entitySelector ? `#${String(selection.entitySelector.blockNumber)}` : selection.entitySelector.hash}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Block </span>
			<span data-badge="small">
				{'blockNumber' in selection.entitySelector ? `#${String(selection.entitySelector.blockNumber)}` : selection.entitySelector.hash}
			</span>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			An execution block commits its parent, fee market fields, and an ordered evmBlocks of transactions with receipts and logs.
		</p>
		<p>
			Blob transactions carry large payloads beside the block body without bloating long-term execution state.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		{#if contentOpen}
			<dl data-column-item="center">
				<div>
					<dt>Hash</dt>
					<dd>
						<ResourceBoundary
							resource={block}
							placeholderText="Loading block…"
						>
							{#snippet children(block)}
								{#if block.hash}
									<TruncatedValue
										value={block.hash}
										format={TruncatedValueFormat.Abbr}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Transactions</dt>
					<dd>
						<ResourceBoundary
							resource={block}
							placeholderText="Loading block…"
						>
							{#snippet children(block)}
								{#if block.transactionCount !== undefined}
									<NumberValue value={block.transactionCount} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Timestamp</dt>
					<dd>
						<ResourceBoundary
							resource={block}
							placeholderText="Loading block…"
						>
							{#snippet children(block)}
								{#if block.timestamp !== undefined}
									<Timestamp
										timestamp={block.timestamp}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				{#if open}
					<div>
						<dt>Gas used</dt>
						<dd>
							<ResourceBoundary
								resource={block}
								placeholderText="Loading block…"
							>
								{#snippet children(block)}
									{#if block.gasUsed !== undefined}
										<NumberValue value={block.gasUsed} />
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Gas limit</dt>
						<dd>
							<ResourceBoundary
								resource={block}
								placeholderText="Loading block…"
							>
								{#snippet children(block)}
									{#if block.gasLimit !== undefined}
										<NumberValue value={block.gasLimit} />
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Base fee</dt>
						<dd>
							<ResourceBoundary
								resource={block}
								placeholderText="Loading block…"
							>
								{#snippet children(block)}
									{#if block.baseFeePerGas !== undefined}
										<NumberValue value={block.baseFeePerGas} />
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Blob gas used</dt>
						<dd>
							<ResourceBoundary
								resource={block}
								placeholderText="Loading block…"
							>
								{#snippet children(block)}
									{#if block.blobGasUsed !== undefined}
										<NumberValue value={block.blobGasUsed} />
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Excess blob gas</dt>
						<dd>
							<ResourceBoundary
								resource={block}
								placeholderText="Loading block…"
							>
								{#snippet children(block)}
									{#if block.excessBlobGas !== undefined}
										<NumberValue value={block.excessBlobGas} />
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Parent block</dt>
						<dd>
							<ResourceBoundary
								resource={block}
								placeholderText="Loading block…"
							>
								{#snippet children(block)}
									{#if block.$parent}
											<EvmBlockView
												selection={select(EntityType.EvmBlock, block.$parent.entitySelector)}
												layout={EntityLayout.Value}
												open={false}
											/>
										{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Miner / validator</dt>
						<dd>
							<ResourceBoundary
								resource={block}
								placeholderText="Loading block…"
							>
								{#snippet children(block)}
									{#if block.$miner}
										<EvmNetworkAccountView
											selection={select(EntityType.EvmNetworkAccount, {
												$network: selection.entitySelector.$network,
												$actor: block.$miner.entitySelector,
											})}
											layout={EntityLayout.Title}

											open={false}
											/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			</dl>
		{/if}
	{/snippet}

	{#snippet Details({
		open,
	})}
		{#if open}
			<CollapsibleTabs
				sectionIdPrefix={blockSelectorKey}
				sections={[
					{ id: 'chain', label: 'Chain' },
					{ id: 'transactions', label: 'Transactions' },
				]}
				id={`${blockSelectorKey}:carousel-related`}
				data-card
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<Heading>Block</Heading>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									The block body sequences transactions and their receipts.
								</p>
								<p>
									Blob-carrying transactions reference large data with hashes instead of stuffing the execution trie.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="Block payload notes"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet SectionChain({ id: _chainId, label: _chainLabel })}
					<ResourceBoundary
						resource={block}
						placeholderText="Loading chain info…"
					>
						{#snippet children(block)}
							{#if block.$parent}
									<EvmBlockView
										selection={select(EntityType.EvmBlock, block.$parent.entitySelector)}
										layout={EntityLayout.Value}
										open={false}
									/>
								{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionTransactions({ id: _txId, label: _txLabel })}
					<EvmTransactionsView
						CollapsibleProps={{ canToggle: false }}
							href={'blockNumber' in selection.entitySelector ?
									resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]/(block)/transactions', {
									caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
									blockNumber: String(selection.entitySelector.blockNumber),
								})
						:
							undefined}
							selection={block.$$transactions({
							sources: [
								Source.Blockscout_Rest,
								Source.Voltaire_JsonRpc,
							],
							limit: 100,
						})}
						blockSelector={'blockNumber' in selection.entitySelector ? selection.entitySelector : undefined}
						id="transactions"
						collapsible={false}
						open={true}
					/>
				{/snippet}
			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
