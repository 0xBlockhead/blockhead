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
		children,
		entityId,
		href = resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
			{
				networkId: String(entityId.$network.chainId),
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


	// (Derived)
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
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
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
						{#snippet children(loadedBlock)}
							{#if entityId.hash || loadedBlock.hash}
								<TruncatedValue
									value={entityId.hash || loadedBlock.hash}
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
						{#snippet children(loadedBlock)}
							{#if loadedBlock.transactionCount !== undefined}
								<NumberValue value={loadedBlock.transactionCount} />
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
						{#snippet children(loadedBlock)}
							{#if loadedBlock.timestamp !== undefined}
								<Timestamp
									timestamp={loadedBlock.timestamp}
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
							{#snippet children(loadedBlock)}
								{#if loadedBlock.gasUsed !== undefined}
									<NumberValue value={loadedBlock.gasUsed} />
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
							{#snippet children(loadedBlock)}
								{#if loadedBlock.gasLimit !== undefined}
									<NumberValue value={loadedBlock.gasLimit} />
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
							{#snippet children(loadedBlock)}
								{#if loadedBlock.baseFeePerGas !== undefined}
									<NumberValue value={loadedBlock.baseFeePerGas} />
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
							{#snippet children(loadedBlock)}
								{#if loadedBlock.blobGasUsed !== undefined}
									<NumberValue value={loadedBlock.blobGasUsed} />
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
							{#snippet children(loadedBlock)}
								{#if loadedBlock.excessBlobGas !== undefined}
									<NumberValue value={loadedBlock.excessBlobGas} />
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
							{#snippet children(loadedBlock)}
								{#if loadedBlock.$parent}
									<EvmBlockView
										entityId={loadedBlock.$parent[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
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
							{#snippet children(loadedBlock)}
								{#if loadedBlock.$miner}
									<ActorNetworkView
										entityId={{
											$network: entityId.$network,
											$actor: loadedBlock.$miner[EntityMetaKey.Id],
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

				{#snippet Markers({ open: _markersOpen })}
					<ResourceBoundary
						resource={block}
						placeholderText=""
					>
						{#snippet children(loadedBlock)}
							{#if loadedBlock.$parent}
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
					{#if children}
						<a
							data-scroll-marker-label="Content"
							href={`#${blockIdKey}:page-content`}
						>Content</a>
					{/if}
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<ResourceBoundary
						resource={block}
						placeholderText="Loading chain info…"
					>
						{#snippet children(loadedBlock)}
							{#if loadedBlock.$parent}
								<section
									id={`${blockIdKey}:chain`}
								>
									<EvmBlockView
										entityId={loadedBlock.$parent[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
									/>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
					<section
						id={`${blockIdKey}:transactions`}
					>
						<EvmTransactionsView
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]/(block)/transactions',
								{
								networkId: String(entityId.$network.chainId),
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
					</section>

					{#if children}
						<section
							id={`${blockIdKey}:page-content`}
						>
							{@render children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

