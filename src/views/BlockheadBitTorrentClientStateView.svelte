<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadBitTorrentClientState> = $props()

	const blockheadBitTorrentClientState = $derived(selection({
		fields: {
			clientName: true,
			peerId: true,
		},
	}))
	const titleFallback = $derived((prefetched.clientName ?? '') || selection.entitySelector.clientId || 'blockhead bit torrent client state')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadBitTorrentClientState_TimestampsView from '$/views/BlockheadBitTorrentClientState_TimestampsView.svelte'
	import BlockheadBitTorrentTransfer_TimestampsView from '$/views/BlockheadBitTorrentTransfer_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadBitTorrentClientState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadBitTorrentClientState}>
			{#snippet children(entity)}
				{(entity.clientName ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadBitTorrentClientState}>
			{#snippet children(entity)}
				{(entity.peerId ?? '') || (entity.clientName ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>client ID</dt>
				<dd>
					{selection.entitySelector.clientId}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadBitTorrentClientState}
			>
				{#snippet children(entity)}
					{@const clientName = entity.clientName}
					{#if clientName != null}
						<div>
							<dt>client name</dt>
							<dd>
								{clientName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadBitTorrentClientState}
			>
				{#snippet children(entity)}
					{@const peerId = entity.peerId}
					{#if peerId != null}
						<div>
							<dt>peer ID</dt>
							<dd>
								{peerId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dhtNodeId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dhtNodeId = entity.dhtNodeId}
					{#if dhtNodeId != null}
						<div>
							<dt>DHT node ID</dt>
							<dd>
								{dhtNodeId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadBitTorrentClientState_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const transfersResource = selection.$$transfers}
		<ResourceBoundary
			resource={transfersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadBitTorrentTransfer_TimestampsView
						selection={transfersResource}
						countResource={transfersResource.count}
						title='transfers'
						id='transfers'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
