<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadBitTorrentClientState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadBitTorrentClientState_Timestamp>>
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
	const blockheadBitTorrentClientStateTimestamp = $derived(selection({
		fields: {
			clientVersion: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead bit torrent client state timestamp')
	const viewDomId = $derived('blockhead-bit-torrent-client-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadBitTorrentClientStateView from '$/views/BlockheadBitTorrentClientStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadBitTorrentClientState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadBitTorrentClientStateTimestamp}>
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
		<ResourceBoundary resource={blockheadBitTorrentClientStateTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.clientVersion) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'blockhead bit torrent client state timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.clientVersion) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadBitTorrentClientStateTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
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
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>client state</dt>
				<dd>
					<BlockheadBitTorrentClientStateView
						selection={select(EntityType.BlockheadBitTorrentClientState, selection.entitySelector.$clientState, {})}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							clientVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const clientVersion = prefetched.clientVersion}
					{#if clientVersion !== undefined && clientVersion !== null}
						<div>
							<dt>client version</dt>
							<dd>
								{String((clientVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientVersion = resolvedEntity.clientVersion}
					{#if clientVersion !== undefined && clientVersion !== null}
						<div>
							<dt>client version</dt>
							<dd>
								{String((clientVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>listen addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									listenAddresses: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const listenAddresses = prefetched.listenAddresses}
							{#if listenAddresses !== undefined && listenAddresses !== null}
								<TruncatedValue value={listenAddresses.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const listenAddresses = resolvedEntity.listenAddresses}
							{#if listenAddresses !== undefined && listenAddresses !== null}
								<TruncatedValue value={listenAddresses.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							port: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const port = prefetched.port}
					{#if port !== undefined && port !== null}
						<div>
							<dt>port</dt>
							<dd>
								<NumberValue value={Number(port)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const port = resolvedEntity.port}
					{#if port !== undefined && port !== null}
						<div>
							<dt>port</dt>
							<dd>
								<NumberValue value={Number(port)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activeTorrentCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activeTorrentCount = prefetched.activeTorrentCount}
					{#if activeTorrentCount !== undefined && activeTorrentCount !== null}
						<div>
							<dt>active torrent count</dt>
							<dd>
								<NumberValue value={Number(activeTorrentCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeTorrentCount = resolvedEntity.activeTorrentCount}
					{#if activeTorrentCount !== undefined && activeTorrentCount !== null}
						<div>
							<dt>active torrent count</dt>
							<dd>
								<NumberValue value={Number(activeTorrentCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastSyncedAt = prefetched.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastSyncedAt = resolvedEntity.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
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
							downloadRate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const downloadRate = prefetched.downloadRate}
					{#if downloadRate !== undefined && downloadRate !== null}
						<div>
							<dt>download rate</dt>
							<dd>
								<NumberValue value={Number(downloadRate)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const downloadRate = resolvedEntity.downloadRate}
					{#if downloadRate !== undefined && downloadRate !== null}
						<div>
							<dt>download rate</dt>
							<dd>
								<NumberValue value={Number(downloadRate)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							uploadRate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const uploadRate = prefetched.uploadRate}
					{#if uploadRate !== undefined && uploadRate !== null}
						<div>
							<dt>upload rate</dt>
							<dd>
								<NumberValue value={Number(uploadRate)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const uploadRate = resolvedEntity.uploadRate}
					{#if uploadRate !== undefined && uploadRate !== null}
						<div>
							<dt>upload rate</dt>
							<dd>
								<NumberValue value={Number(uploadRate)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							downloadedBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const downloadedBytes = prefetched.downloadedBytes}
					{#if downloadedBytes !== undefined && downloadedBytes !== null}
						<div>
							<dt>downloaded bytes</dt>
							<dd>
								<NumberValue value={Number(downloadedBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const downloadedBytes = resolvedEntity.downloadedBytes}
					{#if downloadedBytes !== undefined && downloadedBytes !== null}
						<div>
							<dt>downloaded bytes</dt>
							<dd>
								<NumberValue value={Number(downloadedBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							uploadedBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const uploadedBytes = prefetched.uploadedBytes}
					{#if uploadedBytes !== undefined && uploadedBytes !== null}
						<div>
							<dt>uploaded bytes</dt>
							<dd>
								<NumberValue value={Number(uploadedBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const uploadedBytes = resolvedEntity.uploadedBytes}
					{#if uploadedBytes !== undefined && uploadedBytes !== null}
						<div>
							<dt>uploaded bytes</dt>
							<dd>
								<NumberValue value={Number(uploadedBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
