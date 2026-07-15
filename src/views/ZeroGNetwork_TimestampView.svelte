<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ZeroGNetwork_Timestamp>>
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
	const zeroGNetworkTimestamp = $derived(selection({
		sources: [
			Source.ZeroGStorageScan_Rest,
		],
		fields: {
			storageTransactionCount: true,
		},
	}))
	const titleFallback = $derived('zero g network timestamp')
	const viewDomId = $derived('zero-gnetwork-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={zeroGNetworkTimestamp}>
			{#snippet Pending()}
				<ZeroGNetworkView
					selection={select(EntityType.ZeroGNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ZeroGNetworkView
					selection={select(EntityType.ZeroGNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zeroGNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
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

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zeroGNetworkTimestamp}>
			{#snippet Pending()}
				{@const storageTransactionCount0 = pendingEntity.storageTransactionCount}
				{#if storageTransactionCount0 !== undefined && storageTransactionCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(storageTransactionCount0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const storageTransactionCount0 = resolvedEntity.storageTransactionCount}
				{#if storageTransactionCount0 !== undefined && storageTransactionCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(storageTransactionCount0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<ZeroGNetworkView
						selection={select(EntityType.ZeroGNetwork, selection.entitySelector.$network, {})}
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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
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
							{@const source = pendingEntity.source}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageLogSyncHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageLogSyncHeight = pendingEntity.storageLogSyncHeight}
					{#if storageLogSyncHeight !== undefined && storageLogSyncHeight !== null}
						<div>
							<dt>storage log sync height</dt>
							<dd>
								<NumberValue value={Number(storageLogSyncHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageLogSyncHeight = resolvedEntity.storageLogSyncHeight}
					{#if storageLogSyncHeight !== undefined && storageLogSyncHeight !== null}
						<div>
							<dt>storage log sync height</dt>
							<dd>
								<NumberValue value={Number(storageLogSyncHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageLayer1LogSyncHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageLayer1LogSyncHeight = pendingEntity.storageLayer1LogSyncHeight}
					{#if storageLayer1LogSyncHeight !== undefined && storageLayer1LogSyncHeight !== null}
						<div>
							<dt>storage layer1 log sync height</dt>
							<dd>
								<NumberValue value={Number(storageLayer1LogSyncHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageLayer1LogSyncHeight = resolvedEntity.storageLayer1LogSyncHeight}
					{#if storageLayer1LogSyncHeight !== undefined && storageLayer1LogSyncHeight !== null}
						<div>
							<dt>storage layer1 log sync height</dt>
							<dd>
								<NumberValue value={Number(storageLayer1LogSyncHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageTransactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageTransactionCount = pendingEntity.storageTransactionCount}
					{#if storageTransactionCount !== undefined && storageTransactionCount !== null}
						<div>
							<dt>storage transaction count</dt>
							<dd>
								<NumberValue value={Number(storageTransactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageTransactionCount = resolvedEntity.storageTransactionCount}
					{#if storageTransactionCount !== undefined && storageTransactionCount !== null}
						<div>
							<dt>storage transaction count</dt>
							<dd>
								<NumberValue value={Number(storageTransactionCount)} />
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
							latestDataRoot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestDataRoot = pendingEntity.latestDataRoot}
					{#if latestDataRoot !== undefined && latestDataRoot !== null}
						<div>
							<dt>latest data root</dt>
							<dd>
								{String((latestDataRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							latestDataSizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestDataSizeBytes = pendingEntity.latestDataSizeBytes}
					{#if latestDataSizeBytes !== undefined && latestDataSizeBytes !== null}
						<div>
							<dt>latest data size bytes</dt>
							<dd>
								<NumberValue value={Number(latestDataSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestDataSizeBytes = resolvedEntity.latestDataSizeBytes}
					{#if latestDataSizeBytes !== undefined && latestDataSizeBytes !== null}
						<div>
							<dt>latest data size bytes</dt>
							<dd>
								<NumberValue value={Number(latestDataSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestStorageTxHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestStorageTxHash = pendingEntity.latestStorageTxHash}
					{#if latestStorageTxHash !== undefined && latestStorageTxHash !== null}
						<div>
							<dt>latest storage transaction hash</dt>
							<dd>
								<TruncatedValue value={String((latestStorageTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							storageMinerCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageMinerCount = pendingEntity.storageMinerCount}
					{#if storageMinerCount !== undefined && storageMinerCount !== null}
						<div>
							<dt>storage miner count</dt>
							<dd>
								<NumberValue value={Number(storageMinerCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageMinerCount = resolvedEntity.storageMinerCount}
					{#if storageMinerCount !== undefined && storageMinerCount !== null}
						<div>
							<dt>storage miner count</dt>
							<dd>
								<NumberValue value={Number(storageMinerCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestStorageMiner: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestStorageMiner = pendingEntity.latestStorageMiner}
					{#if latestStorageMiner !== undefined && latestStorageMiner !== null}
						<div>
							<dt>latest storage miner</dt>
							<dd>
								{String((latestStorageMiner) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							storageFeeTotal: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageFeeTotal = pendingEntity.storageFeeTotal}
					{#if storageFeeTotal !== undefined && storageFeeTotal !== null}
						<div>
							<dt>storage fee total</dt>
							<dd>
								{String((storageFeeTotal) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							storageRewardTotal: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageRewardTotal = pendingEntity.storageRewardTotal}
					{#if storageRewardTotal !== undefined && storageRewardTotal !== null}
						<div>
							<dt>storage reward total</dt>
							<dd>
								{String((storageRewardTotal) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							storageTotalWinCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageTotalWinCount = pendingEntity.storageTotalWinCount}
					{#if storageTotalWinCount !== undefined && storageTotalWinCount !== null}
						<div>
							<dt>storage total win count</dt>
							<dd>
								<NumberValue value={Number(storageTotalWinCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageTotalWinCount = resolvedEntity.storageTotalWinCount}
					{#if storageTotalWinCount !== undefined && storageTotalWinCount !== null}
						<div>
							<dt>storage total win count</dt>
							<dd>
								<NumberValue value={Number(storageTotalWinCount)} />
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
							expiredFileCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expiredFileCount = pendingEntity.expiredFileCount}
					{#if expiredFileCount !== undefined && expiredFileCount !== null}
						<div>
							<dt>expired file count</dt>
							<dd>
								<NumberValue value={Number(expiredFileCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expiredFileCount = resolvedEntity.expiredFileCount}
					{#if expiredFileCount !== undefined && expiredFileCount !== null}
						<div>
							<dt>expired file count</dt>
							<dd>
								<NumberValue value={Number(expiredFileCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							prunedFileCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const prunedFileCount = pendingEntity.prunedFileCount}
					{#if prunedFileCount !== undefined && prunedFileCount !== null}
						<div>
							<dt>pruned file count</dt>
							<dd>
								<NumberValue value={Number(prunedFileCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const prunedFileCount = resolvedEntity.prunedFileCount}
					{#if prunedFileCount !== undefined && prunedFileCount !== null}
						<div>
							<dt>pruned file count</dt>
							<dd>
								<NumberValue value={Number(prunedFileCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
