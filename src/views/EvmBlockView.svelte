<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromNetworkId } from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(blocks)/block/[blockNumber]',
			{
				...caip2RouteParamsFromNetworkId(entityId.$network),
				blockNumber: String(entityId.blockNumber),
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmBlock>
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

	const block = useEntity(
		EntityType.EvmBlock,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
				Source.ZeroGChain_JsonRpc,
			],
			timestamp: {},
			transactionCount: {},
			...open && {
				gasUsed: {},
				gasLimit: {},
				baseFeePerGas: {},
				blobGasUsed: {},
				excessBlobGas: {},
				$parent: {},
				$miner: {},
			},
		},
	)


	const blockIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			{@render Value()}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			An execution block commits its parent, fee market fields, and an ordered list of transactions with receipts and logs.
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
					<ResourceBoundary
						resource={block}
						placeholderText="Loading block…"
					>
						{#snippet children(block)}
							{#if entityId.hash || block.hash}
								<TruncatedValue
									value={entityId.hash || block.hash}
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
										entityId={block.$parent[EntityMetaKey.Id]}
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
										entityId={{
											$network: entityId.$network,
											$actor: block.$miner[EntityMetaKey.Id],
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
		open: detailsOpen,
	})}
		<CollapsibleTabs
				sectionIdPrefix={blockIdKey}
				sections={[
					{ id: 'chain', label: 'Chain' },
					{ id: 'transactions', label: 'Transactions' },
					...(children ? [{ id: 'page-content', label: 'Content' }] : []),
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
							{#if block.$parent}
								<EvmBlockView
									entityId={block.$parent[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionTransactions({ id: _txId, label: _txLabel })}
					<EvmTransactionsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve(
						'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(blocks)/block/[blockNumber]/(block)/transactions',
						{
							...caip2RouteParamsFromNetworkId(entityId.$network),
							blockNumber: String(entityId.blockNumber),
						},
					)}
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

				{#snippet SectionPageContent({ id: _contentId, label: _contentLabel })}
					{#if children}
						{@render children()}
					{/if}
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
