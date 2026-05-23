<script lang="ts">
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


	// Props
	let {
		children: _children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmBlock>
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
		>
	> = $props()

	const blockIdKey = $derived(
		stringify(entityId),
	)


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	const block = useEntity(
		EntityType.EvmBlock,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
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


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlock}
	{entityId}
	title={`Block #${String(entityId.blockNumber)}`}
	{href}
	idDragPlainText={String(entityId.blockNumber)}
	bind:open
	{...entityViewRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			An execution block commits its parent, fee market fields, and an ordered list of transactions with receipts and logs.
		</p>
		<p>
			Blob transactions carry large payloads beside the block body without bloating long-term execution state.
		</p>
	{/snippet}

	{#snippet Value()}
		<span
			data-badge="small"
			data-block-number={String(entityId.blockNumber)}
		>
			{String(entityId.blockNumber)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Block </span>
			{@render Value()}
		</span>
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
					<dt>Base fee (EIP‑1559)</dt>
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
					<dt>Blob gas used (EIP‑4844)</dt>
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
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
											{
												networkId: String(entityId.$network.chainId),
												blockNumber: String(block.$parent[EntityMetaKey.Id].blockNumber),
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
									<ActorNetworkView
										entityId={{
											$network: entityId.$network,
											$actor: block.$miner[EntityMetaKey.Id],
										}}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
											{
												networkId: String(entityId.$network.chainId),
												address: block.$miner[EntityMetaKey.Id].address,
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
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: detailsOpen,
	})}
		<EntityDetails
			entityType={EntityType.EvmBlock}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${blockIdKey}:carousel-related`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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

				{#snippet Markers(_context)}
					<ResourceBoundary
						resource={block}
						placeholderText=""
					>
						{#snippet children(block)}
							{#if block.$parent}
								<a
									data-scroll-marker-label="Chain"
									href={`#${blockIdKey}:chain`}
								>Chain</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
					<a
						data-scroll-marker-label="Transactions"
						href={`#${blockIdKey}:transactions`}
					>Tx</a>
					{#if _children}
						<a
							data-scroll-marker-label="Content"
							href={`#${blockIdKey}:page-content`}
						>Content</a>
					{/if}
				{/snippet}

				{#snippet body(_ctx)}
					<ResourceBoundary
						resource={block}
						placeholderText="Loading chain info…"
					>
						{#snippet children(block)}
							{#if block.$parent}
								<section
									id={`${blockIdKey}:chain`}
								>
									<EvmBlockView
										entityId={block.$parent[EntityMetaKey.Id]}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
											{
												networkId: String(entityId.$network.chainId),
												blockNumber: String(block.$parent[EntityMetaKey.Id].blockNumber),
											},
										)}
										layout={EntityLayout.Title}
										showTypeAnnotation={false}
									/>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
					<section
						id={`${blockIdKey}:transactions`}
					>
						<EvmTransactionsView
							entityFieldReference={{
								entityType: EntityType.EvmBlock,
								entityId,
								fieldName: '$$transactions',
							}}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]/(block)/transactions',
								{
									networkId: String(entityId.$network.chainId),
									blockNumber: String(entityId.blockNumber),
								},
							)}
							id="transactions"
							collapsible={false}
							open={true}
						/>
					</section>

					{#if _children}
						<section
							id={`${blockIdKey}:page-content`}
						>
							{@render _children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>
