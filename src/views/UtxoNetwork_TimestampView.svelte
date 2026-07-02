<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.UtxoNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.UtxoNetwork_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const utxoNetworkTimestamp = $derived(selection({
		fields: {
			bestBlockHeight: true,
			bestBlockHash: true,
			bestBlockTimeMs: true,
			blockCount: true,
			transactionCount: true,
			blocks24h: true,
			transactions24h: true,
			mempoolTransactionCount: true,
			mempoolSizeBytes: true,
			mempoolTps: true,
			averageTransactionFee24hSats: true,
			medianTransactionFee24hSats: true,
			suggestedTransactionFeePerByteSats: true,
			blockchainSizeBytes: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'UTXO network timestamp')
	const viewDomId = $derived('utxo-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/observations/[timestampMs=nonNegativeInteger]/[source]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const bestBlockHeight0 = ({ ...selection.entitySelector, ...prefetched }).bestBlockHeight}
			{#if bestBlockHeight0 !== undefined && bestBlockHeight0 !== null}
				<NumberValue value={Number(bestBlockHeight0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const bestBlockHeight0 = ({ ...selection.entitySelector, ...prefetched }).bestBlockHeight}
					{#if bestBlockHeight0 !== undefined && bestBlockHeight0 !== null}
						<NumberValue value={Number(bestBlockHeight0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const bestBlockHeight0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).bestBlockHeight}
					{#if bestBlockHeight0 !== undefined && bestBlockHeight0 !== null}
						<NumberValue value={Number(bestBlockHeight0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const source0 = prefetched.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
			{@const bestBlockHash1 = prefetched.bestBlockHash}
			{#if bestBlockHash1 !== undefined && bestBlockHash1 !== null}
				<span data-text="muted">
					{String((bestBlockHash1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const source0 = prefetched.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
					{@const bestBlockHash1 = prefetched.bestBlockHash}
					{#if bestBlockHash1 !== undefined && bestBlockHash1 !== null}
						<span data-text="muted">
							{String((bestBlockHash1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const source0 = entity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
					{@const bestBlockHash1 = entity.bestBlockHash}
					{#if bestBlockHash1 !== undefined && bestBlockHash1 !== null}
						<span data-text="muted">
							{String((bestBlockHash1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const bestBlockTimeMs = prefetched.bestBlockTimeMs ?? selection.entitySelector.bestBlockTimeMs}
					{#if bestBlockTimeMs !== undefined && bestBlockTimeMs !== null}
						<div>
							<dt>Best block time</dt>
							<dd>
								<Timestamp timestamp={Number(bestBlockTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const bestBlockTimeMs = entity.bestBlockTimeMs ?? selection.entitySelector.bestBlockTimeMs ?? prefetched.bestBlockTimeMs}
					{#if bestBlockTimeMs !== undefined && bestBlockTimeMs !== null}
						<div>
							<dt>Best block time</dt>
							<dd>
								<Timestamp timestamp={Number(bestBlockTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const blockCount = prefetched.blockCount ?? selection.entitySelector.blockCount}
					{#if blockCount !== undefined && blockCount !== null}
						<div>
							<dt>Block count</dt>
							<dd>
								<NumberValue value={Number(blockCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const blockCount = entity.blockCount ?? selection.entitySelector.blockCount ?? prefetched.blockCount}
					{#if blockCount !== undefined && blockCount !== null}
						<div>
							<dt>Block count</dt>
							<dd>
								<NumberValue value={Number(blockCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const transactionCount = prefetched.transactionCount ?? selection.entitySelector.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								<NumberValue value={Number(transactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount ?? selection.entitySelector.transactionCount ?? prefetched.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								<NumberValue value={Number(transactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const blocks24h = prefetched.blocks24h ?? selection.entitySelector.blocks24h}
					{#if blocks24h !== undefined && blocks24h !== null}
						<div>
							<dt>Blocks 24h</dt>
							<dd>
								{String((blocks24h) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const blocks24h = entity.blocks24h ?? selection.entitySelector.blocks24h ?? prefetched.blocks24h}
					{#if blocks24h !== undefined && blocks24h !== null}
						<div>
							<dt>Blocks 24h</dt>
							<dd>
								{String((blocks24h) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const transactions24h = prefetched.transactions24h ?? selection.entitySelector.transactions24h}
					{#if transactions24h !== undefined && transactions24h !== null}
						<div>
							<dt>Transactions 24h</dt>
							<dd>
								{String((transactions24h) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const transactions24h = entity.transactions24h ?? selection.entitySelector.transactions24h ?? prefetched.transactions24h}
					{#if transactions24h !== undefined && transactions24h !== null}
						<div>
							<dt>Transactions 24h</dt>
							<dd>
								{String((transactions24h) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const mempoolTransactionCount = prefetched.mempoolTransactionCount ?? selection.entitySelector.mempoolTransactionCount}
					{#if mempoolTransactionCount !== undefined && mempoolTransactionCount !== null}
						<div>
							<dt>Mempool transaction count</dt>
							<dd>
								{String((mempoolTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const mempoolTransactionCount = entity.mempoolTransactionCount ?? selection.entitySelector.mempoolTransactionCount ?? prefetched.mempoolTransactionCount}
					{#if mempoolTransactionCount !== undefined && mempoolTransactionCount !== null}
						<div>
							<dt>Mempool transaction count</dt>
							<dd>
								{String((mempoolTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const mempoolSizeBytes = prefetched.mempoolSizeBytes ?? selection.entitySelector.mempoolSizeBytes}
					{#if mempoolSizeBytes !== undefined && mempoolSizeBytes !== null}
						<div>
							<dt>Mempool size</dt>
							<dd>
								<NumberValue value={Number(mempoolSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const mempoolSizeBytes = entity.mempoolSizeBytes ?? selection.entitySelector.mempoolSizeBytes ?? prefetched.mempoolSizeBytes}
					{#if mempoolSizeBytes !== undefined && mempoolSizeBytes !== null}
						<div>
							<dt>Mempool size</dt>
							<dd>
								<NumberValue value={Number(mempoolSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const mempoolTps = prefetched.mempoolTps ?? selection.entitySelector.mempoolTps}
					{#if mempoolTps !== undefined && mempoolTps !== null}
						<div>
							<dt>Mempool TPS</dt>
							<dd>
								{String((mempoolTps) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const mempoolTps = entity.mempoolTps ?? selection.entitySelector.mempoolTps ?? prefetched.mempoolTps}
					{#if mempoolTps !== undefined && mempoolTps !== null}
						<div>
							<dt>Mempool TPS</dt>
							<dd>
								{String((mempoolTps) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const averageTransactionFee24hSats = prefetched.averageTransactionFee24hSats ?? selection.entitySelector.averageTransactionFee24hSats}
					{#if averageTransactionFee24hSats !== undefined && averageTransactionFee24hSats !== null}
						<div>
							<dt>Average transaction fee 24h</dt>
							<dd>
								<NumberValue value={Number(averageTransactionFee24hSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const averageTransactionFee24hSats = entity.averageTransactionFee24hSats ?? selection.entitySelector.averageTransactionFee24hSats ?? prefetched.averageTransactionFee24hSats}
					{#if averageTransactionFee24hSats !== undefined && averageTransactionFee24hSats !== null}
						<div>
							<dt>Average transaction fee 24h</dt>
							<dd>
								<NumberValue value={Number(averageTransactionFee24hSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const medianTransactionFee24hSats = prefetched.medianTransactionFee24hSats ?? selection.entitySelector.medianTransactionFee24hSats}
					{#if medianTransactionFee24hSats !== undefined && medianTransactionFee24hSats !== null}
						<div>
							<dt>Median transaction fee 24h</dt>
							<dd>
								<NumberValue value={Number(medianTransactionFee24hSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const medianTransactionFee24hSats = entity.medianTransactionFee24hSats ?? selection.entitySelector.medianTransactionFee24hSats ?? prefetched.medianTransactionFee24hSats}
					{#if medianTransactionFee24hSats !== undefined && medianTransactionFee24hSats !== null}
						<div>
							<dt>Median transaction fee 24h</dt>
							<dd>
								<NumberValue value={Number(medianTransactionFee24hSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const suggestedTransactionFeePerByteSats = prefetched.suggestedTransactionFeePerByteSats ?? selection.entitySelector.suggestedTransactionFeePerByteSats}
					{#if suggestedTransactionFeePerByteSats !== undefined && suggestedTransactionFeePerByteSats !== null}
						<div>
							<dt>Suggested fee per byte</dt>
							<dd>
								{String((suggestedTransactionFeePerByteSats) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const suggestedTransactionFeePerByteSats = entity.suggestedTransactionFeePerByteSats ?? selection.entitySelector.suggestedTransactionFeePerByteSats ?? prefetched.suggestedTransactionFeePerByteSats}
					{#if suggestedTransactionFeePerByteSats !== undefined && suggestedTransactionFeePerByteSats !== null}
						<div>
							<dt>Suggested fee per byte</dt>
							<dd>
								{String((suggestedTransactionFeePerByteSats) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoNetworkTimestamp}>
				{#snippet Pending()}
					{@const blockchainSizeBytes = prefetched.blockchainSizeBytes ?? selection.entitySelector.blockchainSizeBytes}
					{#if blockchainSizeBytes !== undefined && blockchainSizeBytes !== null}
						<div>
							<dt>Blockchain size</dt>
							<dd>
								<NumberValue value={Number(blockchainSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const blockchainSizeBytes = entity.blockchainSizeBytes ?? selection.entitySelector.blockchainSizeBytes ?? prefetched.blockchainSizeBytes}
					{#if blockchainSizeBytes !== undefined && blockchainSizeBytes !== null}
						<div>
							<dt>Blockchain size</dt>
							<dd>
								<NumberValue value={Number(blockchainSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
