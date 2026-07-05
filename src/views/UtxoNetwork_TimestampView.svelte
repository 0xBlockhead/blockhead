<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const utxoNetworkTimestamp = $derived(selection({
		fields: {
			bestBlockHeight: true,
			bestBlockHash: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'UTXO network timestamp')
	const viewDomId = $derived('utxo-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/observations/[timestampMs=nonNegativeInteger]/[source]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$network.caip2.namespace) + ':' + String(pendingEntity.$network.caip2.reference))].slug ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={utxoNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={utxoNetworkTimestamp}>
			{#snippet Pending()}
				{@const bestBlockHeight0 = prefetched.bestBlockHeight}
				{#if bestBlockHeight0 !== undefined && bestBlockHeight0 !== null}
					<NumberValue value={Number(bestBlockHeight0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const bestBlockHeight0 = resolvedEntity.bestBlockHeight}
				{#if bestBlockHeight0 !== undefined && bestBlockHeight0 !== null}
					<NumberValue value={Number(bestBlockHeight0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={utxoNetworkTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
				{@const bestBlockHash1 = prefetched.bestBlockHash}
				{#if bestBlockHash1 !== undefined && bestBlockHash1 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((bestBlockHash1) ?? '')} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
				{@const bestBlockHash1 = resolvedEntity.bestBlockHash}
				{#if bestBlockHash1 !== undefined && bestBlockHash1 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((bestBlockHash1) ?? '')} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							bestBlockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bestBlockHeight = prefetched.bestBlockHeight}
					{#if bestBlockHeight !== undefined && bestBlockHeight !== null}
						<div>
							<dt>Best block height</dt>
							<dd>
								<NumberValue value={Number(bestBlockHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bestBlockHeight = resolvedEntity.bestBlockHeight}
					{#if bestBlockHeight !== undefined && bestBlockHeight !== null}
						<div>
							<dt>Best block height</dt>
							<dd>
								<NumberValue value={Number(bestBlockHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bestBlockHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bestBlockHash = prefetched.bestBlockHash}
					{#if bestBlockHash !== undefined && bestBlockHash !== null}
						<div>
							<dt>Best block hash</dt>
							<dd>
								<TruncatedValue value={String((bestBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bestBlockHash = resolvedEntity.bestBlockHash}
					{#if bestBlockHash !== undefined && bestBlockHash !== null}
						<div>
							<dt>Best block hash</dt>
							<dd>
								<TruncatedValue value={String((bestBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bestBlockTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bestBlockTimeMs = prefetched.bestBlockTimeMs}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bestBlockTimeMs = resolvedEntity.bestBlockTimeMs}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockCount = prefetched.blockCount}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockCount = resolvedEntity.blockCount}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionCount = prefetched.transactionCount}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionCount = resolvedEntity.transactionCount}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							blocks24h: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blocks24h = prefetched.blocks24h}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blocks24h = resolvedEntity.blocks24h}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactions24h: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactions24h = prefetched.transactions24h}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactions24h = resolvedEntity.transactions24h}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mempoolTransactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mempoolTransactionCount = prefetched.mempoolTransactionCount}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mempoolTransactionCount = resolvedEntity.mempoolTransactionCount}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mempoolSizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mempoolSizeBytes = prefetched.mempoolSizeBytes}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mempoolSizeBytes = resolvedEntity.mempoolSizeBytes}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mempoolTps: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mempoolTps = prefetched.mempoolTps}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mempoolTps = resolvedEntity.mempoolTps}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							averageTransactionFee24hSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const averageTransactionFee24hSats = prefetched.averageTransactionFee24hSats}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const averageTransactionFee24hSats = resolvedEntity.averageTransactionFee24hSats}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							medianTransactionFee24hSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const medianTransactionFee24hSats = prefetched.medianTransactionFee24hSats}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const medianTransactionFee24hSats = resolvedEntity.medianTransactionFee24hSats}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							suggestedTransactionFeePerByteSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const suggestedTransactionFeePerByteSats = prefetched.suggestedTransactionFeePerByteSats}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const suggestedTransactionFeePerByteSats = resolvedEntity.suggestedTransactionFeePerByteSats}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockchainSizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockchainSizeBytes = prefetched.blockchainSizeBytes}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockchainSizeBytes = resolvedEntity.blockchainSizeBytes}
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
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
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
