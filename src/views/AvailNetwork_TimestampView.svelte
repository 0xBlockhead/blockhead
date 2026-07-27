<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AvailNetwork_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const availNetworkTimestamp = $derived(selection({
		fields: {
			latestBlockNumber: true,
			health: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'avail network timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvailNetworkView from '$/views/AvailNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvailNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={availNetworkTimestamp}>
			{#snippet children(entity)}
				{@const latestBlockNumber0 = entity.latestBlockNumber}
				{#if latestBlockNumber0 != null}
					<NumberValue
						value={latestBlockNumber0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={availNetworkTimestamp}>
			{#snippet children(entity)}
				<span data-text="muted">
					{pendingEntity.source}
				</span>
				{@const health1 = entity.health}
				{#if health1 != null}
					<span data-text="muted">
						{health1}
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
					<AvailNetworkView
						selection={select(EntityType.AvailNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={availNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const health = entity.health}
					{#if health != null}
						<div>
							<dt>health</dt>
							<dd>
								{health}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							syncing: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const syncing = entity.syncing}
					{#if syncing != null}
						<div>
							<dt>syncing</dt>
							<dd>
								{syncing ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={availNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const latestBlockNumber = entity.latestBlockNumber}
					{#if latestBlockNumber != null}
						<div>
							<dt>latest block number</dt>
							<dd>
								<NumberValue
									value={latestBlockNumber}
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
							latestBlockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockHash = entity.latestBlockHash}
					{#if latestBlockHash != null}
						<div>
							<dt>latest block hash</dt>
							<dd>
								<TruncatedValue value={latestBlockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							finalizedBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const finalizedBlockNumber = entity.finalizedBlockNumber}
					{#if finalizedBlockNumber != null}
						<div>
							<dt>finalized block number</dt>
							<dd>
								<NumberValue
									value={finalizedBlockNumber}
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
							finalizedBlockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const finalizedBlockHash = entity.finalizedBlockHash}
					{#if finalizedBlockHash != null}
						<div>
							<dt>finalized block hash</dt>
							<dd>
								<TruncatedValue value={finalizedBlockHash} />
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
							appIdCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const appIdCount = entity.appIdCount}
					{#if appIdCount != null}
						<div>
							<dt>app ID count</dt>
							<dd>
								<NumberValue
									value={appIdCount}
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
							dataSubmissionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dataSubmissionCount = entity.dataSubmissionCount}
					{#if dataSubmissionCount != null}
						<div>
							<dt>data submission count</dt>
							<dd>
								<NumberValue
									value={dataSubmissionCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
