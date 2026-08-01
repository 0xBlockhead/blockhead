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
	}: EntitySelectionViewProps<EntityType.BlockheadBitTorrentClientState_Timestamp> = $props()

	const blockheadBitTorrentClientStateTimestamp = $derived(selection({
		fields: {
			clientVersion: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadBitTorrentClientStateView from '$/views/BlockheadBitTorrentClientStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadBitTorrentClientState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadBitTorrentClientStateTimestamp}>
			{#snippet children(entity)}
				{(entity.clientVersion ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>client state</dt>
				<dd>
					<BlockheadBitTorrentClientStateView
						selection={select(EntityType.BlockheadBitTorrentClientState, selection.entitySelector.$clientState)}
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

			<ResourceBoundary
				resource={blockheadBitTorrentClientStateTimestamp}
			>
				{#snippet children(entity)}
					{@const clientVersion = entity.clientVersion}
					{#if clientVersion != null}
						<div>
							<dt>client version</dt>
							<dd>
								{clientVersion}
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
						{#snippet children(entity)}
							{entity.listenAddresses.values.join(', ')}
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
				{#snippet children(entity)}
					{@const port = entity.port}
					{#if port != null}
						<div>
							<dt>port</dt>
							<dd>
								<NumberValue
									value={port}
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
							activeTorrentCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeTorrentCount = entity.activeTorrentCount}
					{#if activeTorrentCount != null}
						<div>
							<dt>active torrent count</dt>
							<dd>
								<NumberValue
									value={activeTorrentCount}
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
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastSyncedAt = entity.lastSyncedAt}
					{#if lastSyncedAt != null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={lastSyncedAt} />
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
				{#snippet children(entity)}
					{@const downloadRate = entity.downloadRate}
					{#if downloadRate != null}
						<div>
							<dt>download rate</dt>
							<dd>
								<NumberValue
									value={downloadRate}
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
							uploadRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const uploadRate = entity.uploadRate}
					{#if uploadRate != null}
						<div>
							<dt>upload rate</dt>
							<dd>
								<NumberValue
									value={uploadRate}
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
							downloadedBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const downloadedBytes = entity.downloadedBytes}
					{#if downloadedBytes != null}
						<div>
							<dt>downloaded bytes</dt>
							<dd>
								<NumberValue
									value={downloadedBytes}
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
							uploadedBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const uploadedBytes = entity.uploadedBytes}
					{#if uploadedBytes != null}
						<div>
							<dt>uploaded bytes</dt>
							<dd>
								<NumberValue
									value={uploadedBytes}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
