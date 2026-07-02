<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRoomPeer>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadRoomPeer>>
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

	const blockheadRoomPeer = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			displayName: true,
			peerId: true,
			isConnected: true,
			joinedAt: true,
			...(open && {
				$room: true,
				lastSeenAt: true,
				connectedAt: true,
				disconnectedAt: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.peerId) ?? '')].filter(Boolean).join(' ') || 'contact')
	const viewDomId = $derived('blockhead-room-peer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoomPeer}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.peerId) ?? '')].filter(Boolean).join(' ') || 'contact'}
		{:else}
			<ResourceBoundary resource={blockheadRoomPeer}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.peerId) ?? '')].filter(Boolean).join(' ') || 'contact'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.displayName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).isConnected) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.peerId) ?? '')].filter(Boolean).join(' ') || 'contact'}
		{:else}
			<ResourceBoundary resource={blockheadRoomPeer}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).isConnected) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.peerId) ?? '')].filter(Boolean).join(' ') || 'contact'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.isConnected) ?? '')].filter(Boolean).join(' ') || [String((entity.displayName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Room</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.BlockheadRoom, false>('$room')}
					>
						{#snippet children(blockheadRoom)}
							<BlockheadRoomView
								selection={select(EntityType.BlockheadRoom, blockheadRoom.entitySelector)}
								prefetched={blockheadRoom}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Joined</dt>
				<dd>
					<ResourceBoundary resource={blockheadRoomPeer}>
						{#snippet Pending()}
							{@const joinedAt = prefetched.joinedAt ?? selection.entitySelector.joinedAt}
							{#if joinedAt !== undefined && joinedAt !== null}
								<Timestamp timestamp={Number(joinedAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const joinedAt = entity.joinedAt ?? selection.entitySelector.joinedAt ?? prefetched.joinedAt}
							{#if joinedAt !== undefined && joinedAt !== null}
								<Timestamp timestamp={Number(joinedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={blockheadRoomPeer}>
				{#snippet Pending()}
					{@const lastSeenAt = prefetched.lastSeenAt ?? selection.entitySelector.lastSeenAt}
					{#if lastSeenAt !== undefined && lastSeenAt !== null}
						<div>
							<dt>Last seen</dt>
							<dd>
								<Timestamp timestamp={Number(lastSeenAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const lastSeenAt = entity.lastSeenAt ?? selection.entitySelector.lastSeenAt ?? prefetched.lastSeenAt}
					{#if lastSeenAt !== undefined && lastSeenAt !== null}
						<div>
							<dt>Last seen</dt>
							<dd>
								<Timestamp timestamp={Number(lastSeenAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={blockheadRoomPeer}>
				{#snippet Pending()}
					{@const connectedAt = prefetched.connectedAt ?? selection.entitySelector.connectedAt}
					{#if connectedAt !== undefined && connectedAt !== null}
						<div>
							<dt>Connected</dt>
							<dd>
								<Timestamp timestamp={Number(connectedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const connectedAt = entity.connectedAt ?? selection.entitySelector.connectedAt ?? prefetched.connectedAt}
					{#if connectedAt !== undefined && connectedAt !== null}
						<div>
							<dt>Connected</dt>
							<dd>
								<Timestamp timestamp={Number(connectedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={blockheadRoomPeer}>
				{#snippet Pending()}
					{@const disconnectedAt = prefetched.disconnectedAt ?? selection.entitySelector.disconnectedAt}
					{#if disconnectedAt !== undefined && disconnectedAt !== null}
						<div>
							<dt>Disconnected</dt>
							<dd>
								<Timestamp timestamp={Number(disconnectedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const disconnectedAt = entity.disconnectedAt ?? selection.entitySelector.disconnectedAt ?? prefetched.disconnectedAt}
					{#if disconnectedAt !== undefined && disconnectedAt !== null}
						<div>
							<dt>Disconnected</dt>
							<dd>
								<Timestamp timestamp={Number(disconnectedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
