<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AvailNetwork_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AvailNetwork_Timestamp>>
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
	const availNetworkTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			latestBlockNumber: true,
			health: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'avail network timestamp')
	const viewDomId = $derived('avail-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvailNetworkView from '$/views/AvailNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvailNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const timestampMs0 = pendingEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
		{:else}
			<ResourceBoundary resource={availNetworkTimestamp}>
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

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const latestBlockNumber0 = pendingEntity.latestBlockNumber}
					{#if latestBlockNumber0 !== undefined && latestBlockNumber0 !== null}
						<NumberValue
							value={latestBlockNumber0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={availNetworkTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockNumber0 = resolvedEntity.latestBlockNumber}
					{#if latestBlockNumber0 !== undefined && latestBlockNumber0 !== null}
						<NumberValue
							value={latestBlockNumber0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
			{@const health1 = pendingEntity.health}
			{#if health1 !== undefined && health1 !== null}
				<span data-text="muted">
					{String((health1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={availNetworkTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source0 = resolvedEntity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
					{@const health1 = resolvedEntity.health}
					{#if health1 !== undefined && health1 !== null}
						<span data-text="muted">
							{String((health1) ?? '')}
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
					<AvailNetworkView
						selection={select(EntityType.AvailNetwork, selection.entitySelector.$network, {})}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							health: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const health = resolvedEntity.health}
					{#if health !== undefined && health !== null}
						<div>
							<dt>health</dt>
							<dd>
								{String((health) ?? '')}
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
							syncing: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const syncing = resolvedEntity.syncing}
					{#if syncing !== undefined && syncing !== null}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							latestBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockNumber = resolvedEntity.latestBlockNumber}
					{#if latestBlockNumber !== undefined && latestBlockNumber !== null}
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
						sources: selection.sources,
						fields: {
							latestBlockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockHash = resolvedEntity.latestBlockHash}
					{#if latestBlockHash !== undefined && latestBlockHash !== null}
						<div>
							<dt>latest block hash</dt>
							<dd>
								<TruncatedValue value={String((latestBlockHash) ?? '')} />
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
							finalizedBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalizedBlockNumber = resolvedEntity.finalizedBlockNumber}
					{#if finalizedBlockNumber !== undefined && finalizedBlockNumber !== null}
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
						sources: selection.sources,
						fields: {
							finalizedBlockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalizedBlockHash = resolvedEntity.finalizedBlockHash}
					{#if finalizedBlockHash !== undefined && finalizedBlockHash !== null}
						<div>
							<dt>finalized block hash</dt>
							<dd>
								<TruncatedValue value={String((finalizedBlockHash) ?? '')} />
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
							appIdCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const appIdCount = resolvedEntity.appIdCount}
					{#if appIdCount !== undefined && appIdCount !== null}
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
						sources: selection.sources,
						fields: {
							dataSubmissionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataSubmissionCount = resolvedEntity.dataSubmissionCount}
					{#if dataSubmissionCount !== undefined && dataSubmissionCount !== null}
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
