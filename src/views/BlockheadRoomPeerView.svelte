<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


	// Props
	let {
		children,
		entityId,
		title: titleProp,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadRoomPeer>
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Summary'
		>
	> = $props()


	const peerRowIdKey = $derived(
		stringify(entityId),
	)

	const peerQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.BlockheadRoomPeer] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						peerRowIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => peerRowIdKey],
	)

	const peerRow = $derived(
		peerQuery.data?.[0]?.row,
	)

	const fieldBag = $derived(
		(() => {
			const bag = peerRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object' || Array.isArray(bag)) return null
			return bag as Record<string, unknown>
		})(),
	)

	const peerId = $derived(
		(() => {
			const v = fieldBag?.peerId
			return typeof v === 'string' && v.length ? v : undefined
		})(),
	)

	const displayName = $derived(
		(() => {
			const v = fieldBag?.displayName
			return typeof v === 'string' && v.length ? v : undefined
		})(),
	)

	const joinedAt = $derived(
		(() => {
			const v = fieldBag?.joinedAt
			return typeof v === 'number' && Number.isFinite(v) ? v : undefined
		})(),
	)

	const lastSeenAt = $derived(
		(() => {
			const v = fieldBag?.lastSeenAt
			return typeof v === 'number' && Number.isFinite(v) ? v : undefined
		})(),
	)

	const connectedAt = $derived(
		(() => {
			const v = fieldBag?.connectedAt
			return typeof v === 'number' && Number.isFinite(v) ? v : undefined
		})(),
	)

	const disconnectedAt = $derived(
		(() => {
			const v = fieldBag?.disconnectedAt
			return typeof v === 'number' && Number.isFinite(v) ? v : undefined
		})(),
	)

	const isConnected = $derived(
		(() => {
			const v = fieldBag?.isConnected
			return typeof v === 'boolean' ? v : undefined
		})(),
	)

	const roomId = $derived(
		(() => {
			const room = fieldBag?.$room
			if (room == null || typeof room !== 'object' || Array.isArray(room)) return undefined
			const id = Reflect.get(room, 'id')
			return typeof id === 'string' && id.length ? id : undefined
		})(),
	)

	const displayTitle = $derived(
		displayName ?? peerId ?? entityId.id,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoomPeer}
	{entityId}
	title={titleProp ?? displayTitle}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Contact ID</dt>
				<dd>{entityId.id}</dd>
			</div>
			{#if peerId != null}
				<div>
					<dt>Peer ID</dt>
					<dd>{peerId}</dd>
				</div>
			{/if}
			{#if isConnected != null}
				<div>
					<dt>Connected</dt>
					<dd>{isConnected ? 'Yes' : 'No'}</dd>
				</div>
			{/if}
			{#if roomId != null}
				<div>
					<dt>Room</dt>
					<dd>{roomId}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadRoomPeer}
				{entityId}
			>
				<QueryBoundary
					query={peerQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No room peer row in collections yet.
						</p>
					{:else}
						<dl>
							<div>
								<dt>Contact ID</dt>
								<dd>{entityId.id}</dd>
							</div>
							{#if peerId != null}
								<div>
									<dt>Peer ID</dt>
									<dd>{peerId}</dd>
								</div>
							{/if}
							{#if displayName != null}
								<div>
									<dt>Display name</dt>
									<dd>{displayName}</dd>
								</div>
							{/if}
							{#if roomId != null}
								<div>
									<dt>Room</dt>
									<dd>{roomId}</dd>
								</div>
							{/if}
							{#if joinedAt != null}
								<div>
									<dt>Joined at</dt>
									<dd>{String(joinedAt)}</dd>
								</div>
							{/if}
							{#if lastSeenAt != null}
								<div>
									<dt>Last seen at</dt>
									<dd>{String(lastSeenAt)}</dd>
								</div>
							{/if}
							{#if connectedAt != null}
								<div>
									<dt>Connected at</dt>
									<dd>{String(connectedAt)}</dd>
								</div>
							{/if}
							{#if disconnectedAt != null}
								<div>
									<dt>Disconnected at</dt>
									<dd>{String(disconnectedAt)}</dd>
								</div>
							{/if}
							{#if isConnected != null}
								<div>
									<dt>Is connected</dt>
									<dd>{isConnected ? 'Yes' : 'No'}</dd>
								</div>
							{/if}
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
