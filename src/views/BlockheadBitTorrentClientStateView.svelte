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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadBitTorrentClientState>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadBitTorrentClientState>
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
	const blockheadBitTorrentClientState = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			clientName: true,
			peerId: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			clientName: true,
			peerId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.clientName) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.clientId) ?? '')].filter(Boolean).join(' ') || 'blockhead bit torrent client state')
	const viewDomId = $derived('blockhead-bit-torrent-client-state-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadBitTorrentClientState_TimestampsView from '$/views/BlockheadBitTorrentClientState_TimestampsView.svelte'
	import BlockheadBitTorrentTransfer_TimestampsView from '$/views/BlockheadBitTorrentTransfer_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadBitTorrentClientState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'clientName') && Object.hasOwn(prefetched, 'peerId')}
			{[String((pendingEntity.clientName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadBitTorrentClientState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.clientName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'clientName') && Object.hasOwn(prefetched, 'peerId')}
			{[String((pendingEntity.peerId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.clientName) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadBitTorrentClientState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.peerId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.clientName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>client ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									clientId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const clientId = resolvedEntity.clientId}
							{#if clientId !== undefined && clientId !== null}
								{String((clientId) ?? '')}
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
							clientName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientName = resolvedEntity.clientName}
					{#if clientName !== undefined && clientName !== null}
						<div>
							<dt>client name</dt>
							<dd>
								{String((clientName) ?? '')}
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
							peerId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const peerId = resolvedEntity.peerId}
					{#if peerId !== undefined && peerId !== null}
						<div>
							<dt>peer ID</dt>
							<dd>
								{String((peerId) ?? '')}
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
							dhtNodeId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dhtNodeId = resolvedEntity.dhtNodeId}
					{#if dhtNodeId !== undefined && dhtNodeId !== null}
						<div>
							<dt>DHT node ID</dt>
							<dd>
								{String((dhtNodeId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadBitTorrentClientStateBlockheadBitTorrentClientStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadBitTorrentClientStateBlockheadBitTorrentClientStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadBitTorrentClientState_TimestampsView
					selection={blockheadBitTorrentClientStateBlockheadBitTorrentClientStateTimestampsViewTimestampsResource}
					countResource={blockheadBitTorrentClientStateBlockheadBitTorrentClientStateTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='BlockheadBitTorrentClientState_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadBitTorrentClientStateBlockheadBitTorrentTransferTimestampsViewTransfersResource = selection.$$transfers}
		<ResourceBoundary
			resource={blockheadBitTorrentClientStateBlockheadBitTorrentTransferTimestampsViewTransfersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadBitTorrentTransfer_TimestampsView
					selection={blockheadBitTorrentClientStateBlockheadBitTorrentTransferTimestampsViewTransfersResource}
					countResource={blockheadBitTorrentClientStateBlockheadBitTorrentTransferTimestampsViewTransfersResource.count}
					title='transfers'
					id='BlockheadBitTorrentTransfer_TimestampsView-transfers'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
