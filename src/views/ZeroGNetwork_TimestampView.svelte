<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.ZeroGNetwork_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.ZeroGNetwork_Timestamp>
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
	const zeroGNetworkTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			storageTransactionCount: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			storageTransactionCount: true,
		},
	}))
	const titleFallback = 'zero g network timestamp'
	const viewDomId = $derived('zero-gnetwork-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ZeroGNetworkView from '$/views/ZeroGNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$network') && prefetched.$network != null && Object.hasOwn(prefetched.$network, 'name') && Object.hasOwn(prefetched.$network, 'environment') && Object.hasOwn(prefetched, 'storageTransactionCount')}
			{@const zeroGNetwork0 = pendingEntity.$network}
			{#if zeroGNetwork0 != null && selection.entitySelector.$network != null}
				<ZeroGNetworkView
					selection={select(EntityType.ZeroGNetwork, selection.entitySelector.$network, { sources: selection.sources })}
					prefetched={zeroGNetwork0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={zeroGNetworkTimestamp}>
				{#snippet children(entity)}
					<ZeroGNetworkView
						selection={select(EntityType.ZeroGNetwork, selection.entitySelector.$network)}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$network') && prefetched.$network != null && Object.hasOwn(prefetched.$network, 'name') && Object.hasOwn(prefetched.$network, 'environment') && Object.hasOwn(prefetched, 'storageTransactionCount')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={zeroGNetworkTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$network') && prefetched.$network != null && Object.hasOwn(prefetched.$network, 'name') && Object.hasOwn(prefetched.$network, 'environment') && Object.hasOwn(prefetched, 'storageTransactionCount')}
			{@const storageTransactionCount0 = pendingEntity.storageTransactionCount}
			{#if storageTransactionCount0 !== undefined && storageTransactionCount0 !== null}
				<span data-text="muted">
					<NumberValue
						value={storageTransactionCount0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={zeroGNetworkTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageTransactionCount0 = resolvedEntity.storageTransactionCount}
					{#if storageTransactionCount0 !== undefined && storageTransactionCount0 !== null}
						<span data-text="muted">
							<NumberValue
								value={storageTransactionCount0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<ZeroGNetworkView
						selection={select(EntityType.ZeroGNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							storageLogSyncHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageLogSyncHeight = resolvedEntity.storageLogSyncHeight}
					{#if storageLogSyncHeight !== undefined && storageLogSyncHeight !== null}
						<div>
							<dt>storage log sync height</dt>
							<dd>
								<NumberValue
									value={storageLogSyncHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							storageLayer1LogSyncHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageLayer1LogSyncHeight = resolvedEntity.storageLayer1LogSyncHeight}
					{#if storageLayer1LogSyncHeight !== undefined && storageLayer1LogSyncHeight !== null}
						<div>
							<dt>storage layer1 log sync height</dt>
							<dd>
								<NumberValue
									value={storageLayer1LogSyncHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							storageTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageTransactionCount = resolvedEntity.storageTransactionCount}
					{#if storageTransactionCount !== undefined && storageTransactionCount !== null}
						<div>
							<dt>storage transaction count</dt>
							<dd>
								<NumberValue
									value={storageTransactionCount}
								/>
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
						sources: selection.sources,
						fields: {
							latestDataRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestDataRoot = resolvedEntity.latestDataRoot}
					{#if latestDataRoot !== undefined && latestDataRoot !== null}
						<div>
							<dt>latest data root</dt>
							<dd>
								{String((latestDataRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							latestDataSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestDataSizeBytes = resolvedEntity.latestDataSizeBytes}
					{#if latestDataSizeBytes !== undefined && latestDataSizeBytes !== null}
						<div>
							<dt>latest data size bytes</dt>
							<dd>
								<NumberValue
									value={latestDataSizeBytes}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							latestStorageTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestStorageTxHash = resolvedEntity.latestStorageTxHash}
					{#if latestStorageTxHash !== undefined && latestStorageTxHash !== null}
						<div>
							<dt>latest storage transaction hash</dt>
							<dd>
								<TruncatedValue value={String((latestStorageTxHash) ?? '')} />
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
						sources: selection.sources,
						fields: {
							storageMinerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageMinerCount = resolvedEntity.storageMinerCount}
					{#if storageMinerCount !== undefined && storageMinerCount !== null}
						<div>
							<dt>storage miner count</dt>
							<dd>
								<NumberValue
									value={storageMinerCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							latestStorageMiner: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestStorageMiner = resolvedEntity.latestStorageMiner}
					{#if latestStorageMiner !== undefined && latestStorageMiner !== null}
						<div>
							<dt>latest storage miner</dt>
							<dd>
								{String((latestStorageMiner) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							storageFeeTotal: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageFeeTotal = resolvedEntity.storageFeeTotal}
					{#if storageFeeTotal !== undefined && storageFeeTotal !== null}
						<div>
							<dt>storage fee total</dt>
							<dd>
								{String((storageFeeTotal) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							storageRewardTotal: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageRewardTotal = resolvedEntity.storageRewardTotal}
					{#if storageRewardTotal !== undefined && storageRewardTotal !== null}
						<div>
							<dt>storage reward total</dt>
							<dd>
								{String((storageRewardTotal) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							storageTotalWinCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageTotalWinCount = resolvedEntity.storageTotalWinCount}
					{#if storageTotalWinCount !== undefined && storageTotalWinCount !== null}
						<div>
							<dt>storage total win count</dt>
							<dd>
								<NumberValue
									value={storageTotalWinCount}
								/>
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
						sources: selection.sources,
						fields: {
							expiredFileCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expiredFileCount = resolvedEntity.expiredFileCount}
					{#if expiredFileCount !== undefined && expiredFileCount !== null}
						<div>
							<dt>expired file count</dt>
							<dd>
								<NumberValue
									value={expiredFileCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							prunedFileCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const prunedFileCount = resolvedEntity.prunedFileCount}
					{#if prunedFileCount !== undefined && prunedFileCount !== null}
						<div>
							<dt>pruned file count</dt>
							<dd>
								<NumberValue
									value={prunedFileCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
