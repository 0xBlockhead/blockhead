<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadRoomPeer> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadRoomPeer = $derived(viewSelection({
		fields: {
			displayName: true,
			peerId: true,
			isConnected: true,
			joinedAt: true,
		},
	}))
	const titleFallback = $derived((prefetched.displayName ?? '') || (prefetched.peerId ?? '') || 'contact')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoomPeer}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/multiplayer/contact/[contactId=stringSegment]',
				{
					contactId: selection.entitySelector.id,
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
		<ResourceBoundary resource={blockheadRoomPeer}>
			{#snippet children(entity)}
				{(entity.displayName ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadRoomPeer}>
			{#snippet children(entity)}
				{String(entity.isConnected)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Room</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$room}
					>
						{#snippet children(blockheadRoom)}
							{@const blockheadRoomInitial = untrack(() => blockheadRoom)}
							<BlockheadRoomView
								selection={select(EntityType.BlockheadRoom, (blockheadRoom ?? blockheadRoomInitial)[EntityMetaKey.Selector])}
								prefetched={blockheadRoom ?? blockheadRoomInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Peer ID</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadRoomPeer}
					>
						{#snippet children(entity)}
							{entity.peerId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Connected</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadRoomPeer}
					>
						{#snippet children(entity)}
							{entity.isConnected ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Joined</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadRoomPeer}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.joinedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastSeenAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastSeenAt = entity.lastSeenAt}
					{#if lastSeenAt != null}
						<div>
							<dt>Last seen</dt>
							<dd>
								<Timestamp timestamp={lastSeenAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							connectedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const connectedAt = entity.connectedAt}
					{#if connectedAt != null}
						<div>
							<dt>Connected</dt>
							<dd>
								<Timestamp timestamp={connectedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							disconnectedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const disconnectedAt = entity.disconnectedAt}
					{#if disconnectedAt != null}
						<div>
							<dt>Disconnected</dt>
							<dd>
								<Timestamp timestamp={disconnectedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
