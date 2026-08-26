<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ZeroGNetwork_Timestamp>, 'prefetched'> = $props()

	const zeroGNetworkTimestamp = $derived(selection({
		fields: {
			storageTransactionCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ZeroGNetworkView from '$/views/ZeroGNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'zero g network timestamp'}
	href={
		href === undefined ?
			resolve(
				'/zerog/[slug=stringSegment]/(zeroGNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					slug: selection.entitySelector.$network.slug,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ZeroGNetworkView
			selection={select(EntityType.ZeroGNetwork, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zeroGNetworkTimestamp}>
			{#snippet children(entity)}
				{@const storageTransactionCount = entity.storageTransactionCount}
				{#if storageTransactionCount != null}
					<span data-text="muted">
						<NumberValue
							value={storageTransactionCount}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<ZeroGNetworkView
						selection={select(EntityType.ZeroGNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
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
				{#snippet children(entity)}
					{@const storageLogSyncHeight = entity.storageLogSyncHeight}
					{#if storageLogSyncHeight != null}
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
						fields: {
							storageLayer1LogSyncHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storageLayer1LogSyncHeight = entity.storageLayer1LogSyncHeight}
					{#if storageLayer1LogSyncHeight != null}
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
				resource={zeroGNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const storageTransactionCount = entity.storageTransactionCount}
					{#if storageTransactionCount != null}
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
						fields: {
							latestDataRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestDataRoot = entity.latestDataRoot}
					{#if latestDataRoot != null}
						<div>
							<dt>latest data root</dt>
							<dd>
								{latestDataRoot}
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
				{#snippet children(entity)}
					{@const latestDataSizeBytes = entity.latestDataSizeBytes}
					{#if latestDataSizeBytes != null}
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
						fields: {
							latestStorageTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestStorageTxHash = entity.latestStorageTxHash}
					{#if latestStorageTxHash != null}
						<div>
							<dt>latest storage transaction hash</dt>
							<dd>
								<TruncatedValue value={latestStorageTxHash} />
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
				{#snippet children(entity)}
					{@const storageMinerCount = entity.storageMinerCount}
					{#if storageMinerCount != null}
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
						fields: {
							latestStorageMiner: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestStorageMiner = entity.latestStorageMiner}
					{#if latestStorageMiner != null}
						<div>
							<dt>latest storage miner</dt>
							<dd>
								{latestStorageMiner}
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
				{#snippet children(entity)}
					{@const storageFeeTotal = entity.storageFeeTotal}
					{#if storageFeeTotal != null}
						<div>
							<dt>storage fee total</dt>
							<dd>
								{storageFeeTotal}
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
				{#snippet children(entity)}
					{@const storageRewardTotal = entity.storageRewardTotal}
					{#if storageRewardTotal != null}
						<div>
							<dt>storage reward total</dt>
							<dd>
								{storageRewardTotal}
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
				{#snippet children(entity)}
					{@const storageTotalWinCount = entity.storageTotalWinCount}
					{#if storageTotalWinCount != null}
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
						fields: {
							expiredFileCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expiredFileCount = entity.expiredFileCount}
					{#if expiredFileCount != null}
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
						fields: {
							prunedFileCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const prunedFileCount = entity.prunedFileCount}
					{#if prunedFileCount != null}
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
