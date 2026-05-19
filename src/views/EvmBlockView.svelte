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
		href,
		open = $bindable(true),
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
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActorView from '$/views/ActorView.svelte'
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

	{#snippet Id()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Block </span>
			<span
				data-badge="small"
				data-text="font-monospace"
				data-block-number={String(entityId.blockNumber)}
			>
				{String(entityId.blockNumber)}
			</span>
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={block}
			placeholderText="Loading block…"
		>
			{#snippet children(block)}
				<div data-column="gap-1">
					<dl data-column-item="center">
						{#if entityId.hash || block.hash}
							<div>
								<dt>Hash</dt>
								<dd>
									<TruncatedValue
										value={entityId.hash || block.hash}
										format={TruncatedValueFormat.Abbr}
									/>
								</dd>
							</div>
						{/if}

						{#if block.transactionCount !== undefined}
							<div>
								<dt>Transactions</dt>
								<dd>
									<NumberValue value={block.transactionCount} />
								</dd>
							</div>
						{/if}

						{#if block.timestamp !== undefined}
							<div>
								<dt>Timestamp</dt>
								<dd>
									<Timestamp
										timestamp={block.timestamp}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}

						{#if open && block.gasUsed !== undefined}
							<div>
								<dt>Gas used</dt>
								<dd>
									<NumberValue value={block.gasUsed} />
								</dd>
							</div>
						{/if}

						{#if open && block.gasLimit !== undefined}
							<div>
								<dt>Gas limit</dt>
								<dd>
									<NumberValue value={block.gasLimit} />
								</dd>
							</div>
						{/if}

						{#if open && block.baseFeePerGas !== undefined}
							<div>
								<dt>Base fee (EIP‑1559)</dt>
								<dd>
									<NumberValue value={block.baseFeePerGas} />
								</dd>
							</div>
						{/if}

						{#if open && block.blobGasUsed !== undefined}
							<div>
								<dt>Blob gas used (EIP‑4844)</dt>
								<dd>
									<NumberValue value={block.blobGasUsed} />
								</dd>
							</div>
						{/if}

						{#if open && block.excessBlobGas !== undefined}
							<div>
								<dt>Excess blob gas</dt>
								<dd>
									<NumberValue value={block.excessBlobGas} />
								</dd>
							</div>
						{/if}

						{#if open && block.$parent}
							<div>
								<dt>Parent block</dt>
								<dd>
									<EvmBlockView
										entityId={block.$parent[EntityMetaKey.Id]}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
											{
												networkId: String(entityId.$network.chainId),
												blockNumber: String(block.$parent[EntityMetaKey.Id].blockNumber),
											},
										)}
										layout={EntityLayout.Summary}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open && block.$miner}
							<div>
								<dt>Miner / validator</dt>
								<dd>
									<ActorView
										entityId={block.$miner[EntityMetaKey.Id]}
										href={resolve('/~/(accounts)/accounts/account/[accountId]', {
											accountId: block.$miner[EntityMetaKey.Id].address,
										})}
										layout={EntityLayout.Summary}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}
					</dl>
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
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

				{#snippet Markers()}
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
					{#if children}
						<a
							data-scroll-marker-label="Content"
							href={`#${blockIdKey}:page-content`}
						>Content</a>
					{/if}
				{/snippet}

				{#snippet children(_ctx)}
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
										layout={EntityLayout.Summary}
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
							open={false}
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
