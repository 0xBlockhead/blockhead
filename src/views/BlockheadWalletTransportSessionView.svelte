<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadWalletTransportSession>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWalletTransportSession = $derived(viewSelection({
		fields: {
			transportKind: true,
			sessionKind: true,
			status: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.transportSessionId || 'blockhead wallet transport session')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletTransportSession}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletTransportSession}>
			{#snippet children(entity)}
				{[entity.status, entity.transportKind].filter(Boolean).join(' ') || selection.entitySelector.transportSessionId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>connection key</dt>
				<dd>
					{selection.entitySelector.connectionKey}
				</dd>
			</div>

			<div>
				<dt>transport session ID</dt>
				<dd>
					{selection.entitySelector.transportSessionId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$connection}
			>
				{#snippet children(blockheadWalletConnection)}
					{#if blockheadWalletConnection != null}
						<div>
							<dt>connection</dt>
							<dd>
								<BlockheadWalletConnectionView
									selection={select(EntityType.BlockheadWalletConnection, blockheadWalletConnection[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>transport kind</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletTransportSession}
					>
						{#snippet children(entity)}
							{entity.transportKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>session kind</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletTransportSession}
					>
						{#snippet children(entity)}
							{entity.sessionKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletTransportSession}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							topic: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const topic = entity.topic}
					{#if topic != null}
						<div>
							<dt>topic</dt>
							<dd>
								{topic}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							peerId: true,
						},
					})
				}
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
					viewSelection({
						fields: {
							relayProtocol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const relayProtocol = entity.relayProtocol}
					{#if relayProtocol != null}
						<div>
							<dt>relay protocol</dt>
							<dd>
								{relayProtocol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							bridgeUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bridgeUrl = entity.bridgeUrl}
					{#if bridgeUrl != null}
						<div>
							<dt>bridge URL</dt>
							<dd>
								<a
									href={bridgeUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={bridgeUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							manifestUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const manifestUrl = entity.manifestUrl}
					{#if manifestUrl != null}
						<div>
							<dt>manifest URL</dt>
							<dd>
								<a
									href={manifestUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={manifestUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							origin: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const origin = entity.origin}
					{#if origin != null}
						<div>
							<dt>origin</dt>
							<dd>
								{origin}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							deviceId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deviceId = entity.deviceId}
					{#if deviceId != null}
						<div>
							<dt>device ID</dt>
							<dd>
								{deviceId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const updatedAt = entity.updatedAt}
					{#if updatedAt != null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={updatedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expiresAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expiresAt = entity.expiresAt}
					{#if expiresAt != null}
						<div>
							<dt>expires AT</dt>
							<dd>
								<Timestamp timestamp={expiresAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
