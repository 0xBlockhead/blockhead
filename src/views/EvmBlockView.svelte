<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
			href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(blocks)/block/[blockNumber]', {
				...{ caip2Namespace: entityId.$network.caip2.namespace, caip2Reference: entityId.$network.caip2.reference },
				blockNumber: entityId.blockNumber.toString(),
			}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmBlock>
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

	const block = useEntity(entityCollectionsContext, EntityType.EvmBlock,
		entityId,
		({ sources: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
				Source.ZeroGChain_JsonRpc,
			], fields: { timestamp: true, transactionCount: true, ...(open && ({ gasUsed: true, gasLimit: true, baseFeePerGas: true, blobGasUsed: true, excessBlobGas: true, $parent: true, $miner: true })) } }),
	)


	// (Derived)
	const blockIdKey = $derived(
		stringify(entityId),
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
	{entityId}
	href={href}
	title={`Block #${String(entityId.blockNumber)}`}
	idDragPlainText={String(entityId.blockNumber)}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(entityId.blockNumber)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Block </span>
		<span data-badge="small">
			#{String(entityId.blockNumber)}
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
		<dl data-column-item="center">
			<div>
				<dt>Hash</dt>
				<dd>
					{#if entityId.hash}
						<TruncatedValue
							value={entityId.hash}
							format={TruncatedValueFormat.Abbr}
						/>
					{/if}
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
							{#if block.fields.transactionCount !== undefined}
								<NumberValue value={block.fields.transactionCount} />
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
							{#if block.fields.timestamp !== undefined}
								<Timestamp
									timestamp={block.fields.timestamp}
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
								{#if block.fields.gasUsed !== undefined}
									<NumberValue value={block.fields.gasUsed} />
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
								{#if block.fields.gasLimit !== undefined}
									<NumberValue value={block.fields.gasLimit} />
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
								{#if block.fields.baseFeePerGas !== undefined}
									<NumberValue value={block.fields.baseFeePerGas} />
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
								{#if block.fields.blobGasUsed !== undefined}
									<NumberValue value={block.fields.blobGasUsed} />
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
								{#if block.fields.excessBlobGas !== undefined}
									<NumberValue value={block.fields.excessBlobGas} />
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
								{#if block.fields.$parent}
									<EvmBlockView
										entityId={block.fields.$parent[EntityMetaKey.Id]}
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
								{#if block.fields.$miner}
									<EvmNetworkAccountView
										entityId={{
											$network: entityId.$network,
											$actor: block.fields.$miner[EntityMetaKey.Id],
										}}
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
	{/snippet}

	{#snippet Details({
		open,
	})}
		<CollapsibleTabs
			sectionIdPrefix={blockIdKey}
			sections={[
				{ id: 'chain', label: 'Chain' },
				{ id: 'transactions', label: 'Transactions' },
			]}
			id={`${blockIdKey}:carousel-related`}
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
						{#if block.fields.$parent}
							<EvmBlockView
								entityId={block.fields.$parent[EntityMetaKey.Id]}
								layout={EntityLayout.Value}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionTransactions({ id: _txId, label: _txLabel })}
				<EvmTransactionsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(blocks)/block/[blockNumber]/(block)/transactions', {
						...{ caip2Namespace: entityId.$network.caip2.namespace, caip2Reference: entityId.$network.caip2.reference },
						blockNumber: String(entityId.blockNumber),
					})}
					entityFieldReference={{
						entityType: EntityType.EvmBlock,
						entityId,
						fieldName: '$$transactions',
					}}
					id="transactions"
					collapsible={false}
					open={true}
				/>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
